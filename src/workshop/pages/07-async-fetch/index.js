import App from './App.jsx'
import appSource from './App.jsx?raw'
import productsSource from './data/products.json?raw'
import storeSource from './store/useCartStore.js?raw'

export default {
  number: 7,
  slug: '07-async-fetch',
  tier: '3a',
  titleTh: 'โหลดข้อมูลแบบ async',
  briefTh:
    'เปลี่ยนรายการสินค้าในหน้านี้ให้โหลดมาจากไฟล์ src/data/products.json ตอนเปิดหน้า ไม่ใช่ประกาศไว้ในโค้ด ระหว่างโหลดต้องเห็นข้อความบอกว่ากำลังโหลด แล้วจึงเห็นสินค้าสามรายการพร้อมราคา กด "โหลดใหม่" แล้วรายการต้องถูกโหลดมาใหม่อีกครั้งโดยที่ตะกร้าไม่หาย ถ้าโหลดไม่สำเร็จต้องมีข้อความบอกและปุ่มให้ลองใหม่ ไม่ใช่จอว่างหรือค้าง ตะกร้าและบรรทัดสรุปยอดยังทำงานเหมือนเดิม เขียนสามไฟล์: src/data/products.json, src/store/useCartStore.js และ src/App.jsx',
  criteriaTh: [
    'เปิดหน้าแล้วเห็นข้อความกำลังโหลดก่อน แล้วจึงเห็นสินค้าสามรายการ: กาแฟ 60 บาท ชา 45 บาท น้ำส้ม 55 บาท',
    'กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท',
    'กด "โหลดใหม่" แล้วสินค้าถูกโหลดมาใหม่ และรายการในตะกร้ายังอยู่ครบพร้อมยอดเดิม',
    'เปิด DevTools แท็บ Network แล้วเลือก Offline กด "โหลดใหม่" เห็นข้อความว่าโหลดไม่สำเร็จพร้อมปุ่มลองใหม่ กลับมาออนไลน์แล้วกดลองใหม่ สินค้ากลับมาแสดง',
    'ใช้งานต่อได้ปกติ หน้าไม่ค้าง และ console ไม่มี error เรื่องการอัปเดตซ้ำ',
  ],
  hintsTh: [
    'แยกสถานะการโหลดไว้ใน store เป็นค่าเดียว เช่น idle / loading / success / error แล้วให้หน้าจอแสดงตามสถานะนั้น ไม่ต้องเดาจากจำนวนสินค้า',
    'อ่านไฟล์ด้วย fetch โดยอ้าง path จากตำแหน่งไฟล์ store เอง ผ่าน new URL("../data/products.json", import.meta.url) จะถูกต้องทั้งตอน dev และตอน build',
    'ตอน dev โหมด StrictMode ของ React เรียก effect ซ้ำ จึงเห็นคำขอสองครั้งในแท็บ Network เป็นเรื่องปกติ ไม่ใช่บั๊ก',
  ],
  trapsTh:
    'กับดัก: ถ้าไม่เก็บสถานะการโหลดไว้ใน store จะแยกไม่ออกว่ากำลังโหลด ข้อมูลว่าง หรือโหลดพัง ต้องตั้งสถานะเป็น loading ก่อน await แรก และมีข้อความ error เมื่อโหลดพลาด อีกอย่างคือถ้ากด "โหลดใหม่" รัว ๆ คำตอบของคำขอเก่าที่กลับมาทีหลังจะทับคำขอใหม่ (โค้ดเฉลยกันด้วย request id แล้วทิ้งคำตอบที่ไม่ใช่คำขอล่าสุด) และตอน dev โหมด StrictMode เรียก effect ซ้ำทำให้เห็นคำขอสองครั้ง เป็นพฤติกรรมปกติของ React ไม่ใช่บั๊ก ไม่ต้องแก้',
  Demo: App,
  solutionFiles: [
    { name: 'src/data/products.json', source: productsSource },
    { name: 'src/store/useCartStore.js', source: storeSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
