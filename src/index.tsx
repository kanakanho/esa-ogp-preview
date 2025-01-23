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

const app = new Hono()

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <Style />
      </head>
      <body style={{ margin: 0 }}>{props.children}</body>
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
    const buffer = await fetch(metaData.image).then(res => res.arrayBuffer())
    const imageBuffer = Buffer.from(buffer).toString('base64')
    const text = (
      <CardSVG metaData={metaData} imageBuffer={imageBuffer} />
    ).toString()
    c.header('Content-Type', 'image/svg+xml')
    return c.body(text)
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

export default app
