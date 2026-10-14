import { Link } from 'react-router'
import { TIER_LABELS } from './labels.js'
import { pagesByTier, pagesInLadderOrder } from './registry.js'

// "What is this, and where do I start": a heading, one line of copy, five tier
// cards, and the start-here card last. No hero image, no version mentions.
export default function Home() {
  const groups = pagesByTier()
  const first = pagesInLadderOrder()[0]

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-8 py-10">
      <header className="grid gap-2">
        <h1 className="text-2xl font-medium">เวิร์กช็อป Zustand</h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          บันได 12 หน้า ไล่จาก store ธรรมดา ไปจนถึง store ที่อยู่คู่แอปไปตลอด
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {groups.map(({ tier, rows }, groupIndex) => (
          <section key={tier} className="rounded-xl border p-4">
            <h2 className="text-sm font-medium">{TIER_LABELS[tier]}</h2>
            <ul className="mt-2 grid gap-1 text-sm">
              {groupIndex === 0 && first ? (
                <li>
                  <Link className="underline" to={`/${first.slug}`}>
                    เริ่มที่หน้า 1
                  </Link>
                </li>
              ) : null}
              {rows.map((page) => (
                <li key={page.slug}>
                  <Link className="underline" to={`/${page.slug}`}>
                    {page.number}. {page.titleTh}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="col-span-2 rounded-xl border p-4">
          <Link to="/start" className="text-sm font-medium underline">
            เริ่มต้นใช้งาน
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            สร้างโปรเจกต์ Vite + React ของคุณและตรวจว่าติดตั้ง zustand แล้ว
            ก่อนเริ่มหน้า 1
          </p>
        </section>
      </div>
    </div>
  )
}
