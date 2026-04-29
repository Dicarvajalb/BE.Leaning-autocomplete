import { test } from '@jest/globals';
import { GetQuizSessionResultUseCase } from '../../../src/quiz/use-cases/get-quiz-session-result.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('GetQuizSessionResultUseCase delegates result lookup', async () => {
  const expected = {
    session: {
      id: 'session-5',
      quizId: 'quiz-12',
      mode: 'SOLO' as const,
      status: 'COMPLETED' as const,
      joinCode: null,
      shareLink: null,
      currentQuestion: 1,
      startedAt: null,
      completedAt: null,
      expiresAt: null,
      participants: [],
      quiz: {
        id: 'quiz-12',
        title: 'Quiz',
        topic: 'Topic',
        difficulty: 'EASY' as const,
        description: null,
        questions: [],
      },
    },
    participants: [],
    questions: [],
  };
  const repository = {
    getQuizSessionResult: async (sessionId: string) => {
      expect(sessionId).toBe('session-5');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new GetQuizSessionResultUseCase(repository);
  await expect(useCase.execute('session-5')).resolves.toEqual(expected);
});
