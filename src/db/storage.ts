import type { SoundboardState, SoundPad, Category, SoundboardSettings } from '../types'
import { DEFAULT_CATEGORY_ID } from '../types'

const DB_NAME = 'kawaii-soundboard-v1'
const DB_VERSION = 1
const META_KEY = 'state'
const AUDIO_STORE = 'audio'
const META_STORE = 'meta'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE)
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE)
      }
    }
  })
}

const LEGACY_LABELS: Record<string, string> = {
  'Reef sounds': 'Sonidos del arrecife',
  'All sounds': 'Todos los sonidos',
}

function localizeLegacyLabels(state: SoundboardState): { state: SoundboardState; migrated: boolean } {
  let changed = false
  const boardName = LEGACY_LABELS[state.settings.boardName] ?? state.settings.boardName
  if (boardName !== state.settings.boardName) changed = true
  const categories = state.categories.map((c) => {
    const name = LEGACY_LABELS[c.name] ?? c.name
    if (name !== c.name) changed = true
    return name === c.name ? c : { ...c, name }
  })
  if (!changed) return { state, migrated: false }
  return {
    migrated: true,
    state: {
      ...state,
      settings: { ...state.settings, boardName },
      categories,
    },
  }
}

function defaultState(): SoundboardState {
  const defaultCategory: Category = {
    id: DEFAULT_CATEGORY_ID,
    name: 'Todos los sonidos',
    order: 0,
  }
  const settings: SoundboardSettings = {
    overlapMode: 'overlap',
    boardName: 'Sonidos del arrecife',
  }
  return { settings, categories: [defaultCategory], pads: [] }
}

export async function loadState(): Promise<SoundboardState> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readonly')
    const req = tx.objectStore(META_STORE).get(META_KEY)
    req.onerror = () => reject(req.error ?? new Error('load failed'))
    req.onsuccess = () => {
      const raw = req.result as SoundboardState | undefined
      if (!raw) {
        resolve(defaultState())
        return
      }
      const { state, migrated } = localizeLegacyLabels(raw)
      if (migrated) {
        const wtx = db.transaction(META_STORE, 'readwrite')
        wtx.objectStore(META_STORE).put(state, META_KEY)
      }
      resolve(state)
    }
  })
}

export async function saveState(state: SoundboardState): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite')
    tx.objectStore(META_STORE).put(state, META_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('save failed'))
  })
}

export async function saveAudioBlob(padId: string, blob: Blob): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readwrite')
    tx.objectStore(AUDIO_STORE).put(blob, padId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('audio save failed'))
  })
}

export async function getAudioBlob(padId: string): Promise<Blob | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readonly')
    const req = tx.objectStore(AUDIO_STORE).get(padId)
    req.onerror = () => reject(req.error ?? new Error('audio load failed'))
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null)
  })
}

export async function deleteAudioBlob(padId: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readwrite')
    tx.objectStore(AUDIO_STORE).delete(padId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('audio delete failed'))
  })
}

export function createPadId(): string {
  return crypto.randomUUID()
}

export function nextPadOrder(pads: SoundPad[], categoryId: string): number {
  const inCat = pads.filter((p) => p.categoryId === categoryId)
  if (inCat.length === 0) return 0
  return Math.max(...inCat.map((p) => p.order)) + 1
}
