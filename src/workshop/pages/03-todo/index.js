import App from './App.jsx'
import appSource from './App.jsx?raw'
import storeSource from './store/useTodoStore.js?raw'

export default {
  number: 3,
  slug: '03-todo',
  tier: '1',
  titleTh: 'รายการสิ่งที่ต้องทำ',
  briefTh:
    'สร้างรายการสิ่งที่ต้องทำ มีช่องกรอกกับปุ่ม "เพิ่ม" กดเพิ่มแล้วรายการใหม่ต่อท้ายลิสต์ และช่องกรอกกลับมาว่าง ถ้าช่องกรอกว่างให้กดแล้วไม่มีอะไรเกิดขึ้น แต่ละรายการมี checkbox สำหรับติ๊กว่าทำเสร็จแล้ว (ข้อความถูกลากเส้นทับ) และปุ่ม "ลบ" สำหรับเอาออก เขียนสองไฟล์: src/store/useTodoStore.js (เก็บรายการและคำสั่ง เพิ่ม ติ๊กเสร็จ ลบ) และ src/App.jsx',
  criteriaTh: [
    'เปิดหน้าแล้วเห็นข้อความ "ยังไม่มีรายการ"',
    'พิมพ์ข้อความแล้วกด "เพิ่ม" รายการใหม่ปรากฏขึ้น และช่องกรอกกลับมาว่าง',
    'ติ๊ก checkbox ของรายการหนึ่ง ข้อความถูกลากเส้นทับ และรายการอื่นไม่เปลี่ยน',
    'กด "ลบ" ของรายการหนึ่ง รายการนั้นหายไปจากลิสต์',
  ],
  hintsTh: [
    'เก็บรายการเป็น array ของ object โดยแต่ละ object มี id ข้อความ และสถานะว่าทำเสร็จหรือยัง',
    'เพิ่มรายการด้วยการสร้าง array ใหม่ เช่น [...เดิม, รายการใหม่] อย่า push ใส่ array เดิม',
    'ติ๊กเสร็จหรือลบ ให้สร้าง array ใหม่ด้วย map หรือ filter พร้อมสร้าง object ของรายการนั้นใหม่ด้วย',
  ],
  trapsTh:
    'กับดัก: การแก้ array หรือ object ของ state ตรง ๆ (เช่น push เข้า array เดิม หรือแก้ค่าใน object เดิม) จะไม่ทำให้จออัปเดต เพราะค่าเดิมกับค่าใหม่ถูกมองว่าเป็นตัวเดียวกัน — ต้องสร้าง array และ object ใหม่เสมอ (spread, map, filter)',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/useTodoStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
