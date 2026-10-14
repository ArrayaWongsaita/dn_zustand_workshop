import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// The catalog the page fetches, matching the learner's src/data/products.json.
const PRODUCTS = [
  { id: 'coffee', name: 'กาแฟ', price: 60 },
  { id: 'tea', name: 'ชา', price: 45 },
  { id: 'orange', name: 'น้ำส้ม', price: 55 },
]

const STORAGE_KEY = 'zustand-workshop-cart'

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

describe('หน้า 9 — แยก store ออกเป็นส่วน ๆ', () => {
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
    // catalog can matter.
    expect(cartSummary(2, 105)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('ส่งตอนเย็น')
  })

  test('หลังรีเฟรช รายการสินค้าถูกโหลดใหม่ (เห็นข้อความกำลังโหลดก่อน) ไม่ได้ถูกจำมาจากครั้งก่อน', async () => {
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
    // shows the loading message, even though the cart is already back.
    expect(screen.getByText('กำลังโหลดสินค้า...')).toBeInTheDocument()
    expect(cartSummary(1, 60)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // Resolving the held request fills the catalog from the network.
    pendingCatalog.resolve(okResponse(PRODUCTS))
    await waitFor(() =>
      expect(screen.getByText(/^ชา · 45 บาท$/)).toBeInTheDocument(),
    )
  })

  test('store แยกเป็นสองไฟล์ src/store/cartSlice.js และ src/store/catalogSlice.js แล้วถูกประกอบกลับเป็น store เดียวที่ App.jsx ใช้', async () => {
    // Two separate stores would look identical on screen, so the split cannot
    // be seen in the demo. The seam is still the page record: its solutionFiles
    // are exactly the files the learner writes, at the learner's own paths.
    const { default: page } = await import('./index.js')
    const byName = new Map(page.solutionFiles.map((file) => [file.name, file.source]))
    expect([...byName.keys()]).toEqual(
      expect.arrayContaining([
        'src/store/cartSlice.js',
        'src/store/catalogSlice.js',
        'src/store/useBoundStore.js',
        'src/App.jsx',
      ]),
    )

    // The bound store spreads both slices; App uses the bound store only.
    const boundStore = byName.get('src/store/useBoundStore.js')
    expect(boundStore).toMatch(/\.\.\.createCartSlice/)
    expect(boundStore).toMatch(/\.\.\.createCatalogSlice/)
    expect(byName.get('src/App.jsx')).toMatch(/useBoundStore/)

    // Driving the assembled store once shows both halves are served together.
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()
    addToCart('กาแฟ')
    expect(cartSummary(1, 60)).toBeInTheDocument()
  })

  test('เปิด DevTools → Application → Local Storage เห็นคีย์ zustand-workshop-cart และข้อมูลที่เก็บเป็นของตะกร้าเท่านั้น', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okResponse(PRODUCTS))
      // A failed refetch puts the page in its transient error state, which must
      // not reach storage either.
      .mockRejectedValueOnce(new Error('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    const view = await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'ส่งตอนเย็น' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }))
    expect(await screen.findByText('โหลดข้อมูลไม่สำเร็จ')).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).not.toBeNull()
    // The stored state is the cart and nothing else: the catalog, the loading
    // status and the error message are all transient. partialize still reaches
    // into the cart slice, exactly as page 8 selected its cart.
    expect(Object.keys(stored.state)).toEqual(['cart'])
    expect(stored.state.cart).toEqual({
      items: [{ id: 'coffee', name: 'กาแฟ', price: 60, qty: 1 }],
      note: 'ส่งตอนเย็น',
    })

    void view
  })
})
