import { Link, Route, Routes } from 'react-router'
import PrototypeApp from './prototype/shell/PrototypeApp.jsx'

// Routing is invisible plumbing (ADR-0003). Nothing learner-facing names it.
// The workshop site itself has no routes yet: the shell is being prototyped
// under /prototype/shell (see src/prototype/shell/README.md).
function Landing() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-8">
      <h1 className="text-xl font-medium">Zustand workshop — site shell prototype</h1>
      <p className="text-sm text-muted-foreground">
        โปรโตไทป์ชั่วคราวสำหรับเลือกโครงเว็บ (ticket #7) ยังไม่ใช่ตัวเวิร์กช็อปจริง
      </p>
      <Link className="text-sm underline" to="/prototype/shell">
        ไปที่โปรโตไทป์ /prototype/shell
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/prototype/shell" element={<PrototypeApp />} />
      <Route path="/prototype/shell/:slug" element={<PrototypeApp />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
