import App from './App.jsx'
import appSource from './App.jsx?raw'
import headerSource from './components/Header.jsx?raw'
import cartSliceSource from './store/cartSlice.js?raw'
import catalogSliceSource from './store/catalogSlice.js?raw'
import boundStoreSource from './store/useBoundStore.js?raw'

export default {
  number: 11,
  slug: '11-shared-store',
  tier: '3c',
  titleTh: 'ใช้ store ร่วมกันทั้งแอป',
  briefTh:
    'แยกแอปของหน้านี้ให้มีสองส่วนที่ใช้ store เดียวกัน: แถบด้านบนที่แสดงจำนวนชิ้นกับยอดเงินในตะกร้าและมีปุ่มล้างตะกร้า และส่วนเนื้อหาด้านล่างที่มีแคตตาล็อกกับตะกร้าเหมือนเดิม ทั้งสองส่วนต้องอ่านและเขียน store ก้อนเดียวกันโดยไม่ส่งค่าผ่าน props และไม่ครอบด้วย provider เพิ่มช่องค้นหาสินค้าในแคตตาล็อก โดยเก็บข้อความที่พิมพ์ไว้ใน state ของคอมโพเนนต์ ไม่ต้องเก็บลง store เพราะมีแค่ส่วนนี้ที่ใช้ เขียนไฟล์: src/store/cartSlice.js, src/store/catalogSlice.js, src/store/useBoundStore.js, src/components/Header.jsx และ src/App.jsx',
  criteriaTh: [
    'เพิ่มสินค้าลงตะกร้าแล้วจำนวนชิ้นและยอดเงินบนแถบด้านบนเปลี่ยนตามทันที',
    'กดปุ่มล้างตะกร้าบนแถบด้านบนแล้วรายการในตะกร้าด้านล่างหายหมด และยอดบนแถบด้านบนกลับเป็น 0',
    'พิมพ์คำค้นหาแล้วรายการสินค้าถูกกรอง แต่ยอดในตะกร้ายังเท่าเดิม',
    'พิมพ์คำค้นหาแล้วไม่มี action ใหม่ขึ้นใน Redux DevTools',
    'รีเฟรชหน้าแล้วตะกร้ายังอยู่ครบเหมือนก่อนแยกคอมโพเนนต์',
  ],
  hintsTh: [
    'สร้าง src/components/Header.jsx แล้ว import useBoundStore เข้าไปใช้ในนั้นเลย ไม่ต้องรับค่าที่แชร์ผ่าน props หรือ context',
    'เขียน selector สำหรับจำนวนชิ้นและยอดเงินไว้ระดับโมดูล แล้วให้แถบด้านบนอ่านค่าผ่าน selector เหล่านั้น',
    'เก็บข้อความในช่องค้นหาด้วย useState ในคอมโพเนนต์ เพราะมีแค่แคตตาล็อกที่ใช้ ถ้าใส่ลง store ทุกตัวอักษรที่พิมพ์จะกลายเป็น action ใหม่ใน DevTools',
  ],
  trapsTh:
    'กับดัก: อย่าเอาค่าที่มีคอมโพเนนต์เดียวใช้ขึ้นไปไว้ใน store กลาง store มีไว้ให้ค่าที่หลายส่วนของแอปต้องเห็นตรงกัน ถ้าคำค้นหาถูกเก็บใน store ทุกตัวอักษรที่พิมพ์จะสร้าง action ใหม่และทำให้ทุกส่วนที่อ่าน store วาดใหม่โดยไม่จำเป็น',
  Demo: App,
  solutionFiles: [
    { name: 'src/store/cartSlice.js', source: cartSliceSource },
    { name: 'src/store/catalogSlice.js', source: catalogSliceSource },
    { name: 'src/store/useBoundStore.js', source: boundStoreSource },
    { name: 'src/components/Header.jsx', source: headerSource },
    { name: 'src/App.jsx', source: appSource },
  ],
}
