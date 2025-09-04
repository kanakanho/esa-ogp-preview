import type { FC } from 'hono/jsx'
import { Buffer } from 'node:buffer'
import { Hono } from 'hono'
import { Style } from 'hono/css'
import { parse } from 'node-html-parser'
import { z } from 'zod'
import Card from './Card'
import CardSVG from './CardSVG'

const MetaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
})

export type MetaData = z.infer<typeof MetaDataSchema>

const KVKeySchema = z.object({
  url: z.string(),
  width: z.number(),
  img: z.boolean(),
})

type Env = {
  esa_ogp_preview_svg_cache: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

const Layout: FC = (props) => {
  const { children } = props
  return (
    <html>
      <head>
        <Style />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/ogp', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json({
      error: 'URL is required',
    })
  }

  try {
    const data = await fetch(url).then(res => res.text())
    const root = parse(data)
    const title = root.querySelector('title')?.text || ''
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
    const metaData = MetaDataSchema.parse({
      title,
      description: description.length > 40 ? `${description.slice(0, 40)}...` : description,
      image: image.length === 0 ? '' : image.includes('http') ? image : `${url}/${image}`,
      url,
    })
    return c.html(
      <Layout>
        <Card metaData={metaData} />
      </Layout>,
    )
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      return c.json({
        error: e.message,
      })
    }
    return c.json({
      error: 'An error occurred',
    })
  }
})

app.get('/ogp/svg', async (c) => {
  const { url, width, img, cache } = c.req.query()
  const kv = c.env.esa_ogp_preview_svg_cache

  const cacheKey = JSON.stringify(
    KVKeySchema.parse({
      url,
      width: width ? Number(width) || 1000 : 1000,
      img: img !== 'false',
    }),
  )
  if (cache !== 'false') {
    const cachedSVG = await kv.get(cacheKey)
    if (cachedSVG) {
      c.header('Content-Type', 'image/svg+xml')
      return c.body(cachedSVG)
    }
  }
  if (!url) {
    return c.json({
      error: 'URL is required',
    })
  }

  const widthNum = width ? Number(width) || 0 : 1000
  if (widthNum === 0) {
    return c.json({
      error: 'width is invalid',
    })
  }

  // 横幅に応じた文字数を決定
  const textLength = widthNum / 18

  try {
    const data = await fetch(url).then(res => res.text())
    const root = parse(data)
    const title = root.querySelector('title')?.text || ''
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
    const metaData = MetaDataSchema.safeParse({
      title,
      description: description.length > textLength ? `${description.slice(0, textLength)}...` : description,
      image: image.length === 0 ? '' : image.includes('http') ? image : `${url}/${image}`,
      url,
    })
    if (!metaData.success) {
      throw new Error(metaData.error.message)
    }
    if (metaData.data === undefined) {
      throw new Error('Data is empty')
    }

    let buffer: Buffer
    if (img !== 'false') {
      buffer = await fetch(metaData.data.image).then(res => res.arrayBuffer())
    }
    else {
      buffer = Buffer.from('')
      metaData.data.image = ''
    }

    const imageBuffer = Buffer.from(buffer).toString('base64')
    const svgContent = (
      <CardSVG metaData={metaData.data} imageBuffer={imageBuffer} width={widthNum} />
    ).toString()
    // Store SVG in KV
    await kv.put(cacheKey, svgContent)

    c.header('Content-Type', 'image/svg+xml')
    return c.body(svgContent)
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === 'internal error') {
        return c.json({
          error: 'url is invalid',
        })
      }
      return c.json({
        error: e.message,
      })
    }
    return c.json({
      error: 'An error occurred',
    })
  }
})

export default app
