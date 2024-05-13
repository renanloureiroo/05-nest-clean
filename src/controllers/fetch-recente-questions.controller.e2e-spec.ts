import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'

import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'

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

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '12345678',
      },
    })

    await prisma.question.createMany({
      data: new Array(30).fill(null).map((_, index) => ({
        title: `Question ${index + 1}`,
        slug: `question-${index + 1}`,
        content: `Content ${index + 1}`,
        authorId: user.id,
      })),
    })

    const response = await request(app.getHttpServer()).get('/questions')

    expect(response.status).toBe(200)
    expect(response.body.currentPage).toBe(1)
    expect(response.body.totalPages).toBe(2)
    expect(response.body.questions).toHaveLength(20)
  })
})
