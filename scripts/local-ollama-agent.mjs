#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const root = process.cwd();
const defaultModeDir = path.join(
  root,
  'docs',
  '_lavoro',
  'Per matteo',
  'test-modelli-locali',
  'local-agent',
  'modes',
);

function parseArgs(argv) {
  const args = {
    host: 'http://127.0.0.1:11434',
    model: 'qwen3-coder:30b',
    mode: 'plain',
    prompt: '',
    skills: '',
    files: '',
    context: 32768,
    temperature: 0.1,
    repoRules: false,
    save: '',
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (key === '--help' || key === '-h') {
      args.help = true;
    } else if (key === '--host') {
      args.host = next; i += 1;
    } else if (key === '--model') {
      args.model = next; i += 1;
    } else if (key === '--mode') {
      args.mode = next; i += 1;
    } else if (key === '--prompt') {
      args.prompt = next; i += 1;
    } else if (key === '--prompt-file') {
      args.prompt = fs.readFileSync(path.resolve(root, next), 'utf8'); i += 1;
    } else if (key === '--skills') {
      args.skills = next; i += 1;
    } else if (key === '--files') {
      args.files = next; i += 1;
    } else if (key === '--context') {
      args.context = Number(next); i += 1;
    } else if (key === '--temperature') {
      args.temperature = Number(next); i += 1;
    } else if (key === '--repo-rules') {
      args.repoRules = true;
    } else if (key === '--save') {
      args.save = next; i += 1;
    } else {
      throw new Error(`Argomento non riconosciuto: ${key}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Uso:
  node scripts/local-ollama-agent.mjs --model qwen3-coder:30b --mode ask --prompt "ciao"

Opzioni:
  --model <nome>         Modello Ollama, es. gpt-oss:20b
  --mode <nome>          plain | ask | debug | code | architect
  --prompt <testo>       Prompt utente
  --prompt-file <path>   Legge il prompt utente da file
  --skills <lista>       Skill wrapper da iniettare, es. routing,admin
  --files <lista>        File reali da iniettare, separati da virgola
  --repo-rules           Inietta anche AGENTS.md
  --context <numero>     num_ctx Ollama, default 32768
  --temperature <num>    Temperatura, default 0.1
  --save <path>          Salva prompt e risposta in markdown
`);
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function loadMode(modeName) {
  const filePath = path.join(defaultModeDir, `${modeName}.md`);
  const content = readIfExists(filePath);
  if (!content) {
    throw new Error(`Mode non trovato: ${filePath}`);
  }
  return content.trim();
}

function skillPath(skillName) {
  const normalized = skillName.startsWith('calendarbackup-')
    ? skillName
    : `calendarbackup-${skillName}`;
  const localAgentSkill = path.join(
    root,
    'docs',
    '_lavoro',
    'Per matteo',
    'test-modelli-locali',
    'local-agent',
    'skills',
    `${normalized}.md`,
  );
  if (fs.existsSync(localAgentSkill)) return localAgentSkill;
  return '';
}

function loadSkills(skillCsv) {
  if (!skillCsv.trim()) return '';
  const chunks = [];
  for (const raw of skillCsv.split(',')) {
    const name = raw.trim();
    if (!name) continue;
    const filePath = skillPath(name);
    if (!filePath) {
      chunks.push(`## Skill non trovata: ${name}`);
      continue;
    }
    chunks.push(`## Skill: ${name}\n\n${fs.readFileSync(filePath, 'utf8').trim()}`);
  }
  return chunks.join('\n\n---\n\n');
}

function loadFiles(fileCsv) {
  if (!fileCsv.trim()) return '';
  const chunks = [];
  for (const raw of fileCsv.split(',')) {
    const relative = raw.trim();
    if (!relative) continue;
    const filePath = path.resolve(root, relative);
    if (!filePath.startsWith(root)) {
      chunks.push(`## File rifiutato fuori workspace: ${relative}`);
      continue;
    }
    if (!fs.existsSync(filePath)) {
      chunks.push(`## File non trovato: ${relative}`);
      continue;
    }
    chunks.push(`## File letto: ${relative}\n\n${fs.readFileSync(filePath, 'utf8').trim()}`);
  }
  return chunks.join('\n\n---\n\n');
}

function buildSystemPrompt(args) {
  const parts = [loadMode(args.mode)];
  if (args.repoRules) {
    const agents = readIfExists(path.join(root, 'AGENTS.md'));
    if (agents) parts.push(`## AGENTS.md\n\n${agents.trim()}`);
  }
  const skills = loadSkills(args.skills);
  if (skills) parts.push(`## Skill iniettate\n\n${skills}`);
  const files = loadFiles(args.files);
  if (files) parts.push(`## File reali iniettati\n\n${files}`);
  parts.push(`## Regola anti-falsa lettura

Considera "letti" solo i testi realmente presenti in questo prompt di sistema o nel prompt utente.
I file citati da una skill ma non inclusi integralmente sono "da leggere", non "letti".
Se non hai accesso a un file, diff, log o output, scrivi "non verificato".`);
  return parts.join('\n\n---\n\n');
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.prompt.trim()) {
    throw new Error('Manca --prompt o --prompt-file');
  }

  const system = buildSystemPrompt(args);
  const payload = {
    model: args.model,
    system,
    prompt: args.prompt,
    stream: false,
    options: {
      num_ctx: args.context,
      temperature: args.temperature,
    },
  };

  const started = performance.now();
  const response = await fetch(`${args.host.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const elapsedSeconds = ((performance.now() - started) / 1000).toFixed(1);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama HTTP ${response.status}: ${body}`);
  }

  const json = await response.json();
  const output = json.response ?? '';

  console.log(`MODEL=${args.model}`);
  console.log(`MODE=${args.mode}`);
  console.log(`SKILLS=${args.skills || '(none)'}`);
  console.log(`TIME_SECONDS=${elapsedSeconds}`);
  console.log('');
  console.log(output.trim());

  if (args.save) {
    const savePath = path.resolve(root, args.save);
    const md = [
      `# Local Ollama Agent Run`,
      ``,
      `- Model: \`${args.model}\``,
      `- Mode: \`${args.mode}\``,
      `- Skills: \`${args.skills || '(none)'}\``,
      `- Context: \`${args.context}\``,
      `- Temperature: \`${args.temperature}\``,
      `- Time: \`${elapsedSeconds}s\``,
      ``,
      `## Prompt`,
      ``,
      args.prompt,
      ``,
      `## Response`,
      ``,
      output.trim(),
      ``,
    ].join('\n');
    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(savePath, md, 'utf8');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
