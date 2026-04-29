import { Inject, Injectable } from '@nestjs/common';
import {
  CREATE_QUESTION,
  CREATE_QUIZ,
  CREATE_QUIZ_SESSION,
  DELETE_QUESTION,
  DELETE_QUIZ,
  GET_QUIZ_DETAIL,
  GET_QUIZ_SESSION,
  GET_QUIZ_SESSION_RESULT,
  JOIN_QUIZ_SESSION,
  SEARCH_QUIZZES,
  SUBMIT_QUIZ_SESSION_ANSWER,
  UPDATE_QUESTION,
  UPDATE_QUIZ,
} from '../use-cases/tokens';
import type {
  CreateQuestionUseCase,
  CreateQuizSessionUseCase,
  CreateQuizUseCase,
  DeleteQuestionUseCase,
  DeleteQuizUseCase,
  GetQuizDetailUseCase,
  GetQuizSessionResultUseCase,
  GetQuizSessionUseCase,
  JoinQuizSessionUseCase,
  SearchQuizzesUseCase,
  SubmitQuizSessionAnswerUseCase,
  UpdateQuestionUseCase,
  UpdateQuizUseCase,
} from '../use-cases';
import type {
  CreateQuestionInput,
  CreateQuizInput,
  CreateQuizSessionInput,
  JoinQuizSessionInput,
  QuizSessionAnswerSubmissionResult,
  QuizDetail,
  QuizQuestion,
  QuizSessionDetail,
  QuizSessionResult,
  SearchQuizzesInput,
  SearchQuizzesResult,
  SubmitQuizSessionAnswerInput,
  UpdateQuestionInput,
  UpdateQuizInput,
} from '../domain/entities';

@Injectable()
export class QuizService {
  constructor(
    @Inject(SEARCH_QUIZZES)
    private readonly searchQuizzesUseCase: SearchQuizzesUseCase,
    @Inject(GET_QUIZ_DETAIL)
    private readonly getQuizDetailUseCase: GetQuizDetailUseCase,
    @Inject(CREATE_QUIZ)
    private readonly createQuizUseCase: CreateQuizUseCase,
    @Inject(UPDATE_QUIZ)
    private readonly updateQuizUseCase: UpdateQuizUseCase,
    @Inject(DELETE_QUIZ)
    private readonly deleteQuizUseCase: DeleteQuizUseCase,
    @Inject(CREATE_QUESTION)
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    @Inject(UPDATE_QUESTION)
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    @Inject(DELETE_QUESTION)
    private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
    @Inject(CREATE_QUIZ_SESSION)
    private readonly createQuizSessionUseCase: CreateQuizSessionUseCase,
    @Inject(JOIN_QUIZ_SESSION)
    private readonly joinQuizSessionUseCase: JoinQuizSessionUseCase,
    @Inject(GET_QUIZ_SESSION)
    private readonly getQuizSessionUseCase: GetQuizSessionUseCase,
    @Inject(SUBMIT_QUIZ_SESSION_ANSWER)
    private readonly submitQuizSessionAnswerUseCase: SubmitQuizSessionAnswerUseCase,
    @Inject(GET_QUIZ_SESSION_RESULT)
    private readonly getQuizSessionResultUseCase: GetQuizSessionResultUseCase,
  ) {}

  searchQuizzes(input: SearchQuizzesInput): Promise<SearchQuizzesResult> {
    return this.searchQuizzesUseCase.execute(input);
  }

  getQuizDetail(quizId: string): Promise<QuizDetail> {
    return this.getQuizDetailUseCase.execute(quizId);
  }

  createQuiz(
    input: CreateQuizInput,
    actorUserId: string | null,
  ): Promise<QuizDetail> {
    return this.createQuizUseCase.execute(input, actorUserId);
  }

  updateQuiz(
    quizId: string,
    input: UpdateQuizInput,
    actorUserId: string | null,
  ): Promise<QuizDetail> {
    return this.updateQuizUseCase.execute(quizId, input, actorUserId);
  }

  deleteQuiz(quizId: string, actorUserId: string | null): Promise<void> {
    return this.deleteQuizUseCase.execute(quizId, actorUserId);
  }

  createQuestion(
    quizId: string,
    input: CreateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion> {
    return this.createQuestionUseCase.execute(quizId, input, actorUserId);
  }

  updateQuestion(
    quizId: string,
    questionId: string,
    input: UpdateQuestionInput,
    actorUserId: string | null,
  ): Promise<QuizQuestion> {
    return this.updateQuestionUseCase.execute(
      quizId,
      questionId,
      input,
      actorUserId,
    );
  }

  deleteQuestion(
    quizId: string,
    questionId: string,
    actorUserId: string | null,
  ): Promise<void> {
    return this.deleteQuestionUseCase.execute(quizId, questionId, actorUserId);
  }

  createQuizSession(
    quizId: string,
    input: CreateQuizSessionInput,
  ): Promise<QuizSessionDetail> {
    return this.createQuizSessionUseCase.execute(quizId, input);
  }

  joinQuizSession(
    joinCode: string,
    input: JoinQuizSessionInput,
  ): Promise<QuizSessionDetail> {
    return this.joinQuizSessionUseCase.execute(joinCode, input);
  }

  getQuizSession(sessionId: string): Promise<QuizSessionDetail> {
    return this.getQuizSessionUseCase.execute(sessionId);
  }

  submitQuizSessionAnswer(
    sessionId: string,
    input: SubmitQuizSessionAnswerInput,
  ): Promise<QuizSessionAnswerSubmissionResult> {
    return this.submitQuizSessionAnswerUseCase.execute(sessionId, input);
  }

  getQuizSessionResult(sessionId: string): Promise<QuizSessionResult> {
    return this.getQuizSessionResultUseCase.execute(sessionId);
  }

}
