import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class DeleteQuizUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(quizId: string, actorUserId: string | null): Promise<void> {
    return this.quizRepository.deleteQuiz(quizId, actorUserId);
  }
}
