import { useEffect, useRef, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { PAD_COLORS, STICKER_OPTIONS, DEFAULT_CATEGORY_ID } from '../types'
import type { Category } from '../types'
import { validateAudioFile } from '../utils/validateAudio'

type Props = {
  open: boolean
  onClose: () => void
  categories: Category[]
  defaultCategoryId: string
  onSave: (data: {
    name: string
    color: string
    sticker: string
    categoryId: string
    file: File
  }) => Promise<void>
}

export function AddSoundSheet({
  open,
  onClose,
  categories,
  defaultCategoryId,
  onSave,
}: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(PAD_COLORS[0] as string)
  const [sticker, setSticker] = useState<string>(STICKER_OPTIONS[1])
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (open) {
      setCategoryId(defaultCategoryId)
      setError(null)
    } else {
      setName('')
      setFile(null)
      setColor(PAD_COLORS[0])
      setSticker(STICKER_OPTIONS[1])
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [open, defaultCategoryId])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const pickFile = (f: File) => {
    const v = validateAudioFile(f)
    if (!v.ok) {
      setError(v.message)
      return
    }
    setError(null)
    setFile(v.file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(v.file))
    if (!name.trim()) {
      const base = v.file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      setName(base.slice(0, 40))
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  const submit = async () => {
    if (!file) {
      setError('Elige un archivo de audio primero.')
      return
    }
    if (!name.trim()) {
      setError('Ponle un nombre al sonido.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        color,
        sticker,
        categoryId: categoryId || DEFAULT_CATEGORY_ID,
        file,
      })
      onClose()
    } catch {
      setError('No se pudo guardar este sonido. Prueba con un archivo más pequeño.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <BottomSheet open={open} title="Nuevo sonido sticker" onClose={onClose}>
      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.webm,.m4a"
          className="visually-hidden"
          id="add-audio-file"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) pickFile(f)
          }}
        />
        <label htmlFor="add-audio-file" className="drop-zone__label">
          {file ? file.name : 'Toca para elegir audio, o suelta un archivo aquí'}
        </label>
      </div>

      {previewUrl && (
        <div className="preview-block">
          <audio ref={previewRef} src={previewUrl} controls className="preview-block__audio" />
        </div>
      )}

      <label className="field">
        <span className="field__label">Nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={48}
          placeholder="Chapuzón glu"
          autoComplete="off"
        />
      </label>

      <fieldset className="field">
        <legend className="field__label">Color del sticker</legend>
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
        <legend className="field__label">Icono del sticker</legend>
        <div className="sticker-row">
          {STICKER_OPTIONS.map((s) => (
            <button
              key={s || 'none'}
              type="button"
              className={`sticker-pick${sticker === s ? ' sticker-pick--on' : ''}`}
              onClick={() => setSticker(s)}
              aria-label={s ? `Icono ${s}` : 'Sin icono'}
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

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="btn btn--primary btn--full" disabled={saving} onClick={submit}>
        {saving ? 'Guardando…' : 'Agregar al tablero'}
      </button>
    </BottomSheet>
  )
}
