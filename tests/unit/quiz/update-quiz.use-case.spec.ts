import { test } from '@jest/globals';
import { UpdateQuizUseCase } from '../../../src/quiz/use-cases/update-quiz.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('UpdateQuizUseCase delegates quiz update', async () => {
  const input = {
    title: 'Updated quiz',
    topic: 'Science',
    difficulty: 'HARD' as const,
    description: null,
  };
  const expected = {
    id: 'quiz-3',
    title: 'Updated quiz',
    topic: 'Science',
    difficulty: 'HARD' as const,
    description: null,
    questions: [],
  };
  const repository = {
    updateQuiz: async (quizId: string, repoInput: typeof input, actorUserId: string | null) => {
      expect(quizId).toBe('quiz-3');
      expect(repoInput).toEqual(input);
      expect(actorUserId).toBe('user-2');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new UpdateQuizUseCase(repository);
  await expect(useCase.execute('quiz-3', input, 'user-2')).resolves.toEqual(expected);
});
