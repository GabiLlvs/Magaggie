import { useMemo } from 'react'

type Bubble = { id: number; left: number; size: number; delay: number; duration: number }

export function BubbleField() {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 8 + ((i * 17) % 84),
      size: 6 + (i % 4) * 4,
      delay: i * 1.7,
      duration: 14 + (i % 5) * 3,
    }))
  }, [])

  return (
    <div className="bubble-field" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble-field__bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
