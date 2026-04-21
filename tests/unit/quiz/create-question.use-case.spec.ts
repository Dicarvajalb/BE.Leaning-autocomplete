import { test } from '@jest/globals';
import { CreateQuestionUseCase } from '../../../src/quiz/use-cases/create-question.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('CreateQuestionUseCase delegates question creation', async () => {
  const input = {
    description: 'Question',
    type: 'AUTOCOMPLETE_ORDER' as const,
    options: [{ word: 'one', label: 'SHOW' as const }],
  };
  const expected = {
    id: 'question-1',
    description: 'Question',
    type: 'AUTOCOMPLETE_ORDER' as const,
    options: [{ word: 'one', label: 'SHOW' as const }],
  };
  const repository = {
    createQuestion: async (quizId: string, repoInput: typeof input, actorUserId: string | null) => {
      expect(quizId).toBe('quiz-5');
      expect(repoInput).toEqual(input);
      expect(actorUserId).toBe('user-4');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new CreateQuestionUseCase(repository);
  await expect(useCase.execute('quiz-5', input, 'user-4')).resolves.toEqual(expected);
});
