import type { FC } from 'react'
import { LayoutDashboard } from 'lucide-react'

export const AdminHomePage: FC = () => (
  <div className="flex min-h-0 flex-1 items-center justify-center bg-[var(--color-bg)] px-4 py-12">
    <div className="max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
      <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-primary-600" aria-hidden />
      <h1 className="text-lg font-semibold text-primary-900">Home</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Coming soon</p>
    </div>
  </div>
)
