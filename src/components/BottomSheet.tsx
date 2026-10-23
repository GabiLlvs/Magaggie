import { useEffect, useId, useRef, type ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="sheet__panel">
        <div className="sheet__handle" aria-hidden="true" />
        <header className="sheet__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </dialog>
  )
}
