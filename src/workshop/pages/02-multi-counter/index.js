import App from './App.jsx'
import appSource from './App.jsx?raw'
import storeSource from './store/useCountersStore.js?raw'

export default {
  number: 2,
  slug: '02-multi-counter',
  tier: '1',
  titleTh: 'ตัวนับสองตัว',
  briefTh:
    'สร้างตัวนับสองตัว (A และ B) ไว้ใน store เดียวกัน แต่ละตัวเริ่มที่ 0 และมีปุ่ม − กับ + ของตัวเอง สองตัวนี้ต้องไม่ขึ้นต่อกัน กดตัวหนึ่งแล้วอีกตัวต้องไม่เปลี่ยน และมีปุ่ม "รีเซ็ตทั้งหมด" ที่ตั้งทั้งสองตัวกลับเป็น 0 เขียนสองไฟล์: src/store/useCountersStore.js และ src/App.jsx โดยให้ตัวนับ A กับ B เป็นคนละคอมโพเนนต์ในไฟล์เดียวกัน',
  criteriaTh: [
    'เปิดหน้าแล้วเห็นตัวนับ A และ B เป็น 0 ทั้งคู่',
    'กด + ของตัวนับ A แล้ว A เพิ่มขึ้น 1 และ B ยังเป็นค่าเดิม',
    'กด − ของตัวนับ B แล้ว B ลดลง 1 และ A ยังเป็นค่าเดิม',
    'กด "รีเซ็ตทั้งหมด" แล้วทั้ง A และ B กลับเป็น 0',
  ],
  hintsTh: [
    'เก็บสองค่าไว้ใน store เดียวกันได้ ตั้งชื่อให้ต่างกัน',
    'อ่านค่าออกมาทีละค่าด้วย selector แยกกัน อย่าดึงหลายค่าออกมาพร้อมกันใน selector เดียว',
    'set รวมค่าเดิมให้หนึ่งระดับ จึงส่งเฉพาะค่าที่เปลี่ยนกลับไปก็ได้',
  ],
  trapsTh:
    'กับดัก: ถ้าดึงหลายค่าออกจาก store พร้อมกันใน selector เดียว (หรือดึง state ทั้งก้อน) ทุกตัวนับจะอัปเดตพร้อมกันทุกครั้งที่ค่าใดค่าหนึ่งเปลี่ยน ให้อ่านทีละค่าด้วย selector แยกกัน',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/useCountersStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
