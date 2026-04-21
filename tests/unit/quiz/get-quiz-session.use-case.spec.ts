import { test } from '@jest/globals';
import { GetQuizSessionUseCase } from '../../../src/quiz/use-cases/get-quiz-session.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('GetQuizSessionUseCase delegates session lookup', async () => {
  const expected = {
    id: 'session-3',
    quizId: 'quiz-10',
    mode: 'SOLO' as const,
    status: 'ACTIVE' as const,
    joinCode: null,
    shareLink: null,
    currentQuestion: 0,
    startedAt: null,
    completedAt: null,
    expiresAt: null,
    participants: [],
    quiz: {
      id: 'quiz-10',
      title: 'Quiz',
      topic: 'Topic',
      difficulty: 'EASY' as const,
      description: null,
      questions: [],
    },
  };
  const repository = {
    getQuizSession: async (sessionId: string) => {
      expect(sessionId).toBe('session-3');
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new GetQuizSessionUseCase(repository);
  await expect(useCase.execute('session-3')).resolves.toEqual(expected);
});
