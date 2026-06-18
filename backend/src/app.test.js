const request = require('supertest')
const app = require('./app')

describe('GET /api/health', () => {
  it('répond avec un statut 200', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
  })

  it('retourne { status: "ok" }', async () => {
    const res = await request(app).get('/api/health')
    expect(res.body).toEqual({ status: 'ok' })
  })
})
