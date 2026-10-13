import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useSiteStore } from '../site-store.js'
import { HEADINGS, TIER_LABELS } from './labels.js'
import PrevNext from './PrevNext.jsx'
import { pagesInLadderOrder } from './registry.js'
import Section from './Section.jsx'
import SolutionCode from './SolutionCode.jsx'

// One template renders every page from its record, seven sections in order.
// Static chrome is written once here; the record supplies the content.
export default function PageTemplate({ page }) {
  const markVisited = useSiteStore((state) => state.markVisited)
  const revealOpen = useSiteStore((state) =>
    state.revealed.includes(page.slug),
  )
  const toggleRevealed = useSiteStore((state) => state.toggleRevealed)

  // Progress means "this page has been opened", nothing more.
  useEffect(() => {
    markVisited(page.slug)
  }, [markVisited, page.slug])

  // Neighbours derive from page number, never from a second hand-written order.
  const ordered = pagesInLadderOrder()
  const index = ordered.findIndex((item) => item.slug === page.slug)
  const previous = ordered[index - 1] ?? null
  const next = ordered[index + 1] ?? null

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
      {/* 1. Page header */}
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            หน้า {page.number} · {TIER_LABELS[page.tier]}
          </p>
          <PrevNext previous={previous} next={next} />
        </div>
        <h1 className="text-2xl font-medium">{page.titleTh}</h1>
      </header>

      {/* 2. Goal demo — always visible from the first paint */}
      <Section heading={HEADINGS.demo}>
        <div className="grid place-items-center rounded-xl border bg-muted/20 p-10">
          <page.Demo />
        </div>
      </Section>

      {/* 3. Exercise brief */}
      <Section heading={HEADINGS.brief}>
        <p className="text-sm leading-relaxed">{page.briefTh}</p>
      </Section>

      {/* 4. Acceptance criteria — the check glyph is decorative */}
      <Section heading={HEADINGS.criteria}>
        <ul className="grid gap-1.5 text-sm">
          {page.criteriaTh.map((criterion, criterionIndex) => (
            <li key={criterionIndex} className="flex gap-2">
              <span aria-hidden="true" className="text-muted-foreground">
                ✓
              </span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Trap callout */}
      <Section heading={HEADINGS.trap}>
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          {page.trapsTh}
        </p>
      </Section>

      {/* 6. Hints — a flat list, all visible */}
      <Section heading={HEADINGS.hints}>
        <ol className="grid gap-1.5 text-sm">
          {page.hintsTh.map((hint, hintIndex) => (
            <li key={hintIndex} className="flex gap-2">
              <span className="text-muted-foreground">{hintIndex + 1}.</span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 7. Solution reveal — collapsed by default, code only */}
      <Section
        heading={HEADINGS.reveal}
        action={
          <Button
            size="sm"
            variant={revealOpen ? 'outline' : 'default'}
            onClick={() => toggleRevealed(page.slug)}
          >
            {revealOpen ? 'ซ่อนเฉลย' : 'ดูเฉลย'}
          </Button>
        }
      >
        {revealOpen ? <SolutionCode files={page.solutionFiles} /> : null}
      </Section>
    </article>
  )
}
