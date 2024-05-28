import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

class InMemoryQuestionsRepository implements QuestionsRepository {
  private questions: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  count(): Promise<number> {
    return Promise.resolve(this.questions.length)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page! - 1) * 20, page! * 20)

    return questions
  }

  async update(question: Question): Promise<void> {
    const index = this.questions.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.questions[index] = question

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = this.questions.find(
      (question) => question.id.toString() === questionId,
    )

    return question ?? null
  }

  async delete(question: Question): Promise<void> {
    const index = this.questions.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.questions.splice(index, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.questions.find(
      (question) => question.slug.value === slug,
    )

    return question ?? null
  }

  async create(question: Question) {
    this.questions.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}

export { InMemoryQuestionsRepository }
