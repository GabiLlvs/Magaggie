import { useCallback, useRef } from 'react'
import type { OverlapMode } from '../types'

type PlayOptions = {
  padId: string
  blob: Blob
  overlapMode: OverlapMode
  onPlayingChange: (padId: string | null) => void
}

const TAP_COOLDOWN_MS = 120

export function useAudioEngine() {
  const activeRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const lastTapRef = useRef<Map<string, number>>(new Map())
  const objectUrlsRef = useRef<Map<string, string>>(new Map())

  const revokeUrl = useCallback((padId: string) => {
    const url = objectUrlsRef.current.get(padId)
    if (url) {
      URL.revokeObjectURL(url)
      objectUrlsRef.current.delete(padId)
    }
  }, [])

  const stopPad = useCallback((padId: string) => {
    const audio = activeRef.current.get(padId)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      activeRef.current.delete(padId)
    }
    revokeUrl(padId)
  }, [revokeUrl])

  const stopAll = useCallback(() => {
    for (const padId of activeRef.current.keys()) {
      stopPad(padId)
    }
  }, [stopPad])

  const play = useCallback(
    async ({ padId, blob, overlapMode, onPlayingChange }: PlayOptions) => {
      const now = Date.now()
      const last = lastTapRef.current.get(padId) ?? 0
      if (now - last < TAP_COOLDOWN_MS) return
      lastTapRef.current.set(padId, now)

      if (overlapMode === 'solo') {
        stopAll()
      } else {
        stopPad(padId)
      }

      revokeUrl(padId)
      const url = URL.createObjectURL(blob)
      objectUrlsRef.current.set(padId, url)

      const audio = new Audio(url)
      activeRef.current.set(padId, audio)
      onPlayingChange(padId)

      audio.onended = () => {
        activeRef.current.delete(padId)
        revokeUrl(padId)
        onPlayingChange(null)
      }
      audio.onerror = () => {
        activeRef.current.delete(padId)
        revokeUrl(padId)
        onPlayingChange(null)
      }

      try {
        await audio.play()
      } catch {
        activeRef.current.delete(padId)
        revokeUrl(padId)
        onPlayingChange(null)
      }
    },
    [revokeUrl, stopAll, stopPad],
  )

  const stop = useCallback(
    (padId: string, onPlayingChange: (id: string | null) => void) => {
      stopPad(padId)
      onPlayingChange(null)
    },
    [stopPad],
  )

  const dispose = useCallback(() => {
    stopAll()
    for (const url of objectUrlsRef.current.values()) {
      URL.revokeObjectURL(url)
    }
    objectUrlsRef.current.clear()
  }, [stopAll])

  return { play, stop, stopAll, dispose }
}
