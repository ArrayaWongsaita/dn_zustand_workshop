// The one section shell used by the page template and the start-here page, so
// both show the same heading style and read as the same site.
export default function Section({ heading, action, children }) {
  return (
    <section className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">{heading}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
