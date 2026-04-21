import { test } from '@jest/globals';
import { DeleteQuizUseCase } from '../../../src/quiz/use-cases/delete-quiz.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('DeleteQuizUseCase delegates quiz deletion', async () => {
  const calls: Array<{ quizId: string; actorUserId: string | null }> = [];
  const repository = {
    deleteQuiz: async (quizId: string, actorUserId: string | null) => {
      calls.push({ quizId, actorUserId });
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new DeleteQuizUseCase(repository);
  await expect(useCase.execute('quiz-4', 'user-3')).resolves.toBeUndefined();

  expect(calls).toEqual([{ quizId: 'quiz-4', actorUserId: 'user-3' }]);
});
