import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSiteStore } from '@/src/workshop/site-store.js'
import { HEADINGS, LADDER, TIER_LABELS, TIER_ORDER } from './labels.js'
import SolutionCode from './SolutionCode.jsx'

// Variant C — Split workspace (demo first).
// The screen is split: a live demo pane on the left, the page's docs in a
// scrolling column on the right, and a thin number rail for navigation. The
// demo never leaves the screen while the learner reads.
function NumberRail({ current, link }) {
  const visited = useSiteStore((state) => state.visited)

  return (
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r py-3">
      <Link
        to={link('/prototype/shell')}
        className="pb-2 text-xs font-medium"
        title="หน้าแรก"
      >
        ZW
      </Link>
      {LADDER.map((row) =>
        row.built ? (
          <Link
            key={row.slug}
            title={row.titleTh}
            to={link(`/prototype/shell/${row.slug}`)}
            className={
              'grid size-7 place-items-center rounded-md text-xs tabular-nums ' +
              (current?.slug === row.slug
                ? 'bg-foreground text-background'
                : visited.includes(row.slug)
                  ? 'bg-muted'
                  : 'hover:bg-muted')
            }
          >
            {row.number}
          </Link>
        ) : (
          <span
            key={row.slug}
            title={row.titleTh}
            className="grid size-7 place-items-center rounded-md text-xs tabular-nums text-muted-foreground/40"
          >
            {row.number}
          </span>
        ),
      )}
    </nav>
  )
}

function DemoPane({ page, pages, link }) {
  const index = pages.findIndex((p) => p.slug === page.slug)
  const previous = pages[index - 1]
  const next = pages[index + 1]

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {HEADINGS.demo} · หน้า {page.number} · {TIER_LABELS[page.tier]}
        </p>
        <div className="flex items-center gap-2">
          {previous ? (
            <Link
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              to={link(`/prototype/shell/${previous.slug}`)}
            >
              ←
            </Link>
          ) : null}
          {next ? (
            <Link
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              to={link(`/prototype/shell/${next.slug}`)}
            >
              →
            </Link>
          ) : null}
        </div>
      </div>
      <div className="grid flex-1 place-items-center p-8">
        <div className="grid w-full max-w-md place-items-center rounded-2xl border bg-muted/20 p-14">
          <page.Demo />
        </div>
      </div>
    </div>
  )
}

function DocsColumn({ page, link }) {
  const revealed = useSiteStore((state) => state.revealed.includes(page.slug))
  const toggleRevealed = useSiteStore((state) => state.toggleRevealed)

  return (
    <div className="flex w-[42%] min-w-[360px] shrink-0 flex-col border-l">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-medium">{page.titleTh}</h1>
      </div>
      <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6">
        <section className="grid gap-2">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {HEADINGS.brief}
          </h2>
          <p className="text-sm leading-relaxed">{page.briefTh}</p>
        </section>

        <section className="grid gap-2">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {HEADINGS.criteria}
          </h2>
          <ul className="grid gap-1.5 text-sm">
            {page.criteriaTh.map((criterion) => (
              <li key={criterion} className="flex gap-2">
                <span className="text-muted-foreground">□</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-2">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {HEADINGS.trap}
          </h2>
          <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 text-sm">
            {page.trapsTh}
          </p>
        </section>

        <section className="grid gap-2">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {HEADINGS.hints}
          </h2>
          <ol className="grid gap-1.5 text-sm">
            {page.hintsTh.map((hint, index) => (
              <li key={hint} className="flex gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <span>{hint}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
              {HEADINGS.reveal}
            </h2>
            <Button
              size="xs"
              variant={revealed ? 'outline' : 'default'}
              onClick={() => toggleRevealed(page.slug)}
            >
              {revealed ? 'ซ่อนเฉลย' : 'ดูเฉลย'}
            </Button>
          </div>
          {revealed ? <SolutionCode files={page.solutionFiles} /> : null}
        </section>

        <div className="flex items-center justify-between gap-3 border-t pt-4 text-xs">
          <span className="text-muted-foreground">
            หน้า {page.number} / {LADDER.length}
          </span>
          <Link className="underline" to={link('/prototype/shell')}>
            ดูบันไดทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  )
}

function LadderPane({ link }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="border-b px-6 py-5">
        <h1 className="text-lg font-medium">เวิร์กช็อป Zustand</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          เลือกหน้าเพื่อเริ่มทำ แล้วเดโมกับโจทย์จะอยู่ข้างกัน
        </p>
      </div>
      <div className="px-6 py-4">
        {TIER_ORDER.map((tier) => (
          <section key={tier} className="py-3">
            <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
              {TIER_LABELS[tier]}
            </h2>
            <ul className="mt-1 grid">
              {LADDER.filter((row) => row.tier === tier).map((row) => (
                <li key={row.slug}>
                  {row.built ? (
                    <Link
                      className="flex items-baseline gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      to={link(`/prototype/shell/${row.slug}`)}
                    >
                      <span className="tabular-nums text-muted-foreground">
                        {row.number}
                      </span>
                      {row.titleTh}
                    </Link>
                  ) : (
                    <span className="flex items-baseline gap-3 px-2 py-1.5 text-sm text-muted-foreground/50">
                      <span className="tabular-nums">{row.number}</span>
                      {row.titleTh}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

function HomeDocs() {
  return (
    <div className="flex w-[42%] min-w-[360px] shrink-0 flex-col gap-4 overflow-y-auto border-l px-6 py-6">
      <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
        ก่อนเริ่ม
      </h2>
      <p className="text-sm leading-relaxed">
        สร้างโปรเจกต์ของผู้เรียนก่อน แล้วค่อยเริ่มหน้า 1 หน้าเริ่มต้นมีคำสั่ง
        และการตรวจว่า zustand ติดตั้งแล้ว
      </p>
      <div className="rounded-md border p-3 text-sm">
        หน้าเริ่มต้น (setup) —{' '}
        <span className="text-muted-foreground">/start</span>
      </div>
      <div className="mt-auto text-xs text-muted-foreground">
        เดโมเป้าหมายกับโจทย์อยู่ข้างกัน · ส่วนเฉลยเปิดปิดได้
      </div>
    </div>
  )
}

export default function VariantC({ pages, current, link }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <NumberRail current={current} link={link} />
      {current ? (
        <>
          <DemoPane page={current} pages={pages} link={link} />
          <DocsColumn page={current} link={link} />
        </>
      ) : (
        <>
          <LadderPane link={link} />
          <HomeDocs />
        </>
      )}
    </div>
  )
}
