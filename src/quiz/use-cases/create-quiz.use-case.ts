import type { CreateQuizInput, QuizDetail } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class CreateQuizUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    input: CreateQuizInput,
    actorUserId: string | null,
  ): Promise<QuizDetail> {
    return this.quizRepository.createQuiz(input, actorUserId);
  }
}
