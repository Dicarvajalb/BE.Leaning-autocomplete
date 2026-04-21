import { test } from '@jest/globals';
import { UpdateQuestionUseCase } from '../../../src/quiz/use-cases/update-question.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('UpdateQuestionUseCase delegates question update', async () => {
  const input = {
    description: 'Updated question',
    type: 'AUTOCOMPLETE_ORDER' as const,
    options: [{ word: 'two', label: 'HIDE' as const }],
  };
  const expected = {
    id: 'question-2',
    description: 'Updated question',
    type: 'AUTOCOMPLETE_ORDER' as const,
    options: [{ word: 'two', label: 'HIDE' as const }],
  };
  const repository = {
    updateQuestion: async (
      quizId: string,
      questionId: string,
      repoInput: typeof input,
      actorUserId: string | null,
    ) => {
      expect(quizId).toBe('quiz-6');
      expect(questionId).toBe('question-2');
      expect(repoInput).toEqual(input);
      expect(actorUserId).toBe('user-5');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new UpdateQuestionUseCase(repository);
  await expect(
    useCase.execute('quiz-6', 'question-2', input, 'user-5'),
  ).resolves.toEqual(expected);
});
