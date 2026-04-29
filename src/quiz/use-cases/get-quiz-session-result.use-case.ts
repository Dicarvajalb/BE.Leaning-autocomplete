import type { QuizSessionResult } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class GetQuizSessionResultUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(sessionId: string): Promise<QuizSessionResult> {
    return this.quizRepository.getQuizSessionResult(sessionId);
  }
}
