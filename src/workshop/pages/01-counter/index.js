import App from './App.jsx'
import appSource from './App.jsx?raw'
import storeSource from './store/useCounterStore.js?raw'

// PROTOTYPE NOTE: every Thai string below is placeholder copy for the shell
// prototype, except titleTh, which is final copy settled by "Thai page headings
// (titleTh) for pages 1-6" (#14). The rest is owned by "Page briefs: Tier 1"
// (#8) and must be copied verbatim from docs/workshop/pages/01-counter.md.
export default {
  number: 1,
  slug: '01-counter',
  tier: '1',
  titleTh: 'ตัวนับ',
  briefTh:
    'สร้าง store ด้วย Zustand แล้วผูกตัวนับเข้ากับปุ่มสามปุ่ม: เพิ่ม ลด และรีเซ็ต ตัวเลขบนหน้าจอต้องมาจาก store ไม่ใช่ useState',
  criteriaTh: [
    'กดปุ่ม "เพิ่ม" แล้วตัวเลขเพิ่มขึ้นทีละ 1',
    'กดปุ่ม "ลด" แล้วตัวเลขลดลงทีละ 1',
    'กดปุ่ม "รีเซ็ต" แล้วตัวเลขกลับเป็น 0',
    'ตัวเลขที่แสดงตรงกับค่าใน store เสมอ',
  ],
  hintsTh: [
    'v5 ไม่มี default export — ต้องใช้ import { create } from "zustand"',
    'เก็บตัวนับไว้ใน store แล้วอ่านออกมาทีละค่าด้วย selector',
    'set รวมค่าเดิมให้หนึ่งระดับ จึงส่งแค่ { count } ได้',
  ],
  trapsTh:
    'v5 ไม่มี default export: การเขียน import create from "zustand" จะพังตั้งแต่ตอน import',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/useCounterStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
