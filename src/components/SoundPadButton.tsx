import type { SoundPad } from '../types'

type Props = {
  pad: SoundPad
  playing: boolean
  tilt: number
  onPlay: () => void
  onEdit: () => void
}

export function SoundPadButton({ pad, playing, tilt, onPlay, onEdit }: Props) {
  return (
    <div className="pad-wrap" style={{ ['--pad-tilt' as string]: `${tilt}deg` }}>
      <button
        type="button"
        className={`sound-pad${playing ? ' sound-pad--playing' : ''}`}
        style={{ ['--pad-color' as string]: pad.color }}
        onClick={onPlay}
        aria-label={`Reproducir ${pad.name}${playing ? ', en reproducción' : ''}`}
        aria-pressed={playing}
      >
        {pad.sticker ? (
          <span className="sound-pad__sticker" aria-hidden="true">
            {pad.sticker}
          </span>
        ) : (
          <span className="sound-pad__wave" aria-hidden="true">
            <svg viewBox="0 0 32 20" width="32" height="20">
              <path
                d="M2 10 Q6 4 10 10 T18 10 T26 10 T30 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <span className="sound-pad__name">{pad.name}</span>
        {playing && (
          <span className="sound-pad__pulse" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className="pad-edit"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        aria-label={`Editar ${pad.name}`}
      >
        ⋯
      </button>
    </div>
  )
}
