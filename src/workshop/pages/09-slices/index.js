import App from './App.jsx'
import appSource from './App.jsx?raw'
import productsSource from './data/products.json?raw'
import cartSliceSource from './store/cartSlice.js?raw'
import catalogSliceSource from './store/catalogSlice.js?raw'
import boundStoreSource from './store/useBoundStore.js?raw'

export default {
  number: 9,
  slug: '09-slices',
  tier: '3b',
  titleTh: 'แยก store ออกเป็นส่วน ๆ',
  briefTh:
    'แยก store ของหน้านี้ที่รวมทุกอย่างไว้ในไฟล์เดียวออกเป็นสองส่วนตามหน้าที่ ส่วนของตะกร้าและส่วนของรายการสินค้า แล้วประกอบทั้งสองส่วนกลับเป็น store เดียวที่แอปใช้เหมือนเดิม โดย state และ action ข้างในห้ามเปลี่ยน พฤติกรรมของแอปต้องเหมือนหน้าเดิมทุกอย่าง รวมถึงตะกร้าที่อยู่ต่อหลังรีเฟรช เขียนไฟล์: src/data/products.json, src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js และ src/App.jsx',
  criteriaTh: [
    'เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ',
    'หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ (เห็นข้อความกำลังโหลดก่อน) ไม่ได้ถูกจำมาจากครั้งก่อน',
    'store แยกเป็นสองไฟล์ src/store/cartSlice.js และ src/store/catalogSlice.js แล้วถูกประกอบกลับเป็น store เดียวที่ App.jsx ใช้',
    'เปิด DevTools → Application → Local Storage เห็นคีย์ zustand-workshop-cart และข้อมูลที่เก็บเป็นของตะกร้าเท่านั้น',
  ],
  hintsTh: [
    'แยก state กับ action ที่เกี่ยวกับตะกร้าไปไว้ไฟล์หนึ่ง และที่เกี่ยวกับรายการสินค้าไปอีกไฟล์หนึ่ง แต่ละไฟล์เขียนเป็นฟังก์ชันที่รับ (set, get) แล้วคืน state กับ action ของส่วนนั้น',
    'ไฟล์ store รวมทำหน้าที่แค่เรียกฟังก์ชันของแต่ละส่วนมาประกอบกันเป็น store เดียว',
    'middleware อย่าง persist ให้ครอบ store ที่ประกอบเสร็จแล้วเท่านั้น ห้ามใส่ไว้ใน slice แต่ละอัน',
  ],
  trapsTh:
    'กับดัก: ถ้าเอา middleware ไปใส่ไว้ใน slice แต่ละอันจะเกิดปัญหาที่คาดไม่ถึง เพราะ middleware ต้องครอบ store ที่ประกอบเสร็จแล้วเท่านั้น ให้แต่ละ slice เป็นแค่ฟังก์ชันที่คืน state กับ action ของตัวเอง แล้วเอา persist มาครอบ store รวมไว้ชั้นนอกสุด',
  Demo: App,
  solutionFiles: [
    { name: 'src/data/products.json', source: productsSource },
    { name: 'src/store/cartSlice.js', source: cartSliceSource },
    { name: 'src/store/catalogSlice.js', source: catalogSliceSource },
    { name: 'src/store/useBoundStore.js', source: boundStoreSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
