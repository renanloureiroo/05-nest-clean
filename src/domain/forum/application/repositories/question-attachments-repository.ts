import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  create(attachment: QuestionAttachment): Promise<void>
  deleteManyByQuestionId(questionId: string): Promise<void>
}

export { QuestionAttachmentsRepository }
