import type { QuizSessionDetail } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class GetQuizSessionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(sessionId: string): Promise<QuizSessionDetail> {
    return this.quizRepository.getQuizSession(sessionId);
  }
}
