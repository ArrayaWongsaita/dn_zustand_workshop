import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'

// Previous/next are titled links at the header's top-right. They come from the
// registry ordered by page number: the first page has no previous, the last no
// next.
export default function PrevNext({ previous, next }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {previous ? (
        <Link
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          to={`/${previous.slug}`}
        >
          ← {previous.titleTh}
        </Link>
      ) : null}
      {next ? (
        <Link
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          to={`/${next.slug}`}
        >
          {next.titleTh} →
        </Link>
      ) : null}
    </div>
  )
}
