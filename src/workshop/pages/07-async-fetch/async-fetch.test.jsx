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

// A page store is a module-level singleton, so state leaks between tests in a
// file. Importing the record fresh per test gives each test the goal demo from
// a clean state without reaching into store internals.
async function mountDemo() {
  vi.resetModules()
  const { default: page } = await import('./index.js')
  render(<page.Demo />)
  return page
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

describe('หน้า 7 — โหลดข้อมูลแบบ async', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('เปิดหน้าแล้วเห็นข้อความกำลังโหลดก่อน แล้วจึงเห็นสินค้าสามรายการ: กาแฟ 60 บาท ชา 45 บาท น้ำส้ม 55 บาท', async () => {
    stubCatalogFetch()
    await mountDemo()

    // The status flips to loading before the first await, so at least one frame
    // shows the message; only then does the fetched catalog arrive.
    expect(screen.getByText('กำลังโหลดสินค้า...')).toBeInTheDocument()

    await waitForCatalog()
    expect(screen.getByText(/^ชา · 45 บาท$/)).toBeInTheDocument()
    expect(screen.getByText(/^น้ำส้ม · 55 บาท$/)).toBeInTheDocument()
    expect(screen.queryByText('กำลังโหลดสินค้า...')).not.toBeInTheDocument()
  })

  test('กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท', async () => {
    stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('ชา')

    expect(cartSummary(2, 105)).toBeInTheDocument()
  })

  test('กด "โหลดใหม่" แล้วสินค้าถูกโหลดมาใหม่ และรายการในตะกร้ายังอยู่ครบพร้อมยอดเดิม', async () => {
    const fetchMock = stubCatalogFetch()
    await mountDemo()
    await waitForCatalog()

    addToCart('กาแฟ')
    addToCart('ชา')
    expect(cartSummary(2, 105)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }))

    // The refetch goes out, the products stay on screen, and once it settles the
    // cart and its summary are exactly as they were.
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(screen.queryByText('กำลังโหลด...')).not.toBeInTheDocument(),
    )
    expect(within(catalogList()).getByText(/^กาแฟ · 60 บาท$/)).toBeInTheDocument()
    expect(within(catalogList()).getByText(/^ชา · 45 บาท$/)).toBeInTheDocument()
    expect(
      within(catalogList()).getByText(/^น้ำส้ม · 55 บาท$/),
    ).toBeInTheDocument()
    expect(cartSummary(2, 105)).toBeInTheDocument()
  })

  test('เปิด DevTools แท็บ Network แล้วเลือก Offline กด "โหลดใหม่" เห็นข้อความว่าโหลดไม่สำเร็จพร้อมปุ่มลองใหม่ กลับมาออนไลน์แล้วกดลองใหม่ สินค้ากลับมาแสดง', async () => {
    const fetchMock = vi.fn()
    fetchMock.mockRejectedValueOnce(new Error('Failed to fetch'))
    fetchMock.mockResolvedValueOnce(okResponse(PRODUCTS))
    vi.stubGlobal('fetch', fetchMock)

    await mountDemo()

    // Offline: the failed request is reported with its own reason, and the
    // refresh button becomes a retry.
    expect(await screen.findByText('โหลดข้อมูลไม่สำเร็จ')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ลองใหม่' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ลองใหม่' }))

    // Back online: pressing retry restores the catalog and clears the error.
    await waitForCatalog()
    expect(screen.queryByText('โหลดข้อมูลไม่สำเร็จ')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'โหลดใหม่' })).toBeInTheDocument()
  })

  test('ใช้งานต่อได้ปกติ หน้าไม่ค้าง และ console ไม่มี error เรื่องการอัปเดตซ้ำ', async () => {
    const messages = []
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      messages.push(args.map(String).join(' '))
    })

    try {
      const fetchMock = stubCatalogFetch()
      await mountDemo()
      await waitForCatalog()

      addToCart('กาแฟ')
      addToCart('ชา')
      fireEvent.click(
        within(cartRow('กาแฟ')).getByRole('button', { name: '+' }),
      )

      // A refetch mid-session leaves the cart usable.
      fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }))
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      await waitFor(() =>
        expect(screen.queryByText('กำลังโหลด...')).not.toBeInTheDocument(),
      )

      fireEvent.click(
        within(cartRow('กาแฟ')).getByRole('button', { name: 'ลบ' }),
      )

      // The page is still responsive after the whole session: the summary
      // tracks the cart, so it has not frozen on a repeating update.
      expect(cartSummary(1, 45)).toBeInTheDocument()

      const repeating = messages.filter((message) =>
        /Maximum update depth exceeded|getSnapshot should be cached|infinite loop/i.test(
          message,
        ),
      )
      expect(repeating).toEqual([])
    } finally {
      errorSpy.mockRestore()
    }
  })
})
