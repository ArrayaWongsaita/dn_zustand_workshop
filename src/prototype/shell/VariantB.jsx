import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSiteStore } from '@/src/workshop/site-store.js'
import { HEADINGS, LADDER, TIER_LABELS, TIER_ORDER } from './labels.js'
import SolutionCode from './SolutionCode.jsx'

// Variant B — Top rail + reading column.
// No sidebar at all: navigation is a sticky rail of twelve numbered stops along
// the top. The demo is a full-bleed band above the text; the reveal opens as a
// full-width band below it, never inline in the reading column.
function Rail({ current, link }) {
  const visited = useSiteStore((state) => state.visited)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="flex items-center gap-4 px-6 py-3">
        <Link
          to={link('/prototype/shell')}
          className="shrink-0 text-sm font-medium"
        >
          เวิร์กช็อป Zustand
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          {LADDER.map((row) => {
            const active = current?.slug === row.slug
            const base =
              'grid size-7 place-items-center rounded-full border text-xs tabular-nums'
            if (!row.built) {
              return (
                <span
                  key={row.slug}
                  title={row.titleTh}
                  className={`${base} border-border text-muted-foreground/50`}
                >
                  {row.number}
                </span>
              )
            }
            return (
              <Link
                key={row.slug}
                title={row.titleTh}
                to={link(`/prototype/shell/${row.slug}`)}
                className={`${base} ${
                  active ? 'border-foreground bg-foreground text-background' : ''
                } ${visited.includes(row.slug) && !active ? 'bg-muted' : ''}`}
              >
                {row.number}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

function PrevNext({ page, pages, link }) {
  const index = pages.findIndex((p) => p.slug === page.slug)
  const previous = pages[index - 1]
  const next = pages[index + 1]
  return (
    <div className="flex items-center justify-between gap-3">
      {previous ? (
        <Link
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          to={link(`/prototype/shell/${previous.slug}`)}
        >
          ← {previous.titleTh}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          to={link(`/prototype/shell/${next.slug}`)}
        >
          {next.titleTh} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

function PageView({ page, pages, link }) {
  const revealed = useSiteStore((state) => state.revealed.includes(page.slug))
  const toggleRevealed = useSiteStore((state) => state.toggleRevealed)

  return (
    <div className="pb-24">
      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-3xl gap-4 px-6 py-8">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              หน้า {page.number} · {TIER_LABELS[page.tier]} · {HEADINGS.demo}
            </span>
          </div>
          <div className="grid place-items-center rounded-xl border bg-background p-10">
            <page.Demo />
          </div>
        </div>
      </section>

      <article className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10">
        <h1 className="text-2xl font-medium">{page.titleTh}</h1>
        <PrevNext page={page} pages={pages} link={link} />

        <section className="grid gap-2">
          <h2 className="text-sm font-medium">{HEADINGS.brief}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {page.briefTh}
          </p>
        </section>

        <section className="grid gap-2">
          <h2 className="text-sm font-medium">{HEADINGS.criteria}</h2>
          <ul className="grid list-disc gap-1.5 pl-5 text-sm text-muted-foreground">
            {page.criteriaTh.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </section>

        <section className="grid gap-2">
          <h2 className="text-sm font-medium">{HEADINGS.trap}</h2>
          <p className="border-l-2 border-amber-500 pl-3 text-sm">
            {page.trapsTh}
          </p>
        </section>

        <section className="grid gap-2">
          <h2 className="text-sm font-medium">{HEADINGS.hints}</h2>
          <ol className="grid list-decimal gap-1.5 pl-5 text-sm text-muted-foreground">
            {page.hintsTh.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        </section>
      </article>

      <section className="border-t">
        <div className="mx-auto grid max-w-2xl gap-3 px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">{HEADINGS.reveal}</h2>
            <Button
              size="sm"
              variant={revealed ? 'outline' : 'default'}
              onClick={() => toggleRevealed(page.slug)}
            >
              {revealed ? 'ซ่อนเฉลย' : 'ดูเฉลย'}
            </Button>
          </div>
          {revealed ? (
            <SolutionCode files={page.solutionFiles} />
          ) : (
            <p className="text-sm text-muted-foreground">
              ลองเขียนเองก่อน แล้วค่อยเปิดดู
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function HomeView({ link }) {
  return (
    <div className="pb-24">
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-3xl font-medium">เวิร์กช็อป Zustand</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            บันได 12 หน้า ไล่จาก store ง่าย ๆ ไปจนถึง store ที่ใช้ทั้งแอป
            แต่ละหน้าตั้งแต่ชั้น 1 ถึงชั้น 3c
          </p>
          <Link
            className={`${buttonVariants({ size: 'lg' })} mt-6`}
            to={link('/prototype/shell/01-counter')}
          >
            เริ่มที่หน้า 1 →
          </Link>
        </div>
      </section>
      <div className="mx-auto max-w-2xl px-6 py-10">
        {TIER_ORDER.map((tier) => (
          <section key={tier} className="grid gap-2 py-4">
            <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
              {TIER_LABELS[tier]}
            </h2>
            <ol className="grid divide-y">
              {LADDER.filter((row) => row.tier === tier).map((row) => (
                <li key={row.slug} className="flex items-baseline gap-4 py-2">
                  <span className="w-5 text-sm tabular-nums text-muted-foreground">
                    {row.number}
                  </span>
                  {row.built ? (
                    <Link
                      className="text-sm underline"
                      to={link(`/prototype/shell/${row.slug}`)}
                    >
                      {row.titleTh}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground/60">
                      {row.titleTh}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
        <p className="pt-6 text-sm">
          ก่อนเริ่ม:{' '}
          <span className="text-muted-foreground">
            หน้าเริ่มต้น (setup) — สร้างโปรเจกต์ของผู้เรียน
          </span>
        </p>
      </div>
    </div>
  )
}

export default function VariantB({ pages, current, link }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Rail current={current} link={link} />
      {current ? (
        <PageView page={current} pages={pages} link={link} />
      ) : (
        <HomeView link={link} />
      )}
    </div>
  )
}
