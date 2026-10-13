import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Shared presentation of the solution code blocks: every variant shows the
// same bytes under the same learner-project paths, and owns only the reveal
// toggle around them.
function FileBlock({ file }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(file.source)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/50 px-3 py-1.5">
        <code className="truncate text-xs">{file.name}</code>
        <Button size="xs" variant="ghost" onClick={copy}>
          {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code>{file.source}</code>
      </pre>
    </div>
  )
}

export default function SolutionCode({ files }) {
  return (
    <div className="grid gap-3">
      {files.map((file) => (
        <FileBlock key={file.name} file={file} />
      ))}
    </div>
  )
}
