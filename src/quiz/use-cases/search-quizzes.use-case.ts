import type { SearchQuizzesInput, SearchQuizzesResult } from '../domain/entities';
import type { QuizRepositoryPort } from '../ports/quiz.ports';

export class SearchQuizzesUseCase {
  constructor(private readonly quizRepository: QuizRepositoryPort) {}

  execute(input: SearchQuizzesInput): Promise<SearchQuizzesResult> {
    return this.quizRepository.searchQuizzes(input);
  }
}
