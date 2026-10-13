// Labels shared by every variant. The section headings are static chrome of
// the page template (content-model.md), pinned Thai from GLOSSARY.md.
export const HEADINGS = {
  demo: 'เดโมเป้าหมาย',
  brief: 'โจทย์',
  criteria: 'เกณฑ์ความสำเร็จ',
  trap: 'กับดัก',
  hints: 'คำใบ้',
  reveal: 'ส่วนเฉลย',
}

export const TIER_LABELS = {
  1: 'ชั้น 1',
  2: 'ชั้น 2',
  '3a': 'ชั้น 3a',
  '3b': 'ชั้น 3b',
  '3c': 'ชั้น 3c',
}

export const TIER_ORDER = ['1', '2', '3a', '3b', '3c']

export const VARIANT_NAMES = {
  A: 'Sidebar ladder',
  B: 'Top rail + reading column',
  C: 'Split workspace (demo first)',
}

export const VARIANT_ORDER = ['A', 'B', 'C']

// The full ladder, so navigation can show the real density of twelve pages.
// Only page 01 has a record; the rest are placeholder rows (their Thai titles
// are provisional until briefs #8-#12 land).
export const LADDER = [
  { number: 1, slug: '01-counter', tier: '1', titleTh: 'ตัวนับ', built: true },
  { number: 2, slug: '02-multi-counter', tier: '1', titleTh: 'ตัวนับหลายตัว' },
  { number: 3, slug: '03-todo', tier: '1', titleTh: 'รายการสิ่งที่ต้องทำ' },
  { number: 4, slug: '04-shopping-cart', tier: '1', titleTh: 'ตะกร้าสินค้า' },
  { number: 5, slug: '05-derived-selectors', tier: '2', titleTh: 'selector ที่คำนวณค่า' },
  { number: 6, slug: '06-selector-performance', tier: '2', titleTh: 'ประสิทธิภาพของ selector' },
  { number: 7, slug: '07-async-fetch', tier: '3a', titleTh: 'ดึงข้อมูลแบบ async' },
  { number: 8, slug: '08-persist', tier: '3a', titleTh: 'persist' },
  { number: 9, slug: '09-slices', tier: '3b', titleTh: 'slices' },
  { number: 10, slug: '10-middleware', tier: '3b', titleTh: 'middleware' },
  { number: 11, slug: '11-shared-store', tier: '3c', titleTh: 'shared store' },
  { number: 12, slug: '12-capstone', tier: '3c', titleTh: 'capstone' },
]
