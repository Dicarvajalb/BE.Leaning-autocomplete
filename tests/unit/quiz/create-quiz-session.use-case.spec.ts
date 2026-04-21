import { test } from '@jest/globals';
import { CreateQuizSessionUseCase } from '../../../src/quiz/use-cases/create-quiz-session.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('CreateQuizSessionUseCase delegates session creation', async () => {
  const input = { mode: 'SOLO' as const, participantUserId: 'user-7' };
  const expected = {
    id: 'session-1',
    quizId: 'quiz-8',
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
      id: 'quiz-8',
      title: 'Quiz',
      topic: 'Topic',
      difficulty: 'EASY' as const,
      description: null,
      questions: [],
    },
  };
  const repository = {
    createQuizSession: async (quizId: string, repoInput: typeof input) => {
      expect(quizId).toBe('quiz-8');
      expect(repoInput).toEqual(input);
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new CreateQuizSessionUseCase(repository);
  await expect(useCase.execute('quiz-8', input)).resolves.toEqual(expected);
});
