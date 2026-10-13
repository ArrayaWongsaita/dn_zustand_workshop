import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// The categories the page fetches, matching the learner's src/data/categories.json.
const CATEGORIES = [
  { id: 'food', name: 'อาหาร' },
  { id: 'travel', name: 'เดินทาง' },
  { id: 'home', name: 'ของใช้ในบ้าน' },
]

function okResponse(categories) {
  return { ok: true, json: () => Promise.resolve(categories) }
}

// The demo fetches on mount, so every test stubs fetch with the JSON the brief
// specifies and never touches the network.
function stubCategoriesFetch(categories = CATEGORIES) {
  const fetchMock = vi.fn(() => Promise.resolve(okResponse(categories)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// A promise whose settlement the test decides: lets a test hold a reload's
// catalogue request open and observe the loading state before it lands.
function deferred() {
  let resolve
  const promise = new Promise((settle) => {
    resolve = settle
  })
  return { promise, resolve }
}

// The page store is a module-level singleton that rehydrates from localStorage
// at creation, so a fresh import is exactly what a reload does: a new store
// reading back whatever the previous store persisted.
async function mountDemo() {
  vi.resetModules()
  const { default: page } = await import('./index.js')
  return render(<page.Demo />)
}

// A reload is a fresh store instance re-reading persisted state, which means a
// fresh dynamic import; the old tree is unmounted first so queries stay unique.
async function reload(view) {
  view.unmount()
  return mountDemo()
}

async function waitForCategories() {
  await screen.findByText(/^อาหาร · ใช้ไป 0 บาท$/)
}

// The summary card is the only place a bare label like ใช้ไป appears; the
// budget rows spell the same word inside a longer line, so an exact match keeps
// the two apart. A value is the second paragraph of its labelled column.
function summaryValue(label) {
  const card = screen.getByText('ใช้ไป').closest('div').parentElement
  return within(card).getByText(label).closest('div').lastElementChild
    .textContent
}

function budgetPanel() {
  // The heading sits in a header row inside the panel, so climb one more div.
  return screen.getByText('งบประมาณตามหมวด').closest('div').parentElement
}

function budgetRow(name) {
  return within(budgetPanel())
    .getByText(new RegExp(`^${name} · ใช้ไป `))
    .closest('li')
}

function setBudget(name, amount) {
  fireEvent.change(within(budgetRow(name)).getByPlaceholderText('งบ'), {
    target: { value: String(amount) },
  })
}

function categoryRemaining(name) {
  return within(budgetRow(name)).getByText(/^เหลือ .* บาท$/).textContent
}

function entriesPanel() {
  return screen.getByText('รายการรายจ่าย').closest('div')
}

function entryRow(text) {
  return within(entriesPanel()).getByText(text).closest('li')
}

function searchBox() {
  return screen.getByPlaceholderText('ค้นหารายจ่าย')
}

// Driving the form the way a learner does: type, pick a category, submit.
function addExpense({ category, amount, note }) {
  fireEvent.change(screen.getByPlaceholderText('จำนวนเงิน'), {
    target: { value: String(amount) },
  })
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: category },
  })
  if (note) {
    fireEvent.change(screen.getByPlaceholderText('หมายเหตุ'), {
      target: { value: note },
    })
  }
  fireEvent.click(screen.getByRole('button', { name: 'เพิ่มรายจ่าย' }))
}

describe('หน้า 12 — โปรเจกต์ปิดท้าย', () => {
  beforeEach(() => {
    // Storage outlives a test, so a previous case's log must not satisfy the
    // next one's reload.
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  // Criterion 6 — the Redux DevTools check — needs the extension and a
  // development build, so it stays manual, as on pages 10 and 11.

  test('เพิ่มรายจ่ายด้วยจำนวนเงินและหมวดหมู่ แล้วรายการใหม่ขึ้นในลิสต์ และยอดใช้ไปบนการ์ดสรุปเพิ่มขึ้นตามจำนวนนั้น', async () => {
    stubCategoriesFetch()
    await mountDemo()
    await waitForCategories()

    expect(summaryValue('ใช้ไป')).toBe('0 บาท')

    addExpense({ category: 'food', amount: 150, note: 'ข้าวกลางวัน' })

    expect(
      within(entriesPanel()).getByText('อาหาร · 150 บาท · ข้าวกลางวัน'),
    ).toBeInTheDocument()
    expect(summaryValue('ใช้ไป')).toBe('150 บาท')

    addExpense({ category: 'travel', amount: 80 })

    expect(
      within(entriesPanel()).getByText('เดินทาง · 80 บาท'),
    ).toBeInTheDocument()
    // The summary adds every entry, so it moves by the second amount too.
    expect(summaryValue('ใช้ไป')).toBe('230 บาท')
  })

  test('ตั้งงบให้หมวดหนึ่ง แล้วยอดคงเหลือของหมวดนั้นลดลงตามที่จ่ายไปในหมวดนั้น', async () => {
    stubCategoriesFetch()
    await mountDemo()
    await waitForCategories()

    setBudget('อาหาร', 500)
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 500 บาท')
    expect(summaryValue('งบทั้งหมด')).toBe('500 บาท')

    addExpense({ category: 'food', amount: 200 })

    expect(
      within(budgetRow('อาหาร')).getByText('อาหาร · ใช้ไป 200 บาท'),
    ).toBeInTheDocument()
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 300 บาท')

    // A spend in another category leaves this category's remainder alone: the
    // budgets are per category, not one shared number.
    addExpense({ category: 'travel', amount: 50 })
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 300 บาท')
  })

  test('พิมพ์ค้นหาแล้วลิสต์สั้นลง แต่ยอดใช้ไปและงบทั้งหมดบนการ์ดสรุปยังเท่าเดิม', async () => {
    stubCategoriesFetch()
    await mountDemo()
    await waitForCategories()

    addExpense({ category: 'food', amount: 150, note: 'ข้าวกลางวัน' })
    addExpense({ category: 'travel', amount: 80, note: 'รถเมล์' })
    setBudget('อาหาร', 500)

    expect(summaryValue('ใช้ไป')).toBe('230 บาท')
    expect(summaryValue('งบทั้งหมด')).toBe('500 บาท')

    fireEvent.change(searchBox(), { target: { value: 'ข้าว' } })

    // The list is filtered to the match...
    expect(
      within(entriesPanel()).getByText('อาหาร · 150 บาท · ข้าวกลางวัน'),
    ).toBeInTheDocument()
    expect(
      within(entriesPanel()).queryByText('เดินทาง · 80 บาท · รถเมล์'),
    ).not.toBeInTheDocument()
    // ...but the totals come from the store, not from the rows on screen.
    expect(summaryValue('ใช้ไป')).toBe('230 บาท')
    expect(summaryValue('งบทั้งหมด')).toBe('500 บาท')

    // The filter also matches the category name, and the totals still hold.
    fireEvent.change(searchBox(), { target: { value: 'เดินทาง' } })
    expect(
      within(entriesPanel()).getByText('เดินทาง · 80 บาท · รถเมล์'),
    ).toBeInTheDocument()
    expect(
      within(entriesPanel()).queryByText('อาหาร · 150 บาท · ข้าวกลางวัน'),
    ).not.toBeInTheDocument()
    expect(summaryValue('ใช้ไป')).toBe('230 บาท')
  })

  test('ลบรายจ่ายแล้วยอดใช้ไปและยอดคงเหลือกลับมาเท่าเดิม', async () => {
    stubCategoriesFetch()
    await mountDemo()
    await waitForCategories()

    setBudget('อาหาร', 500)
    addExpense({ category: 'food', amount: 150 })

    expect(summaryValue('ใช้ไป')).toBe('150 บาท')
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 350 บาท')

    fireEvent.click(
      within(entryRow('อาหาร · 150 บาท')).getByRole('button', { name: 'ลบ' }),
    )

    expect(summaryValue('ใช้ไป')).toBe('0 บาท')
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 500 บาท')
    expect(within(entriesPanel()).getByText('ยังไม่มีรายจ่าย')).toBeInTheDocument()
  })

  test('รีเฟรชหน้าแล้วรายจ่ายและงบประมาณที่ตั้งไว้ยังอยู่ครบ แต่รายการหมวดหมู่ถูกโหลดขึ้นมาใหม่', async () => {
    const pendingCategories = deferred()
    const fetchMock = vi
      .fn()
      // The first mount loads the catalogue normally.
      .mockResolvedValueOnce(okResponse(CATEGORIES))
      // The reload's request is held open so the loading state is observable.
      .mockReturnValueOnce(pendingCategories.promise)
    vi.stubGlobal('fetch', fetchMock)

    const view = await mountDemo()
    await waitForCategories()

    addExpense({ category: 'food', amount: 150 })
    setBudget('อาหาร', 500)

    await reload(view)

    // Entries and budgets come back on the first paint...
    expect(summaryValue('ใช้ไป')).toBe('150 บาท')
    expect(summaryValue('งบทั้งหมด')).toBe('500 บาท')
    // ...but the catalogue was not persisted: it is loading again.
    expect(screen.getByText('กำลังโหลดหมวดหมู่...')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // Resolving the held request refills the catalogue from the network, and
    // the persisted budget is applied to it.
    pendingCategories.resolve(okResponse(CATEGORIES))
    await screen.findByText(/^อาหาร · ใช้ไป 150 บาท$/)
    expect(categoryRemaining('อาหาร')).toBe('เหลือ 350 บาท')
    expect(within(budgetRow('อาหาร')).getByPlaceholderText('งบ')).toHaveValue(500)
  })
})
