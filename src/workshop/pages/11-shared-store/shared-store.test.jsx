import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// The catalog the page fetches, matching the learner's src/data/products.json.
const PRODUCTS = [
  { id: 'coffee', name: 'กาแฟ', price: 60 },
  { id: 'tea', name: 'ชา', price: 45 },
  { id: 'orange', name: 'น้ำส้ม', price: 55 },
]

function okResponse(products) {
  return { ok: true, json: () => Promise.resolve(products) }
}

// The demo fetches on mount, so every test stubs fetch with the JSON the brief
// specifies and never touches the network.
function stubCatalogFetch(products = PRODUCTS) {
  const fetchMock = vi.fn(() => Promise.resolve(okResponse(products)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
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

async function waitForCatalog() {
  await screen.findByText(/^กาแฟ · 60 บาท$/)
}

// The catalog is the first list on the page. Finding a row through its product
// text keeps each product's button unambiguous even once the same product also
// appears in the cart.
function catalogList() {
  const [catalog] = screen.getAllByRole('list')
  return catalog
}

function catalogRow(name) {
  return within(catalogList())
    .getByText(new RegExp(`^${name} · `))
    .closest('li')
}

function addToCart(name) {
  fireEvent.click(
    within(catalogRow(name)).getByRole('button', { name: 'เพิ่มลงตะกร้า' }),
  )
}

// The cart panel is the region holding the cart heading. Its rows repeat the
// catalog's product text, so every cart lookup goes through the panel first.
function cartPanel() {
  return screen.getByText('ตะกร้าสินค้า').closest('div')
}

// The bar across the top is the app's second surface: it reads the summary and
// owns the clear button. The summary only exists there, never in the body.
function headerSummary(count, total) {
  return screen.getByText(`ตะกร้า ${count} ชิ้น · เป็นเงิน ${total} บาท`)
}

function searchBox() {
  return screen.getByPlaceholderText('ค้นหาสินค้า')
}

describe('หน้า 11 — ใช้ store ร่วมกันทั้งแอป', () => {
  beforeEach(() => {
    // Storage outlives a test, so a previous case's cart must not satisfy the
    // next one's reload.
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  test('เพิ่มสินค้าลงตะกร้าแล้วจำนวนชิ้นและยอดเงินบนแถบด้านบนเปลี่ยนตามทันที', async () => {
    // The write happens in the body; the read that moves is the header's. That
    // the numbers change across the two surfaces is the sharing.
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    expect(headerSummary(1, 60)).toBeInTheDocument()

    addToCart('กาแฟ')
    expect(headerSummary(2, 120)).toBeInTheDocument()

    addToCart('ชา')
    expect(headerSummary(3, 165)).toBeInTheDocument()

    // The body still shows the cart the header summarises.
    expect(
      within(cartPanel()).getByText(/^กาแฟ · 60 บาท$/),
    ).toBeInTheDocument()
  })

  test('กดปุ่มล้างตะกร้าบนแถบด้านบนแล้วรายการในตะกร้าด้านล่างหายหมด และยอดบนแถบด้านบนกลับเป็น 0', async () => {
    // The other direction: the write happens on the header, the emptied list is
    // in the body.
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('ชา')
    expect(headerSummary(2, 105)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ล้างตะกร้า' }))

    expect(headerSummary(0, 0)).toBeInTheDocument()
    expect(
      within(cartPanel()).getByText('ยังไม่มีสินค้าในตะกร้า'),
    ).toBeInTheDocument()
  })

  test('พิมพ์คำค้นหาแล้วรายการสินค้าถูกกรอง แต่ยอดในตะกร้ายังเท่าเดิม และข้อความค้นหาไม่เข้า store', async () => {
    // Every store change runs persist, so it writes to storage: a keystroke
    // that reached the store would land there. The fetch's own store writes are
    // already done by the time the catalog is visible, so only typing is left
    // to observe.
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    // The channel works: a real store write (adding from the body) reaches
    // storage, so a later silence is evidence and not a broken spy.
    addToCart('กาแฟ')
    expect(setItem).toHaveBeenCalled()
    expect(headerSummary(1, 60)).toBeInTheDocument()
    setItem.mockClear()

    fireEvent.change(searchBox(), { target: { value: 'ชา' } })

    // The catalog is filtered to the match...
    expect(within(catalogList()).getByText(/^ชา · 45 บาท$/)).toBeInTheDocument()
    expect(
      within(catalogList()).queryByText(/^กาแฟ · 60 บาท$/),
    ).not.toBeInTheDocument()
    // ...the header's numbers do not move...
    expect(headerSummary(1, 60)).toBeInTheDocument()
    // ...and no store action ran, so nothing reached storage.
    expect(setItem).not.toHaveBeenCalled()
  })

  test('รีเฟรชหน้าแล้วตะกร้ายังอยู่ครบเหมือนก่อนแยกคอมโพเนนต์', async () => {
    // The store's persist options were copied across untouched, so the cart
    // survives the re-cut into two surfaces.
    stubCatalogFetch()
    const view = await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('กาแฟ')
    addToCart('ชา')
    expect(headerSummary(3, 165)).toBeInTheDocument()

    await reload(view)

    // The cart is back on the first paint, before the refetched catalog matters.
    expect(headerSummary(3, 165)).toBeInTheDocument()
    expect(
      within(cartPanel()).getByText(/^กาแฟ · 60 บาท$/),
    ).toBeInTheDocument()
    expect(within(cartPanel()).getByText(/^ชา · 45 บาท$/)).toBeInTheDocument()
  })
})
