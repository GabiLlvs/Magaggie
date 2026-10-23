import { ACCEPTED_MIME, MAX_FILE_BYTES } from '../types'

const EXT_OK = /\.(mp3|wav|ogg|webm|m4a)$/i

export type ValidationResult =
  | { ok: true; file: File }
  | { ok: false; message: string }

export function validateAudioFile(file: File): ValidationResult {
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: `Este archivo es demasiado grande. El máximo es ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB.`,
    }
  }
  const mimeOk = file.type ? ACCEPTED_MIME.has(file.type) : false
  const extOk = EXT_OK.test(file.name)
  if (!mimeOk && !extOk) {
    return {
      ok: false,
      message: 'Usa archivos de audio MP3, WAV, OGG o WebM.',
    }
  }
  return { ok: true, file }
}
