/** Audit Q/R condiviso fra stop Cursor e pre-commit Husky. */

const QUESTION_RE = /^[\s>\-*]*❓\s*Q\s*(\d+)?/i
const ANSWER_RE = /^[\s>\-*]*✅\s*R\s*(\d+)?\s*:?(.*)/i
const PLACEHOLDER_RE = /^[\s\-–—_.·•]*$|^(todo|tbd|n\/?a|\.\.\.|_+)$/i

export function isSubstantive(txt) {
  const alnum = (txt.match(/[\p{L}\p{N}]/gu) || []).length
  return alnum >= 3
}

export function auditQuestions(content) {
  const lines = content.split(/\r?\n/)
  const questions = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(QUESTION_RE)
    if (m) {
      const num = m[1] || String(questions.length + 1)
      const label = lines[i].replace(/❓\s*/, '').trim().slice(0, 60)
      questions.push({ idx: i, num, label })
    }
  }
  if (questions.length === 0) return { hasSection: false, unanswered: [] }

  const unanswered = []
  for (let q = 0; q < questions.length; q++) {
    const start = questions[q].idx
    const end = q + 1 < questions.length ? questions[q + 1].idx : lines.length
    let answerText = null
    for (let i = start; i < end; i++) {
      const a = lines[i].match(ANSWER_RE)
      if (!a) continue
      let txt = (a[2] || '').trim()
      if (!txt) {
        for (let j = i + 1; j < end; j++) {
          if (QUESTION_RE.test(lines[j]) || ANSWER_RE.test(lines[j])) break
          if (lines[j].trim()) {
            txt = lines[j].trim()
            break
          }
        }
      }
      answerText = txt
      break
    }
    if (answerText === null || PLACEHOLDER_RE.test(answerText) || !isSubstantive(answerText)) {
      unanswered.push(`Q${questions[q].num}`)
    }
  }
  return { hasSection: true, unanswered }
}
