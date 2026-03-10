export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event)

  // Basic mock check
  if (headers.authorization === 'Bearer mock-access-token-12345') {
    return {
      id: 1,
      name: 'System Admin',
      email: 'admin@sensy.ai',
      role: 'admin',
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  })
})
