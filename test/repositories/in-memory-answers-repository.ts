import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

class InMemoryAnswersRepository implements AnswersRepository {
  private answers: Answer[] = []

  constructor(
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async update(answer: Answer): Promise<void> {
    const index = this.answers.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    this.answers[index] = answer

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.answers.findIndex(
      (a) => a.id.toString() === answer.id.toString(),
    )

    this.answers.splice(index, 1)

    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.answers.find((answer) => answer.id.toString() === id)

    return answer ?? null
  }

  async create(answer: Answer) {
    this.answers.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}

export { InMemoryAnswersRepository }
