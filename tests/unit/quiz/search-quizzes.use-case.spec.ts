import { test } from '@jest/globals';
import { SearchQuizzesUseCase } from '../../../src/quiz/use-cases/search-quizzes.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('SearchQuizzesUseCase delegates search input', async () => {
  const expected = { items: [], page: 1, limit: 10, total: 0 };
  const repository = {
    searchQuizzes: async (input: { q?: string; page?: number; limit?: number }) => {
      expect(input).toEqual({ q: 'math', page: 2, limit: 5 });
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new SearchQuizzesUseCase(repository);
  await expect(useCase.execute({ q: 'math', page: 2, limit: 5 })).resolves.toEqual(expected);
});
