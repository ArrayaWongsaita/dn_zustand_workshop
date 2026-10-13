import App from './App.jsx'
import appSource from './App.jsx?raw'
import productsSource from './data/products.json?raw'
import cartSliceSource from './store/cartSlice.js?raw'
import catalogSliceSource from './store/catalogSlice.js?raw'
import boundStoreSource from './store/useBoundStore.js?raw'

export default {
  number: 10,
  slug: '10-middleware',
  tier: '3b',
  titleTh: 'ห่อ store ด้วย middleware',
  briefTh:
    'ห่อ store ที่ประกอบจากสองส่วนของหน้านี้ด้วย middleware สองตัว: devtools เพื่อดูทุก action ที่เปลี่ยน state ใน Redux DevTools และ immer เพื่อเขียนการอัปเดต state ที่ซ้อนกันให้สั้นลงโดยไม่ต้อง spread เอง โดย state และ action ยังทำหน้าที่เหมือนเดิมทุกอย่าง ก่อนเริ่มติดตั้ง immer ด้วย npm install immer เขียนไฟล์: src/data/products.json, src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js และ src/App.jsx',
  criteriaTh: [
    'เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ',
    'เปิด Redux DevTools เห็น store ชื่อ zustand-workshop-store และทุก action ที่กดมีชื่อของตัวเอง ไม่ใช่ anonymous',
    'โค้ดอัปเดต state ของตะกร้าเขียนแบบแก้ค่าใน state ตรง ๆ ไม่มี spread ซ้อนหลายชั้น และผลลัพธ์ยังเหมือนเดิม',
    'หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ ไม่ได้ถูกจำมาจากครั้งก่อน',
  ],
  hintsTh: [
    'ติดตั้ง immer ด้วย npm install immer แล้วห่อ store รวมด้วย devtools และ immer โดยให้ devtools อยู่ชั้นนอกสุด',
    'ใน slice ของตะกร้า เขียน set((state) => { ... }) แบบแก้ค่าใน state ได้เลย เช่น state.cart.items.push(...) หรือ state.cart.note = ... โดยไม่ต้อง return อะไร',
    "ตั้งชื่อ action ด้วย argument ตัวที่สามของ set เช่น set(fn, undefined, 'cart/addItem') ถ้าไม่ตั้งชื่อ DevTools จะแสดงเป็น anonymous",
  ],
  trapsTh:
    'กับดัก: updater ของ immer ต้องแก้ค่าใน state แล้วไม่ return อะไร ถ้า return ค่าออกมาด้วยจะพังเงียบ ๆ อีกอย่างคือ devtools ต้องอยู่ชั้นนอกสุดและห่อ immer ไว้ ถ้าสลับลำดับจะมองไม่เห็น state ที่เปลี่ยนจริง',
  Demo: App,
  solutionFiles: [
    { name: 'src/data/products.json', source: productsSource },
    { name: 'src/store/cartSlice.js', source: cartSliceSource },
    { name: 'src/store/catalogSlice.js', source: catalogSliceSource },
    { name: 'src/store/useBoundStore.js', source: boundStoreSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
