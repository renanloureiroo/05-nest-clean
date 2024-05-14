import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  private readonly questionAttachments: QuestionAttachment[] = []

  async create(attachment: QuestionAttachment): Promise<void> {
    this.questionAttachments.push(attachment)
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = this.questionAttachments.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId,
    )

    return attachments
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const itens = this.questionAttachments.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.questionAttachments.splice(
      0,
      this.questionAttachments.length,
      ...itens,
    )
  }
}

export { InMemoryQuestionAttachmentsRepository }
