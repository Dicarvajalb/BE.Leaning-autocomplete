import { test } from '@jest/globals';
import { CreateQuizUseCase } from '../../../src/quiz/use-cases/create-quiz.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('CreateQuizUseCase delegates quiz creation', async () => {
  const input = {
    title: 'New quiz',
    topic: 'History',
    difficulty: 'MEDIUM' as const,
    description: 'About history',
  };
  const expected = {
    id: 'quiz-2',
    title: 'New quiz',
    topic: 'History',
    difficulty: 'MEDIUM' as const,
    description: 'About history',
    questions: [],
  };
  const repository = {
    createQuiz: async (repoInput: typeof input, actorUserId: string | null) => {
      expect(repoInput).toEqual(input);
      expect(actorUserId).toBe('user-1');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new CreateQuizUseCase(repository);
  await expect(useCase.execute(input, 'user-1')).resolves.toEqual(expected);
});
