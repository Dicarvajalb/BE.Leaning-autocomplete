export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionType = 'AUTOCOMPLETE_ORDER';

export type QuestionOptionLabel = 'HIDE' | 'SHOW' | 'EXTRA';

export type QuizSessionMode = 'SOLO';

export type QuizSessionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type SessionParticipantSeat = 'SOLO';

export interface QuizSearchItem {
  id: string;
  title: string;
  topic: string;
  difficulty: QuizDifficulty;
  description: string | null;
  questionCount: number;
}

export interface QuizOption {
  word: string;
  label: QuestionOptionLabel;
}

export interface QuizQuestion {
  id: string;
  description: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface QuizQuestionInput {
  description: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface QuizDetail {
  id: string;
  title: string;
  topic: string;
  difficulty: QuizDifficulty;
  description: string | null;
  questions: QuizQuestion[];
}

export interface SessionParticipant {
  id: string;
  userId: string | null;
  seat: SessionParticipantSeat;
  joinedAt: Date;
  lastAnsweredAt: Date | null;
  lastAnswerMs: number | null;
}

export interface QuizSessionDetail {
  id: string;
  quizId: string;
  mode: QuizSessionMode;
  status: QuizSessionStatus;
  currentQuestion: number;
  startedAt: Date | null;
  completedAt: Date | null;
  expiresAt: Date | null;
  participants: SessionParticipant[];
  quiz: QuizDetail;
}

export interface CreateQuizSessionInput {
  participantUserId?: string | null;
}

export interface SubmitQuizSessionAnswerInput {
  participantId: string;
  questionId: string;
  selectedOrder: string[];
}

export interface QuizSessionAnswerComparison {
  answerId: string;
  participantId: string;
  seat: SessionParticipantSeat;
  selectedOrder: string[];
  isCorrect: boolean;
  scoreAwarded: number;
  answeredAt: Date;
  answeredMs: number;
  isFastest: boolean;
}

export interface QuizSessionQuestionComparison {
  questionId: string;
  questionIndex: number;
  canonicalOrder: string[];
  firstResponderParticipantId: string | null;
  answers: QuizSessionAnswerComparison[];
}

export interface QuizSessionParticipantResult {
  participantId: string;
  userId: string | null;
  seat: SessionParticipantSeat;
  totalScore: number;
  answeredQuestions: number;
  correctAnswers: number;
  fastestAnswers: number;
}

export interface QuizSessionAnswerSubmissionResult {
  session: QuizSessionDetail;
  comparison: QuizSessionQuestionComparison;
  submittedAnswer: QuizSessionAnswerComparison | null;
}

export interface QuizSessionResult {
  session: QuizSessionDetail;
  participants: QuizSessionParticipantResult[];
  questions: QuizSessionQuestionComparison[];
}

export interface QuizSessionUpdateEvent {
  session: QuizSessionDetail;
}

export interface QuizSessionAnswerEvent {
  session: QuizSessionDetail;
  comparison: QuizSessionQuestionComparison;
  submittedAnswer: QuizSessionAnswerComparison | null;
}

export interface QuizSessionResultEvent {
  result: QuizSessionResult;
}

export interface SearchQuizzesInput {
  q?: string;
  page?: number;
  limit?: number;
}

export interface SearchQuizzesResult {
  items: QuizSearchItem[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateQuizInput {
  title: string;
  topic: string;
  difficulty: QuizDifficulty;
  description?: string | null;
}

export type UpdateQuizInput = CreateQuizInput;

export type CreateQuestionInput = QuizQuestionInput;

export type UpdateQuestionInput = QuizQuestionInput;
