import type { QuizQuestion, UpdateQuestionInput } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class UpdateQuestionUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    quizId: string,
    questionId: string,
    input: UpdateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion> {
    return this.quizRepository.updateQuestion(
      quizId,
      questionId,
      input,
      actorUserId,
    );
  }
}
