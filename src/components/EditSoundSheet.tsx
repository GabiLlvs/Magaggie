import { useEffect, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { PAD_COLORS, STICKER_OPTIONS } from '../types'
import type { SoundPad, Category } from '../types'
import { validateAudioFile } from '../utils/validateAudio'

type Props = {
  pad: SoundPad | null
  onClose: () => void
  categories: Category[]
  onUpdate: (id: string, patch: Partial<SoundPad>) => Promise<void>
  onReplaceFile: (id: string, file: File) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReorder: (id: string, direction: 'up' | 'down') => Promise<void>
}

export function EditSoundSheet({
  pad,
  onClose,
  categories,
  onUpdate,
  onReplaceFile,
  onDelete,
  onReorder,
}: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(PAD_COLORS[0])
  const [sticker, setSticker] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (pad) {
      setName(pad.name)
      setColor(pad.color)
      setSticker(pad.sticker)
      setCategoryId(pad.categoryId)
      setConfirmDelete(false)
      setError(null)
    }
  }, [pad])

  if (!pad) {
    return null
  }

  const saveMeta = async () => {
    if (!name.trim()) {
      setError('El nombre no puede estar vacío.')
      return
    }
    await onUpdate(pad.id, {
      name: name.trim(),
      color,
      sticker,
      categoryId,
    })
    onClose()
  }

  const replace = async (file: File) => {
    const v = validateAudioFile(file)
    if (!v.ok) {
      setError(v.message)
      return
    }
    await onReplaceFile(pad.id, v.file)
    setError(null)
  }

  const del = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    await onDelete(pad.id)
    onClose()
  }

  return (
    <BottomSheet open={!!pad} title="Editar sticker" onClose={onClose}>
      <label className="field">
        <span className="field__label">Nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={48}
        />
      </label>

      <fieldset className="field">
        <legend className="field__label">Color</legend>
        <div className="color-row" role="radiogroup" aria-label="Color del pad">
          {PAD_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              className={`color-swatch${color === c ? ' color-swatch--on' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Icono</legend>
        <div className="sticker-row">
          {STICKER_OPTIONS.map((s) => (
            <button
              key={s || 'none'}
              type="button"
              className={`sticker-pick${sticker === s ? ' sticker-pick--on' : ''}`}
              onClick={() => setSticker(s)}
            >
              {s || '—'}
            </button>
          ))}
        </div>
      </fieldset>

      {categories.length > 1 && (
        <label className="field">
          <span className="field__label">Colección</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="edit-actions">
        <label className="btn btn--ghost btn--full">
          Reemplazar audio
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.webm,.m4a"
            className="visually-hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void replace(f)
            }}
          />
        </label>
        <div className="edit-actions__row">
          <button type="button" className="btn btn--ghost" onClick={() => void onReorder(pad.id, 'up')}>
            Mover antes
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => void onReorder(pad.id, 'down')}>
            Mover después
          </button>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="btn btn--primary btn--full" onClick={() => void saveMeta()}>
        Guardar cambios
      </button>
      <button
        type="button"
        className={`btn btn--danger btn--full${confirmDelete ? ' btn--danger-confirm' : ''}`}
        onClick={() => void del()}
      >
        {confirmDelete ? 'Toca otra vez para eliminar' : 'Quitar sonido'}
      </button>
    </BottomSheet>
  )
}
