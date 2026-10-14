import App from './App.jsx'
import appSource from './App.jsx?raw'
import summaryCardSource from './components/SummaryCard.jsx?raw'
import categoriesSource from './data/categories.json?raw'
import budgetsSliceSource from './store/budgetsSlice.js?raw'
import categoriesSliceSource from './store/categoriesSlice.js?raw'
import entriesSliceSource from './store/entriesSlice.js?raw'
import boundStoreSource from './store/useBoundStore.js?raw'

export default {
  number: 12,
  slug: '12-capstone',
  tier: '3c',
  titleTh: 'โปรเจกต์ปิดท้าย',
  briefTh:
    'สร้างแอปบันทึกรายจ่ายตั้งแต่ต้น: โหลดหมวดหมู่จากไฟล์ ตั้งงบให้แต่ละหมวด เพิ่มและลบรายจ่าย และมีช่องค้นหารายจ่าย โดยด้านบนสุดมีสรุปยอดใช้ไป งบทั้งหมด และงบคงเหลืออยู่ตลอดเวลา ใช้ทุกอย่างที่เรียนมาในเวิร์กช็อปให้ครบ ทั้งการแบ่ง store เป็นส่วน ๆ การโหลดข้อมูลแบบ async การเก็บลง localStorage การคำนวณยอดด้วย selector และ middleware สองตัว และให้ทุก action ที่กดมีชื่อของตัวเองใน Redux DevTools เขียนไฟล์: src/data/categories.json, src/store/categoriesSlice.js, src/store/entriesSlice.js, src/store/budgetsSlice.js, src/store/useBoundStore.js, src/components/SummaryCard.jsx และ src/App.jsx หน้านี้ใช้เวลาประมาณ 2 ชั่วโมง และทำแบ่งเป็นหลายรอบได้',
  criteriaTh: [
    'เพิ่มรายจ่ายด้วยจำนวนเงินและหมวดหมู่ แล้วรายการใหม่ขึ้นในลิสต์ และยอดใช้ไปบนการ์ดสรุปเพิ่มขึ้นตามจำนวนนั้น',
    'ตั้งงบให้หมวดหนึ่ง แล้วยอดคงเหลือของหมวดนั้นลดลงตามที่จ่ายไปในหมวดนั้น',
    'พิมพ์ค้นหาแล้วลิสต์สั้นลง แต่ยอดใช้ไปและงบทั้งหมดบนการ์ดสรุปยังเท่าเดิม',
    'ลบรายจ่ายแล้วยอดใช้ไปและยอดคงเหลือกลับมาเท่าเดิม',
    'รีเฟรชหน้าแล้วรายจ่ายและงบประมาณที่ตั้งไว้ยังอยู่ครบ แต่รายการหมวดหมู่ถูกโหลดขึ้นมาใหม่',
    'เปิด Redux DevTools เห็น store ชื่อ zustand-workshop-expense และทุก action ที่กดมีชื่อของตัวเอง ไม่ใช่ anonymous',
  ],
  hintsTh: [
    'แบ่ง store เป็นสามส่วนตามความสนใจ: หมวดหมู่ที่โหลดจากไฟล์ รายจ่าย และงบประมาณ แล้วประกอบทั้งสามส่วนเป็น store เดียวด้วย middleware เรียงแบบหน้า 10',
    'การโหลดหมวดหมู่ต้องมีสถานะกำลังโหลดและข้อผิดพลาด พร้อมตัวกันคำตอบที่มาช้ากว่า และให้ persist เก็บเฉพาะรายจ่ายกับงบประมาณ',
    'งบประมาณซ้อนอยู่ชั้นหนึ่ง ใช้ immer เขียนแก้ค่าได้ตรง ๆ เช่น state.budgets.byCategory[categoryId] = amount โดยไม่ต้อง return อะไร',
    'ยอดใช้ไป งบทั้งหมด และยอดคงเหลือ คำนวณใน selector ระดับโมดูล ถ้าเลือกหลายค่าเป็น object เดียวให้ครอบด้วย useShallow',
  ],
  trapsTh:
    'กับดัก: หน้านี้รวมกับดักของทุกหน้าไว้ด้วยกัน แบ่งเป็นสี่ตระกูล ความไม่เปลี่ยนรูปของ state ในแต่ละชั้นข้อมูล · ยอดรวมและค่าที่คำนวณได้ต้องคำนวณจาก store ไม่ใช่เก็บลง state · ค่าที่เป็น object ใหม่ทุกครั้งต้องผ่าน useShallow และ selector ต้องนิ่งอยู่ระดับโมดูล · งานที่ไม่พร้อมใช้ทันทีอย่างการโหลดข้อมูลและการเก็บลง localStorage ต้องมีสถานะ มีตัวกันคำตอบเก่า มี partialize และเรียง middleware ให้ devtools อยู่ชั้นนอกสุด',
  Demo: App,
  solutionFiles: [
    { name: 'src/data/categories.json', source: categoriesSource },
    { name: 'src/store/categoriesSlice.js', source: categoriesSliceSource },
    { name: 'src/store/entriesSlice.js', source: entriesSliceSource },
    { name: 'src/store/budgetsSlice.js', source: budgetsSliceSource },
    { name: 'src/store/useBoundStore.js', source: boundStoreSource },
    { name: 'src/components/SummaryCard.jsx', source: summaryCardSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
