import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { pages } from '@/src/workshop/pages/index.js'
import { useSiteStore } from '@/src/workshop/site-store.js'
import PrototypeSwitcher from './PrototypeSwitcher.jsx'
import VariantA from './VariantA.jsx'
import VariantB from './VariantB.jsx'
import VariantC from './VariantC.jsx'

const VARIANTS = { A: VariantA, B: VariantB, C: VariantC }

// The throwaway route: /prototype/shell and /prototype/shell/<slug>?variant=A|B|C
export default function PrototypeApp() {
  const { slug } = useParams()
  const [search, setSearch] = useSearchParams()
  const key = (search.get('variant') ?? 'A').toUpperCase()
  const Variant = VARIANTS[key] ?? VariantA
  const current = slug
    ? (pages.find((page) => page.slug === slug) ?? null)
    : null
  const markVisited = useSiteStore((state) => state.markVisited)

  useEffect(() => {
    if (current) markVisited(current.slug)
  }, [current, markVisited])

  const link = (path) => `${path}?variant=${key}`

  return (
    <>
      <Variant pages={pages} current={current} link={link} />
      <PrototypeSwitcher
        current={key}
        onChange={(next) => setSearch({ variant: next }, { replace: true })}
      />
    </>
  )
}
