import type { FeatureFlags } from '@/config/features'

export type AdminShellSection = 'home' | 'prenotazioni' | 'crm' | 'servizio' | 'analytics'

type ShellFeatureFlags = Pick<FeatureFlags, 'sidebar' | 'home' | 'crm' | 'servizio' | 'analytics'>

const ADMIN_SECTION_SLUGS: Record<AdminShellSection, string> = {
  home: 'home',
  prenotazioni: 'prenotazioni',
  crm: 'crm',
  servizio: 'servizio',
  analytics: 'analytics',
}

const ADMIN_SECTION_FROM_SLUG = Object.fromEntries(
  Object.entries(ADMIN_SECTION_SLUGS).map(([section, slug]) => [slug, section]),
) as Record<string, AdminShellSection>

export function getDefaultAdminSection(features: ShellFeatureFlags): AdminShellSection {
  if (!features.sidebar) return 'prenotazioni'
  return features.home ? 'home' : 'prenotazioni'
}

export function isAdminSectionEnabled(
  section: AdminShellSection,
  features: ShellFeatureFlags,
): boolean {
  if (section === 'prenotazioni') return true
  if (section === 'home') return features.sidebar && features.home
  return features.sidebar && features[section]
}

export function getAdminSectionPath(section: AdminShellSection): string {
  if (section === 'home') return '/admin'
  return `/admin/${ADMIN_SECTION_SLUGS[section]}`
}

export function resolveAdminSectionFromPath(
  pathname: string,
  features: ShellFeatureFlags,
): AdminShellSection {
  if (!features.sidebar) return 'prenotazioni'

  const normalized = pathname.replace(/\/+$/, '') || '/admin'
  const [, adminRoot, sectionSlug] = normalized.split('/')
  if (adminRoot !== 'admin' || !sectionSlug) return getDefaultAdminSection(features)

  const section = ADMIN_SECTION_FROM_SLUG[sectionSlug]
  if (!section) return getDefaultAdminSection(features)
  return isAdminSectionEnabled(section, features) ? section : getDefaultAdminSection(features)
}

export async function runGuardedAdminLogout(
  confirmNavigation: () => Promise<boolean>,
  logout: () => Promise<void>,
): Promise<void> {
  if (!(await confirmNavigation())) return
  await logout()
}
