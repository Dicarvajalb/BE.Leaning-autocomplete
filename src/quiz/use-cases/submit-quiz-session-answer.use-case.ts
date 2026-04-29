import type {
  QuizSessionAnswerSubmissionResult,
  SubmitQuizSessionAnswerInput,
} from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class SubmitQuizSessionAnswerUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(
    sessionId: string,
    input: SubmitQuizSessionAnswerInput,
  ): Promise<QuizSessionAnswerSubmissionResult> {
    return this.quizRepository.submitQuizSessionAnswer(sessionId, input);
  }
}
