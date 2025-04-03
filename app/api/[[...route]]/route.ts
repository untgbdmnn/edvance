import { authController } from '@/servers/controllers/authController'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

interface Context {
  user?: unknown
  userId?: string
  token?: string
}

const app = new Hono<{ Variables: Context }>().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.route('/auth', authController)

export const GET = handle(app)
export const POST = handle(app)