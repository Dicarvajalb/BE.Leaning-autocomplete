import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class DeleteQuestionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    quizId: string,
    questionId: string,
    actorUserId: string | null,
  ): Promise<void> {
    return this.quizRepository.deleteQuestion(quizId, questionId, actorUserId);
  }
}
