import { test } from '@jest/globals';
import { GetQuizDetailUseCase } from '../../../src/quiz/use-cases/get-quiz-detail.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('GetQuizDetailUseCase delegates quiz id', async () => {
  const expected = {
    id: 'quiz-1',
    title: 'Quiz',
    topic: 'Topic',
    difficulty: 'EASY' as const,
    description: null,
    questions: [],
  };
  const repository = {
    getQuizDetail: async (quizId: string) => {
      expect(quizId).toBe('quiz-1');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new GetQuizDetailUseCase(repository);
  await expect(useCase.execute('quiz-1')).resolves.toEqual(expected);
});
