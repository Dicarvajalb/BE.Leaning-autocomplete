import type { QuizDetail, UpdateQuizInput } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class UpdateQuizUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    quizId: string,
    input: UpdateQuizInput,
    actorUserId: string | null,
  ): Promise<QuizDetail> {
    return this.quizRepository.updateQuiz(quizId, input, actorUserId);
  }
}
