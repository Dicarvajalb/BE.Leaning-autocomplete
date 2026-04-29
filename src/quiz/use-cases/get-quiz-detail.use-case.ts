import type { QuizDetail } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class GetQuizDetailUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(quizId: string): Promise<QuizDetail> {
    return this.quizRepository.getQuizDetail(quizId);
  }
}
