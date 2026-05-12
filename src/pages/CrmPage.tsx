import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { useCustomers } from '@/features/booking/hooks/useCustomers'
import type { CustomerProfile } from '@/types/customer'
import { CustomerSearchBar } from '@/features/booking/components/crm/CustomerSearchBar'
import { CustomerListTable } from '@/features/booking/components/crm/CustomerListTable'
import { CustomerDetailPanel } from '@/features/booking/components/crm/CustomerDetailPanel'
import { CustomerFormModal } from '@/features/booking/components/crm/CustomerFormModal'

export const CrmPage: FC = () => {
  const { customers, isLoading, error, searchQuery, setSearchQuery, dateFilter, setDateFilter } = useCustomers()
  const [selected, setSelected] = useState<CustomerProfile | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formProfile, setFormProfile] = useState<CustomerProfile | null>(null)

  const openCreate = () => {
    setFormMode('create')
    setFormProfile(null)
    setFormOpen(true)
  }

  const openEdit = (p: CustomerProfile) => {
    setFormMode('edit')
    setFormProfile(p)
    setFormOpen(true)
  }

  const openDetail = (p: CustomerProfile) => {
    setSelected(p)
    setPanelOpen(true)
  }

  const handleRowSelect = (p: CustomerProfile) => {
    setSelected(p)
  }

  useEffect(() => {
    setSelected((prev) => {
      if (!prev?.email) return prev
      const next = customers.find((c) => c.email === prev.email)
      if (!next) return prev
      if (
        next.name === prev.name &&
        next.notes === prev.notes &&
        next.phone === prev.phone &&
        next.manual_id === prev.manual_id &&
        next.booking_count === prev.booking_count &&
        next.last_booking_date === prev.last_booking_date
      ) {
        return prev
      }
      return next
    })
  }, [customers])

  return (
    <div className="min-h-0 flex-1 bg-[var(--color-bg)] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-primary-900 md:text-2xl">CRM Clienti</h1>
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            + Nuovo cliente
          </Button>
        </div>

        <CustomerSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error.message}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Caricamento…</p>
        ) : (
          <CustomerListTable
            rows={customers}
            selectedEmail={selected?.email ?? null}
            onSelect={handleRowSelect}
            onOpenDetail={openDetail}
            onEdit={openEdit}
          />
        )}
      </div>

      <CustomerDetailPanel
        profile={selected}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onEditContacts={() => selected && openEdit(selected)}
      />

      <CustomerFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        initialProfile={formProfile}
      />
    </div>
  )
}
