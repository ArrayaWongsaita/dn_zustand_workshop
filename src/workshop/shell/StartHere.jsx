import Section from './Section.jsx'

// The start-here page is site chrome, not a page record: no number, no tier
// badge, no goal demo, no prev/next. The copy is learner-setup.md § The
// start-here page, placed verbatim; it teaches no Zustand code.
function Code({ children }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/20 p-3 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

function Line({ children }) {
  return <p className="text-sm leading-relaxed">{children}</p>
}

export default function StartHere() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
      <header className="grid gap-2">
        <h1 className="text-2xl font-medium">เริ่มต้นใช้งาน</h1>
        <Line>
          เวิร์กช็อปนี้มี 12 หน้า คุณจะสร้างโปรเจกต์ React ของตัวเอง
          แล้วทำโจทย์ทีละหน้าตามลำดับ
        </Line>
        <Line>
          เว็บนี้ให้ดูเดโมเป้าหมาย โจทย์ และเฉลยเท่านั้น
          โค้ดทั้งหมดคุณเขียนเองในโปรเจกต์ของคุณ
        </Line>
      </header>

      <Section heading="1. ตรวจสอบเครื่องก่อน">
        <Code>node -v</Code>
        <Line>ต้องได้ v20.19 ขึ้นไป หรือ v22.12 ขึ้นไป</Line>
        <Line>
          ถ้าไม่เห็นเวอร์ชัน หรือขึ้นว่าไม่รู้จักคำสั่ง ให้ติดตั้ง Node.js รุ่น LTS
          จาก nodejs.org แล้วเปิด terminal ใหม่
        </Line>
      </Section>

      <Section heading="2. สร้างโปรเจกต์">
        <Code>{`npm create vite@latest zustand-workshop -- --template react --no-interactive --no-immediate
cd zustand-workshop
npm install
npm install zustand
npm run dev`}</Code>
        <Line>
          เปิดที่อยู่ที่ terminal แสดง (ปกติคือ http://localhost:5173)
          จะเห็นหน้าเริ่มต้นของ Vite
        </Line>
      </Section>

      <Section heading="3. โครงไฟล์ที่ใช้ตลอดเวิร์กช็อป">
        <Code>{`zustand-workshop/
└─ src/
   ├─ store/     เก็บ store ของแต่ละหน้า เช่น useCounterStore.js
   └─ App.jsx    คอมโพเนนต์ที่แสดงผลของแต่ละหน้า`}</Code>
        <Line>
          โจทย์แต่ละหน้าจะบอกว่าต้องเขียนไฟล์อะไรบ้าง
          ใช้ path เดียวกับที่เว็บแสดงในส่วนเฉลย
        </Line>
        <Line>ถ้าซ้ำกับหน้าเดิม ให้เขียนทับไฟล์เดิมได้เลย</Line>
        <Line>
          ไม่ต้องติดตั้งอะไรเพิ่มนอกจาก zustand — ไม่ต้องใช้ react-router,
          TypeScript หรือ CSS framework
        </Line>
      </Section>

      <Section heading="4. เช็คว่าพร้อมแล้ว">
        <Code>npm ls zustand</Code>
        <Line>ต้องเห็น zustand เวอร์ชัน 5.x</Line>
        <Line>
          เห็นครบทั้งหน้า Vite และ zustand 5.x แล้ว = พร้อมเริ่มหน้า 1
        </Line>
      </Section>
    </article>
  )
}
