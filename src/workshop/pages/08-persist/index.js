import App from './App.jsx'
import appSource from './App.jsx?raw'
import productsSource from './data/products.json?raw'
import storeSource from './store/useCartStore.js?raw'

export default {
  number: 8,
  slug: '08-persist',
  tier: '3a',
  titleTh: 'จำตะกร้าไว้ในเครื่อง',
  briefTh:
    'ทำให้ตะกร้าของหน้านี้อยู่ต่อหลังรีเฟรชหน้า ทั้งรายการสินค้าในตะกร้าและข้อความหมายเหตุ ส่วนรายการสินค้าที่โหลดมาจากไฟล์ต้องโหลดใหม่ทุกครั้งที่เปิดหน้า ปิดแท็บแล้วเปิดใหม่หรือรีเฟรช ตะกร้าต้องยังอยู่ครบเหมือนเดิม โดยไม่ต้องแก้ state หรือ action ข้างใน store เขียนสามไฟล์: src/data/products.json, src/store/useCartStore.js และ src/App.jsx',
  criteriaTh: [
    'เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ',
    'ปิดแท็บแล้วเปิดหน้าใหม่ ตะกร้ายังอยู่',
    'หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ (เห็นข้อความกำลังโหลดก่อน) ไม่ได้ถูกจำมาจากครั้งก่อน',
    'เปิด DevTools → Application → Local Storage เห็นคีย์ zustand-workshop-cart และข้อมูลที่เก็บเป็นของตะกร้าเท่านั้น',
  ],
  hintsTh: [
    'ใช้ middleware persist จาก "zustand/middleware" ห่อ store ที่มีอยู่ ไม่ต้องแก้ state หรือ action ข้างใน',
    'เลือกได้ว่าจะเก็บอะไรลงเครื่องด้วย partialize — ที่ต้องอยู่หลังรีเฟรชคือตะกร้า ไม่ใช่รายการสินค้าที่โหลดมาใหม่หรือสถานะการโหลด',
    'เพิ่งเปิดหน้าแล้วยังไม่เห็นคีย์ใน DevTools (Application → Local Storage) เป็นเรื่องปกติของ v5 เพราะจะเขียนก็ต่อเมื่อมีการเปลี่ยนแปลงครั้งแรก',
  ],
  trapsTh:
    'กับดัก: ตั้งแต่ v5 เป็นต้นมา persist จะยังไม่เขียนข้อมูลลงเครื่องตอนสร้าง store — คีย์จะโผล่ใน DevTools ก็ต่อเมื่อ state เปลี่ยนครั้งแรก ถ้าเปิดหน้าใหม่แล้วไม่เห็นคีย์ อย่าคิดว่าเขียนผิด อีกอย่างคืออย่าเก็บทุกอย่างลงเครื่อง ของชั่วคราวอย่างสถานะการโหลดหรือข้อความ error ไม่ควรถูกจำไว้ ใช้ partialize เลือกเก็บเฉพาะตะกร้า',
  Demo: App,
  solutionFiles: [
    { name: 'src/data/products.json', source: productsSource },
    { name: 'src/store/useCartStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
