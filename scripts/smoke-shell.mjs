// Throwaway smoke check for the shell prototype: renders each variant
// server-side so a broken import or render path fails loudly.
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  // Externalised so the SSR graph and this script share one React copy.
  ssr: { external: ['react', 'react-dom', 'react-router', 'zustand'] },
})

const { pages } = await server.ssrLoadModule('/src/workshop/pages/index.js')

let failed = false
for (const key of ['A', 'B', 'C']) {
  const mod = await server.ssrLoadModule(`/src/prototype/shell/Variant${key}.jsx`)
  for (const current of [null, pages[0]]) {
    const where = current ? current.slug : 'home'
    try {
      const html = renderToString(
        React.createElement(
          MemoryRouter,
          { initialEntries: [`/prototype/shell?variant=${key}`] },
          React.createElement(mod.default, {
            pages,
            current,
            link: (p) => p,
          }),
        ),
      )
      const ok =
        html.length > 500 &&
        (!current || html.includes('เดโมเป้าหมาย')) &&
        (!current || html.includes('ตัวนับ'))
      console.log(
        `${ok ? 'ok  ' : 'FAIL'} variant ${key} ${where} (${html.length} chars)`,
      )
      failed ||= !ok
    } catch (error) {
      console.log(`FAIL variant ${key} ${where}: ${error.message}`)
      failed = true
    }
  }
}

await server.close()
process.exit(failed ? 1 : 0)
