import { test } from '@jest/globals';
import { DeleteQuestionUseCase } from '../../../src/quiz/use-cases/delete-question.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('DeleteQuestionUseCase delegates question deletion', async () => {
  const calls: Array<{ quizId: string; questionId: string; actorUserId: string | null }> = [];
  const repository = {
    deleteQuestion: async (quizId: string, questionId: string, actorUserId: string | null) => {
      calls.push({ quizId, questionId, actorUserId });
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new DeleteQuestionUseCase(repository);
  await expect(useCase.execute('quiz-7', 'question-3', 'user-6')).resolves.toBeUndefined();

  expect(calls).toEqual([
    { quizId: 'quiz-7', questionId: 'question-3', actorUserId: 'user-6' },
  ]);
});
