import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('E2E: create account', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@email.com' },
    })

    expect(response.status).toBe(201)
    expect(userOnDatabase).toBeTruthy()
  })
})
