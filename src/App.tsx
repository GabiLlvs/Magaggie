import { useCallback, useEffect, useState } from 'react'
import { AddSoundSheet } from './components/AddSoundSheet'
import { BubbleField } from './components/BubbleField'
import { EditSoundSheet } from './components/EditSoundSheet'
import { EmptyReef } from './components/EmptyReef'
import { SoundPadButton } from './components/SoundPadButton'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useSoundboard } from './hooks/useSoundboard'
import type { SoundPad } from './types'
import './App.css'

function tiltForIndex(i: number): number {
  const tilts = [-2.5, 1.5, -1, 2, -2, 1.8, -1.2, 2.2]
  return tilts[i % tilts.length]
}

export default function App() {
  const {
    state,
    loading,
    error,
    setError,
    activeCategoryId,
    setActiveCategoryId,
    visiblePads,
    addPad,
    updatePad,
    replaceAudio,
    removePad,
    reorderPad,
    addCategory,
    updateSettings,
    getAudioBlob,
  } = useSoundboard()

  const { play, stop, dispose } = useAudioEngine()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editPad, setEditPad] = useState<SoundPad | null>(null)
  const [newCollection, setNewCollection] = useState(false)

  useEffect(() => () => dispose(), [dispose])

  const handlePlay = useCallback(
    async (pad: SoundPad) => {
      if (!state) return
      const blob = await getAudioBlob(pad.id)
      if (!blob) {
        setError('Falta el audio de este pad. Reemplázalo desde editar.')
        return
      }
      if (playingId === pad.id) {
        stop(pad.id, setPlayingId)
        return
      }
      await play({
        padId: pad.id,
        blob,
        overlapMode: state.settings.overlapMode,
        onPlayingChange: setPlayingId,
      })
    },
    [getAudioBlob, play, playingId, setError, state, stop],
  )

  const onKeyPad = useCallback(
    (e: React.KeyboardEvent, pad: SoundPad, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        void handlePlay(pad)
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = document.querySelector<HTMLElement>(`[data-pad-index="${index + 1}"]`)
        next?.focus()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = document.querySelector<HTMLElement>(`[data-pad-index="${index - 1}"]`)
        prev?.focus()
      }
    },
    [handlePlay],
  )

  if (loading) {
    return (
      <div className="app app--loading">
        <p className="loading-text">Despertando el arrecife…</p>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="app app--loading">
        <p className="form-error" role="alert">
          {error ?? 'Algo salió mal.'}
        </p>
      </div>
    )
  }

  const categories = [...state.categories].sort((a, b) => a.order - b.order)

  return (
    <div className="app">
      <BubbleField />
      <header className="header">
        <div className="header__brand">
          <svg className="header__mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="oklch(0.78 0.12 210)" stroke="oklch(0.35 0.06 240)" strokeWidth="2" />
            <path d="M10 18c2 3 5 5 6 5s4-2 6-5" fill="none" stroke="oklch(0.35 0.06 240)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="14" r="1.5" fill="oklch(0.35 0.06 240)" />
            <circle cx="20" cy="14" r="1.5" fill="oklch(0.35 0.06 240)" />
          </svg>
          <div>
            <p className="header__title">{state.settings.boardName}</p>
            <p className="header__note">Guardado solo en este dispositivo</p>
          </div>
        </div>
        <label className="overlap-toggle">
          <span className="overlap-toggle__label">Modo solitario</span>
          <input
            type="checkbox"
            checked={state.settings.overlapMode === 'solo'}
            onChange={(e) =>
              void updateSettings({ overlapMode: e.target.checked ? 'solo' : 'overlap' })
            }
          />
          <span className="overlap-toggle__track" aria-hidden="true" />
        </label>
      </header>

      <nav className="categories" aria-label="Colecciones de sonidos">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`cat-chip${activeCategoryId === c.id ? ' cat-chip--active' : ''}`}
            onClick={() => setActiveCategoryId(c.id)}
            aria-current={activeCategoryId === c.id ? 'true' : undefined}
          >
            {c.name}
          </button>
        ))}
        {newCollection ? (
          <form
            className="cat-new"
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              const name = String(fd.get('name') ?? '')
              void addCategory(name).then(() => setNewCollection(false))
            }}
          >
            <input name="name" placeholder="Nombre de la colección" maxLength={24} autoFocus required />
            <button type="submit" className="cat-new__ok" aria-label="Crear colección">
              ✓
            </button>
          </form>
        ) : (
          <button type="button" className="cat-chip cat-chip--add" onClick={() => setNewCollection(true)}>
            + Colección
          </button>
        )}
      </nav>

      {error && (
        <div className="banner banner--error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Cerrar">
            ✕
          </button>
        </div>
      )}

      <main className="board" id="main">
        {visiblePads.length === 0 ? (
          <EmptyReef />
        ) : (
          <div className="pad-grid" role="list">
            {visiblePads.map((pad, index) => (
              <div
                key={pad.id}
                role="listitem"
                data-pad-index={index}
                onKeyDown={(e) => onKeyPad(e, pad, index)}
              >
                <SoundPadButton
                  pad={pad}
                  playing={playingId === pad.id}
                  tilt={tiltForIndex(index)}
                  onPlay={() => void handlePlay(pad)}
                  onEdit={() => setEditPad(pad)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="dock">
        <button type="button" className="btn btn--add" onClick={() => setAddOpen(true)}>
          <span className="btn--add__icon" aria-hidden="true">
            +
          </span>
          Agregar sonido
        </button>
      </div>

      <AddSoundSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        categories={categories}
        defaultCategoryId={activeCategoryId}
        onSave={async (data) => {
          await addPad(
            {
              name: data.name,
              color: data.color,
              sticker: data.sticker,
              categoryId: data.categoryId,
            },
            data.file,
          )
        }}
      />

      <EditSoundSheet
        pad={editPad}
        onClose={() => setEditPad(null)}
        categories={categories}
        onUpdate={updatePad}
        onReplaceFile={async (id, file) => {
          await replaceAudio(id, file)
        }}
        onDelete={removePad}
        onReorder={reorderPad}
      />
    </div>
  )
}
