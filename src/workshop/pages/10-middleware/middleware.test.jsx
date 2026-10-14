import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

// A promise whose settlement the test decides: lets a test hold a reload's
// catalog request open and observe the loading state before the products land.
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

function cartRow(name) {
  return within(cartPanel())
    .getByText(new RegExp(`^${name} · `))
    .closest('li')
}

// The derived summary line is the only text of its exact shape, so reading it
// asserts what the learner sees without naming any selector or store field.
function cartSummary(count, total) {
  return within(cartPanel()).getByText(
    `รวม ${count} ชิ้น · เป็นเงิน ${total} บาท`,
  )
}

async function waitForCatalog() {
  await screen.findByText(/^กาแฟ · 60 บาท$/)
}

describe('หน้า 10 — ห่อ store ด้วย middleware', () => {
  beforeEach(() => {
    // Storage outlives a test, so a previous case's cart must not satisfy the
    // next one's reload.
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  test('เพิ่มสินค้าลงตะกร้าและพิมพ์หมายเหตุ แล้วรีเฟรชหน้า ยังเห็นรายการและหมายเหตุเดิมครบ', async () => {
    stubCatalogFetch()
    const view = await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('ชา')
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'ส่งตอนเย็น' },
    })
    expect(cartSummary(2, 105)).toBeInTheDocument()

    await reload(view)

    // The cart and the note come back on the first paint, before the refetched
    // catalog can matter: persist still wraps the store the middleware added.
    expect(cartSummary(2, 105)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('ส่งตอนเย็น')
  })

  test('โค้ดอัปเดต state ของตะกร้าเขียนแบบแก้ค่าใน state ตรง ๆ ไม่มี spread ซ้อนหลายชั้น และผลลัพธ์ยังเหมือนเดิม', async () => {
    // The cart's four nested updaters are the only ones immer rewrites, and
    // "no nested spread" is a fact about the learner's own file. The seam is
    // the page record: its solutionFiles are exactly the files the learner
    // writes, at the learner's own paths.
    const { default: page } = await import('./index.js')
    const cartSlice = page.solutionFiles.find(
      (file) => file.name === 'src/store/cartSlice.js',
    ).source

    // Direct mutations of the draft, not a rebuilt partial object.
    expect(cartSlice).toMatch(/state\.cart\.items\.push\(/)
    expect(cartSlice).toMatch(/item\.qty \+=/)
    expect(cartSlice).toMatch(/state\.cart\.items = state\.cart\.items\.filter\(/)
    expect(cartSlice).toMatch(/state\.cart\.note = note/)
    // No multi-level spread of the cart, and no updater rebuilds and returns a
    // new object (an immer updater mutates the draft and returns nothing).
    expect(cartSlice).not.toMatch(/\.\.\.state\.cart/)
    expect(cartSlice).not.toMatch(/return\s*\{/)

    // The behaviours those four updaters carry are unchanged: increment an
    // existing item, step the quantity up and down, set the note, and remove.
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('กาแฟ')
    expect(cartSummary(2, 120)).toBeInTheDocument()

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '+' }))
    expect(cartSummary(3, 180)).toBeInTheDocument()

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '−' }))
    expect(cartSummary(2, 120)).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'ส่งตอนเย็น' },
    })

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: 'ลบ' }))
    expect(
      within(cartPanel()).getByText('ยังไม่มีสินค้าในตะกร้า'),
    ).toBeInTheDocument()
  })

  test('หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ ไม่ได้ถูกจำมาจากครั้งก่อน', async () => {
    const pendingCatalog = deferred()
    const fetchMock = vi
      .fn()
      // The first mount loads the catalog normally.
      .mockResolvedValueOnce(okResponse(PRODUCTS))
      // The reload's request is held open so the loading state is observable.
      .mockReturnValueOnce(pendingCatalog.promise)
    vi.stubGlobal('fetch', fetchMock)

    const view = await mountDemo()
    await waitForCatalog()
    addToCart('กาแฟ')

    await reload(view)

    // The catalog was not persisted: the reload starts from no products and
    // shows the loading message, even though the cart is already back. The
    // guard in the slice is untouched, so the second request is the live one.
    expect(screen.getByText('กำลังโหลดสินค้า...')).toBeInTheDocument()
    expect(cartSummary(1, 60)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // Resolving the held request fills the catalog from the network.
    pendingCatalog.resolve(okResponse(PRODUCTS))
    await waitFor(() =>
      expect(screen.getByText(/^ชา · 45 บาท$/)).toBeInTheDocument(),
    )
  })

  test('คำขอเก่าที่กลับมาช้าไม่ทับรายการล่าสุด (fetch guard ยังทำงาน)', async () => {
    const stale = deferred()
    const fresh = deferred()
    const STALE = [{ id: 'stale', name: 'เก่า', price: 1 }]
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okResponse(PRODUCTS))
      .mockReturnValueOnce(stale.promise)
      .mockReturnValueOnce(fresh.promise)
    vi.stubGlobal('fetch', fetchMock)

    await mountDemo()
    await waitForCatalog()

    fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }))
    fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))

    // The latest request resolves first and its catalog shows...
    fresh.resolve(okResponse(PRODUCTS))
    await waitFor(() =>
      expect(
        within(catalogList()).getByText(/^น้ำส้ม · 55 บาท$/),
      ).toBeInTheDocument(),
    )

    // ...then the earlier one arrives; the request-id guard drops it, so the
    // catalog stays as the latest request left it.
    stale.resolve(okResponse(STALE))
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(
      within(catalogList()).queryByText(/^เก่า · 1 บาท$/),
    ).not.toBeInTheDocument()
    expect(
      within(catalogList()).getByText(/^กาแฟ · 60 บาท$/),
    ).toBeInTheDocument()
  })
})
