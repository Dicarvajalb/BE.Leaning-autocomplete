import type { CreateQuestionInput, QuizQuestion } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class CreateQuestionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    quizId: string,
    input: CreateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion> {
    return this.quizRepository.createQuestion(quizId, input, actorUserId);
  }
}
