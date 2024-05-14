import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

describe('E2E: create question', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get<PrismaService>(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: await hash('12345678', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .auth(accessToken, { type: 'bearer' })
      .send({
        title: 'How to create a question?',
        content: 'I would like to know how to create a question',
      })

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'How to create a question?' },
    })

    expect(response.status).toBe(201)
    expect(questionOnDatabase).toBeTruthy()
  })
})
