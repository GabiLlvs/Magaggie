export function EmptyReef() {
  return (
    <div className="empty-reef">
      <svg
        className="empty-reef__art"
        viewBox="0 0 200 160"
        role="img"
        aria-label="Medusa kawaii flotando en el agua"
      >
        <ellipse cx="100" cy="118" rx="72" ry="18" fill="oklch(0.88 0.04 220 / 0.35)" />
        <path
          d="M100 28c-22 0-38 16-38 36 0 8 3 15 8 20v8c0 6 5 11 11 11h38c6 0 11-5 11-11v-8c5-5 8-12 8-20 0-20-16-36-38-36z"
          fill="oklch(0.82 0.08 310)"
          stroke="oklch(0.35 0.06 280)"
          strokeWidth="2.5"
        />
        <circle cx="88" cy="52" r="4" fill="oklch(0.25 0.04 280)" />
        <circle cx="112" cy="52" r="4" fill="oklch(0.25 0.04 280)" />
        <path
          d="M78 78c6 14 12 22 22 22s16-8 22-22M70 86c4 18 10 28 30 28s26-10 30-28"
          fill="none"
          stroke="oklch(0.75 0.1 310)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40 90 Q55 70 48 50"
          fill="none"
          stroke="oklch(0.7 0.12 200)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="48" cy="48" r="5" fill="oklch(0.75 0.14 200 / 0.8)" />
      </svg>
      <p className="empty-reef__title">Tu arrecife está en silencio</p>
      <p className="empty-reef__hint">
        Sube un audio y conviértelo en un pad sticker que puedas tocar cuando quieras.
      </p>
    </div>
  )
}
