import type { JoinQuizSessionInput, QuizSessionDetail } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class JoinQuizSessionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    joinCode: string,
    input: JoinQuizSessionInput,
  ): Promise<QuizSessionDetail> {
    return this.quizRepository.joinQuizSession(joinCode, input);
  }
}
