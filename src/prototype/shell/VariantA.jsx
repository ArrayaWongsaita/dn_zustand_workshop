import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSiteStore } from '@/src/workshop/site-store.js'
import { HEADINGS, LADDER, TIER_LABELS, TIER_ORDER } from './labels.js'
import SolutionCode from './SolutionCode.jsx'

// Variant A — Sidebar ladder.
// A persistent left sidebar grouped by tier is the whole navigation; the page
// content lives in one reading column beside it, with prev/next at the top of
// the column.
function Sidebar({ current, link }) {
  const visited = useSiteStore((state) => state.visited)

  return (
    <aside className="w-64 shrink-0 border-r bg-muted/20">
      <div className="sticky top-0 flex h-screen flex-col gap-5 overflow-y-auto p-4">
        <Link to={link('/prototype/shell')} className="text-sm font-medium">
          เวิร์กช็อป Zustand
        </Link>
        <nav className="flex flex-col gap-4">
          {TIER_ORDER.map((tier) => (
            <div key={tier} className="flex flex-col gap-0.5">
              <p className="px-2 text-xs text-muted-foreground">
                {TIER_LABELS[tier]}
              </p>
              {LADDER.filter((row) => row.tier === tier).map((row) =>
                row.built ? (
                  <Link
                    key={row.slug}
                    to={link(`/prototype/shell/${row.slug}`)}
                    className={
                      'flex items-center gap-2 rounded-md px-2 py-1 text-sm ' +
                      (current?.slug === row.slug
                        ? 'bg-foreground text-background'
                        : 'hover:bg-muted')
                    }
                  >
                    <span className="tabular-nums opacity-60">
                      {row.number}
                    </span>
                    <span className="truncate">{row.titleTh}</span>
                    {visited.includes(row.slug) && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </Link>
                ) : (
                  <span
                    key={row.slug}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground/60"
                  >
                    <span className="tabular-nums opacity-60">
                      {row.number}
                    </span>
                    <span className="truncate">{row.titleTh}</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </nav>
        <Link
          to={link('/prototype/shell')}
          className="mt-auto text-xs underline"
        >
          หน้าเริ่มต้น (setup)
        </Link>
      </div>
    </aside>
  )
}

function PrevNext({ page, pages, link }) {
  const index = pages.findIndex((p) => p.slug === page.slug)
  const previous = pages[index - 1]
  const next = pages[index + 1]
  return (
    <div className="flex items-center gap-2">
      {previous ? (
        <Link
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          to={link(`/prototype/shell/${previous.slug}`)}
        >
          ← {previous.titleTh}
        </Link>
      ) : null}
      {next ? (
        <Link
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          to={link(`/prototype/shell/${next.slug}`)}
        >
          {next.titleTh} →
        </Link>
      ) : null}
    </div>
  )
}

function Section({ heading, children }) {
  return (
    <section className="grid gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">{heading}</h2>
      {children}
    </section>
  )
}

function PageView({ page, pages, link }) {
  const revealed = useSiteStore((state) => state.revealed.includes(page.slug))
  const toggleRevealed = useSiteStore((state) => state.toggleRevealed)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            หน้า {page.number} · {TIER_LABELS[page.tier]}
          </p>
          <PrevNext page={page} pages={pages} link={link} />
        </div>
        <h1 className="text-2xl font-medium">{page.titleTh}</h1>
      </header>

      <Section heading={HEADINGS.demo}>
        <div className="grid place-items-center rounded-xl border bg-muted/20 p-10">
          <page.Demo />
        </div>
      </Section>

      <Section heading={HEADINGS.brief}>
        <p className="text-sm leading-relaxed">{page.briefTh}</p>
      </Section>

      <Section heading={HEADINGS.criteria}>
        <ul className="grid gap-1.5 text-sm">
          {page.criteriaTh.map((criterion) => (
            <li key={criterion} className="flex gap-2">
              <span className="text-muted-foreground">✓</span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={HEADINGS.trap}>
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          {page.trapsTh}
        </p>
      </Section>

      <Section heading={HEADINGS.hints}>
        <ol className="grid gap-1.5 text-sm">
          {page.hintsTh.map((hint, index) => (
            <li key={hint} className="flex gap-2">
              <span className="text-muted-foreground">{index + 1}.</span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section heading={HEADINGS.reveal}>
        {revealed ? (
          <div className="grid gap-3">
            <Button
              size="sm"
              variant="outline"
              className="justify-self-start"
              onClick={() => toggleRevealed(page.slug)}
            >
              ซ่อนเฉลย
            </Button>
            <SolutionCode files={page.solutionFiles} />
          </div>
        ) : (
          <Button size="sm" onClick={() => toggleRevealed(page.slug)}>
            ดูเฉลย
          </Button>
        )}
      </Section>
    </div>
  )
}

function HomeView({ pages, link }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-8 py-10">
      <header className="grid gap-2">
        <h1 className="text-2xl font-medium">เวิร์กช็อป Zustand</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          บันได 12 หน้า เริ่มจากตัวนับจนถึง capstone แต่ละหน้ามีเดโมเป้าหมาย
          เกณฑ์ความสำเร็จ และส่วนเฉลยให้เปิดดู
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {TIER_ORDER.map((tier) => {
          const rows = LADDER.filter((row) => row.tier === tier)
          return (
            <section key={tier} className="rounded-xl border p-4">
              <h2 className="text-sm font-medium">{TIER_LABELS[tier]}</h2>
              <ul className="mt-2 grid gap-1 text-sm">
                {rows.map((row) => (
                  <li key={row.slug}>
                    {row.built ? (
                      <Link
                        className="underline"
                        to={link(`/prototype/shell/${row.slug}`)}
                      >
                        {row.number}. {row.titleTh}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/60">
                        {row.number}. {row.titleTh}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <section className="rounded-xl border p-4 sm:col-span-2">
          <h2 className="text-sm font-medium">ก่อนเริ่ม</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            หน้าเริ่มต้น (setup) — สร้างโปรเจกต์ของผู้เรียนและตรวจว่า zustand ติดตั้งแล้ว
          </p>
        </section>
      </div>
      <p className="text-xs text-muted-foreground">
        prototype A · {pages.length} หน้าใน registry · หน้าอื่นยังไม่มี brief
      </p>
    </div>
  )
}

export default function VariantA({ pages, current, link }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar current={current} link={link} />
      <main className="min-w-0 flex-1 pb-20">
        {current ? (
          <PageView page={current} pages={pages} link={link} />
        ) : (
          <HomeView pages={pages} link={link} />
        )}
      </main>
    </div>
  )
}
