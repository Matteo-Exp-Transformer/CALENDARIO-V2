import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'
import { Plus, Edit, Trash2, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import {
  useMenuQrCodes,
  useSaveMenuQrSettings,
  useDeleteMenuQrCode,
} from '../hooks/useMenuQrCodes'
import { useMenuCategories } from '../hooks/useMenuCategories'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'
import { MenuQrModal } from './MenuQrModal'
import { useTenantContext } from '@/contexts/TenantContext'
import { cn } from '@/lib/utils'
import type { MenuQrCode, MenuQrSettingsSavePayload } from '@/types/menu'
import type { CustomStaffPreset } from '../constants/presetMenus'

function buildPublicUrl(tenantSlug: string | null, shortCode: string): string {
  return `${window.location.origin}/menu/${tenantSlug}/qr/${shortCode}`
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Link copiato')
  } catch {
    toast.error('Impossibile copiare')
  }
}

async function downloadQrPng(url: string, name: string) {
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qr-menu-${name.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  } catch {
    toast.error('Errore generazione QR')
  }
}

interface QrRowProps {
  qr: MenuQrCode
  tenantSlug: string | null
  onEdit: (qr: MenuQrCode) => void
  onDelete: (qr: MenuQrCode) => void
  isDeleting: boolean
}

function QrRow({ qr, tenantSlug, onEdit, onDelete, isDeleting }: QrRowProps) {
  const url = buildPublicUrl(tenantSlug, qr.short_code)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (!canvasRef.current) return
    void QRCode.toCanvas(canvasRef.current, url, { width: 80, margin: 1 })
  }, [url])

  return (
    <div className="menu-prices-item-row flex-wrap gap-3 px-4 py-4 min-h-[88px]">
      <canvas ref={canvasRef} width={80} height={80} className="shrink-0 rounded-lg" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{qr.name}</span>
          {!qr.is_active && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Inattivo</span>
          )}
        </div>
        <p className="truncate text-xs text-gray-400">{url}</p>
      </div>

      <div className="menu-prices-item-actions flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="menu-prices-icon-btn"
          aria-label="Copia link"
          title="Copia link"
          onClick={() => void copyToClipboard(url)}
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="menu-prices-icon-btn"
          aria-label="Scarica QR PNG"
          title="Scarica QR PNG"
          onClick={() => void downloadQrPng(url, qr.name)}
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="menu-prices-icon-btn menu-prices-icon-btn--edit"
          aria-label={`Modifica ${qr.name}`}
          onClick={() => onEdit(qr)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="menu-prices-icon-btn menu-prices-icon-btn--delete"
          aria-label={`Elimina ${qr.name}`}
          disabled={isDeleting}
          onClick={() => onDelete(qr)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function MenuQrManager() {
  const { tenantSlug } = useTenantContext()
  const { data: qrCodes = [], isLoading } = useMenuQrCodes()
  const { data: categories = [] } = useMenuCategories()
  const { data: presets = [] } = useRestaurantSetting('booking_custom_staff_presets') as {
    data: CustomStaffPreset[]
  }

  const saveMutation = useSaveMenuQrSettings()
  const deleteMutation = useDeleteMenuQrCode()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MenuQrCode | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (qr: MenuQrCode) => {
    setEditing(qr)
    setModalOpen(true)
  }

  const handleDelete = (qr: MenuQrCode) => {
    if (!confirm(`Eliminare il QR "${qr.name}"? Il link smetterà di funzionare.`)) return
    deleteMutation.mutate(qr.id)
  }

  const handleSave = (payload: MenuQrSettingsSavePayload) => {
    saveMutation.mutate(payload, {
      onSuccess: () => setModalOpen(false),
    })
  }

  const isPending = saveMutation.isPending

  return (
    <div
      className={cn('relative w-full rounded-2xl border-2 p-4 md:p-6 shadow-lg')}
      style={ADMIN_WARM_GRADIENT_SURFACE}
      role="region"
      aria-label="Gestione QR menu"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-600 sm:text-sm">
            Ogni QR apre una versione pubblica del menu. Scansiona con il telefono per vedere l'anteprima.
          </p>
          <Button
            variant="success"
            size="sm"
            type="button"
            onClick={openCreate}
            className="h-9 shrink-0 gap-1.5 px-4 py-0 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuovo QR
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isLoading && <p className="py-8 text-center text-sm text-gray-500">Caricamento…</p>}
          {!isLoading && qrCodes.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-12 text-center text-sm text-gray-600">
              Nessun QR ancora. Crea il primo con il pulsante sopra.
            </p>
          )}
          {qrCodes.map((qr) => (
            <QrRow
              key={qr.id}
              qr={qr}
              tenantSlug={tenantSlug}
              onEdit={openEdit}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      </div>

      <MenuQrModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        isPending={isPending}
        editing={editing}
        categories={categories}
        presets={presets}
        baseUrl={window.location.origin}
      />
    </div>
  )
}
