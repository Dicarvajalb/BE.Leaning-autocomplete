import type { CreateQuizSessionInput, QuizSessionDetail } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class CreateQuizSessionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    quizId: string,
    input: CreateQuizSessionInput,
  ): Promise<QuizSessionDetail> {
    return this.quizRepository.createQuizSession(quizId, input);
  }
}
