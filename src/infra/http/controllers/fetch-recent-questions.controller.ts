import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

const ITENS_PER_PAGE = 20

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParam = 1) {
    const totalQuestions = await this.prisma.question.count()
    const totalPages = Math.ceil(totalQuestions / ITENS_PER_PAGE)

    if (page > totalPages) {
      throw new BadRequestException('Invalid page number')
    }

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      take: ITENS_PER_PAGE,
      skip: (page - 1) * ITENS_PER_PAGE, // skip registers based on the page
    })

    return {
      currentPage: page,
      totalPages,
      questions,
    }
  }
}
