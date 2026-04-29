import { test } from '@jest/globals';
import { JoinQuizSessionUseCase } from '../../../src/quiz/use-cases/join-quiz-session.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('JoinQuizSessionUseCase delegates session join', async () => {
  const input = { participantUserId: 'user-8' };
  const expected = {
    id: 'session-2',
    quizId: 'quiz-9',
    mode: 'TWO_PLAYER' as const,
    status: 'ACTIVE' as const,
    joinCode: 'JOINME',
    shareLink: '/quiz-sessions/join/JOINME',
    currentQuestion: 0,
    startedAt: null,
    completedAt: null,
    expiresAt: null,
    participants: [],
    quiz: {
      id: 'quiz-9',
      title: 'Quiz',
      topic: 'Topic',
      difficulty: 'EASY' as const,
      description: null,
      questions: [],
    },
  };
  const repository = {
    joinQuizSession: async (joinCode: string, repoInput: typeof input) => {
      expect(joinCode).toBe('JOINME');
      expect(repoInput).toEqual(input);
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new JoinQuizSessionUseCase(repository);
  await expect(useCase.execute('JOINME', input)).resolves.toEqual(expected);
});
