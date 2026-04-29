import type {
  CreateQuestionInput,
  CreateQuizInput,
  CreateQuizSessionInput,
  JoinQuizSessionInput,
  QuizDetail,
  QuizQuestion,
  QuizSessionAnswerSubmissionResult,
  QuizSessionDetail,
  QuizSessionResult,
  SearchQuizzesInput,
  SearchQuizzesResult,
  SubmitQuizSessionAnswerInput,
  UpdateQuestionInput,
  UpdateQuizInput,
} from '../domain/entities';

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY');

export interface QuizRepositoryPort {
  searchQuizzes(input: SearchQuizzesInput): Promise<SearchQuizzesResult>;
  getQuizDetail(quizId: string): Promise<QuizDetail>;
  createQuiz(input: CreateQuizInput, actorUserId: string | null): Promise<QuizDetail>;
  updateQuiz(
    quizId: string,
    input: UpdateQuizInput,
    actorUserId: string | null,
  ): Promise<QuizDetail>;
  deleteQuiz(quizId: string, actorUserId: string | null): Promise<void>;
  createQuestion(
    quizId: string,
    input: CreateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion>;
  updateQuestion(
    quizId: string,
    questionId: string,
    input: UpdateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion>;
  deleteQuestion(
    quizId: string,
    questionId: string,
    actorUserId: string | null,
  ): Promise<void>;
  createQuizSession(
    quizId: string,
    input: CreateQuizSessionInput,
  ): Promise<QuizSessionDetail>;
  joinQuizSession(
    joinCode: string,
    input: JoinQuizSessionInput,
  ): Promise<QuizSessionDetail>;
  getQuizSession(sessionId: string): Promise<QuizSessionDetail>;
  submitQuizSessionAnswer(
    sessionId: string,
    input: SubmitQuizSessionAnswerInput,
  ): Promise<QuizSessionAnswerSubmissionResult>;
  getQuizSessionResult(sessionId: string): Promise<QuizSessionResult>;
}
