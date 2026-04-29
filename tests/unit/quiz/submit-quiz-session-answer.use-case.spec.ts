import { test } from '@jest/globals';
import { SubmitQuizSessionAnswerUseCase } from '../../../src/quiz/use-cases/submit-quiz-session-answer.use-case';
import type { QuizRepositoryPort } from '../../../src/quiz/ports/quiz.ports';

test('SubmitQuizSessionAnswerUseCase delegates answer submission', async () => {
  const input = {
    participantId: 'participant-1',
    questionId: 'question-4',
    selectedOrder: ['one', 'two'],
  };
  const expected = {
    session: {
      id: 'session-4',
      quizId: 'quiz-11',
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
        id: 'quiz-11',
        title: 'Quiz',
        topic: 'Topic',
        difficulty: 'EASY' as const,
        description: null,
        questions: [],
      },
    },
    comparison: {
      questionId: 'question-4',
      questionIndex: 0,
      canonicalOrder: ['one', 'two'],
      firstResponderParticipantId: 'participant-1',
      answers: [],
    },
    submittedAnswer: null,
  };
  const repository = {
    submitQuizSessionAnswer: async (sessionId: string, repoInput: typeof input) => {
      expect(sessionId).toBe('session-4');
      expect(repoInput).toEqual(input);
      return expected;
    },
  } as unknown as QuizRepositoryPort;

  const useCase = new SubmitQuizSessionAnswerUseCase(repository);
  await expect(useCase.execute('session-4', input)).resolves.toEqual(expected);
});
