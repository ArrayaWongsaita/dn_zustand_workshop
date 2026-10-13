import App from './App.jsx'
import appSource from './App.jsx?raw'
import storeSource from './store/useCounterStore.js?raw'

export default {
  number: 1,
  slug: '01-counter',
  tier: '1',
  titleTh: 'ตัวนับ',
  briefTh:
    'สร้างตัวนับตัวแรกด้วย Zustand เขียน src/store/useCounterStore.js ให้เก็บค่าตัวนับพร้อมคำสั่ง เพิ่ม ลด และรีเซ็ต และเขียน src/App.jsx ให้แสดงตัวเลขกับปุ่มทั้งสาม โดยตัวเลขบนหน้าจอต้องมาจาก store ไม่ใช่ useState — เปิดหน้าแล้วต้องเห็น 0 กด "เพิ่ม" แล้วเพิ่มทีละ 1 กด "ลด" แล้วลดทีละ 1 กด "รีเซ็ต" แล้วกลับเป็น 0',
  criteriaTh: [
    'เปิดหน้าแล้วเห็นเลข 0',
    'กด "เพิ่ม" แล้วตัวเลขเพิ่มขึ้น 1',
    'กด "ลด" แล้วตัวเลขลดลง 1',
    'กด "รีเซ็ต" แล้วตัวเลขกลับเป็น 0',
  ],
  hintsTh: [
    'v5 ไม่มี default export — ต้องใช้ import { create } from "zustand"',
    'เก็บตัวนับไว้ใน store แล้วอ่านออกมาทีละค่าด้วย selector',
    'set รวมค่าเดิมให้หนึ่งระดับ จึงส่งเฉพาะค่าที่เปลี่ยนก็ได้',
  ],
  trapsTh:
    'กับดัก: Zustand v5 ไม่มี default export — เขียน import create from "zustand" แล้วจะพังตั้งแต่ตอน import ต้องใช้ import { create } from "zustand"',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/useCounterStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
