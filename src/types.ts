export type OverlapMode = 'overlap' | 'solo'

export interface Category {
  id: string
  name: string
  order: number
}

export interface SoundPad {
  id: string
  name: string
  color: string
  sticker: string
  categoryId: string
  order: number
  createdAt: number
}

export interface SoundboardSettings {
  overlapMode: OverlapMode
  boardName: string
}

export interface SoundboardState {
  settings: SoundboardSettings
  categories: Category[]
  pads: SoundPad[]
}

export const DEFAULT_CATEGORY_ID = 'default'

export const PAD_COLORS = [
  '#5ec8e8',
  '#7bdcb5',
  '#f4a4c0',
  '#c9a0ff',
  '#ffb347',
  '#ff8fab',
  '#89cff0',
  '#b5ead7',
] as const

export const STICKER_OPTIONS = [
  '',
  '🐠',
  '🐙',
  '🦑',
  '🐚',
  '⭐',
  '💫',
  '🫧',
  '💕',
  '🌊',
  '🎀',
  '✨',
] as const

export const MAX_FILE_BYTES = 10 * 1024 * 1024

export const ACCEPTED_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
])
