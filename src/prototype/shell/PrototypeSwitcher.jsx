import { useEffect } from 'react'
import { VARIANT_NAMES, VARIANT_ORDER } from './labels.js'

// Floating bottom bar: arrows cycle variants, URL stays shareable.
// Hidden in production so a stray merge can never ship it.
export default function PrototypeSwitcher({ current, onChange }) {
  const index = VARIANT_ORDER.indexOf(current)

  const move = (step) =>
    onChange(
      VARIANT_ORDER[
        (index + step + VARIANT_ORDER.length) % VARIANT_ORDER.length
      ],
    )

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable)
        return
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (import.meta.env.PROD) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 text-xs text-neutral-50 shadow-lg ring-1 ring-white/10">
      <button
        type="button"
        aria-label="variant ก่อนหน้า"
        className="rounded-full px-2 py-1 hover:bg-white/10"
        onClick={() => move(-1)}
      >
        ←
      </button>
      <span className="px-1 font-medium">
        {current} — {VARIANT_NAMES[current]}
      </span>
      <button
        type="button"
        aria-label="variant ถัดไป"
        className="rounded-full px-2 py-1 hover:bg-white/10"
        onClick={() => move(1)}
      >
        →
      </button>
    </div>
  )
}
