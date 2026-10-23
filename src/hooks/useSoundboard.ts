import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SoundPad, SoundboardState, Category } from '../types'
import {
  createPadId,
  deleteAudioBlob,
  getAudioBlob,
  loadState,
  nextPadOrder,
  saveAudioBlob,
  saveState,
} from '../db/storage'
import { DEFAULT_CATEGORY_ID } from '../types'

export function useSoundboard() {
  const [state, setState] = useState<SoundboardState | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategoryId, setActiveCategoryId] = useState(DEFAULT_CATEGORY_ID)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadState()
      .then((s) => {
        setState(s)
        setActiveCategoryId(s.categories[0]?.id ?? DEFAULT_CATEGORY_ID)
      })
      .catch(() => setError('No se pudo cargar tu tablero en este navegador.'))
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback(async (next: SoundboardState) => {
    setState(next)
    try {
      await saveState(next)
    } catch {
      setError('No se pudieron guardar los cambios. El almacenamiento puede estar lleno o bloqueado.')
    }
  }, [])

  const visiblePads = useMemo(() => {
    if (!state) return []
    return state.pads
      .filter((p) =>
        activeCategoryId === DEFAULT_CATEGORY_ID
          ? true
          : p.categoryId === activeCategoryId,
      )
      .sort((a, b) => a.order - b.order)
  }, [state, activeCategoryId])

  const addPad = useCallback(
    async (pad: Omit<SoundPad, 'id' | 'order' | 'createdAt'>, blob: Blob) => {
      if (!state) return null
      const id = createPadId()
      const full: SoundPad = {
        ...pad,
        id,
        order: nextPadOrder(state.pads, pad.categoryId),
        createdAt: Date.now(),
      }
      await saveAudioBlob(id, blob)
      await persist({ ...state, pads: [...state.pads, full] })
      return full
    },
    [persist, state],
  )

  const updatePad = useCallback(
    async (id: string, patch: Partial<Omit<SoundPad, 'id'>>) => {
      if (!state) return
      const pads = state.pads.map((p) => (p.id === id ? { ...p, ...patch } : p))
      await persist({ ...state, pads })
    },
    [persist, state],
  )

  const replaceAudio = useCallback(
    async (id: string, blob: Blob) => {
      await saveAudioBlob(id, blob)
    },
    [],
  )

  const removePad = useCallback(
    async (id: string) => {
      if (!state) return
      await deleteAudioBlob(id)
      await persist({ ...state, pads: state.pads.filter((p) => p.id !== id) })
    },
    [persist, state],
  )

  const reorderPad = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      if (!state) return
      const target = state.pads.find((p) => p.id === id)
      if (!target) return
      const catPads = state.pads
        .filter((p) => p.categoryId === target.categoryId)
        .sort((a, b) => a.order - b.order)
      const idx = catPads.findIndex((p) => p.id === id)
      if (idx < 0) return
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= catPads.length) return
      const a = catPads[idx]
      const b = catPads[swapIdx]
      const pads = state.pads.map((p) => {
        if (p.id === a.id) return { ...p, order: b.order }
        if (p.id === b.id) return { ...p, order: a.order }
        return p
      })
      await persist({ ...state, pads })
    },
    [persist, state],
  )

  const addCategory = useCallback(
    async (name: string) => {
      if (!state) return
      const id = createPadId()
      const cat: Category = {
        id,
        name: name.trim() || 'Nueva colección',
        order: state.categories.length,
      }
      await persist({ ...state, categories: [...state.categories, cat] })
      setActiveCategoryId(id)
    },
    [persist, state],
  )

  const updateSettings = useCallback(
    async (patch: Partial<SoundboardState['settings']>) => {
      if (!state) return
      await persist({
        ...state,
        settings: { ...state.settings, ...patch },
      })
    },
    [persist, state],
  )

  return {
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
  }
}
