export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (body.username === 'system-admin' && body.password === 'password') {
    return {
      accessToken: 'mock-access-token-12345',
      user: {
        id: 1,
        name: 'System Admin',
        email: 'admin@sensy.ai',
      },
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  })
})
