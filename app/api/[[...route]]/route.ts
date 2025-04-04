import { authController } from '@/servers/controllers/authController'
import { schoolController } from '@/servers/controllers/schoolController'
import { studentController } from '@/servers/controllers/studentController'
import { AuthServices } from '@/servers/services/authServices'
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

app.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  const user = token ? await AuthServices.GETTOKEN(token) : null;

  c.set('user', user);

  await next();
});

app.route('/sekolah', schoolController)
app.route('/student', studentController)

export const GET = handle(app)
export const PATCH = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)