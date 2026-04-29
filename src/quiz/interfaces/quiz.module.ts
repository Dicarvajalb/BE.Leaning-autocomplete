import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminQuizController } from '../admin-quiz.controller';
import { QuizController } from '../quiz.controller';
import { QuizGateway } from '../adapters/quiz.gateway';
import { PrismaQuizRepository } from '../adapters/prisma-quiz.repository';
import { QuizService } from './quiz.service';
import {
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
import { QUIZ_REPOSITORY } from '../ports/quiz.ports';

@Module({
  imports: [PrismaModule],
  controllers: [QuizController, AdminQuizController],
  providers: [
    PrismaQuizRepository,
    QuizGateway,
    {
      provide: QUIZ_REPOSITORY,
      useExisting: PrismaQuizRepository,
    },
    {
      provide: SEARCH_QUIZZES,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new SearchQuizzesUseCase(quizRepository),
    },
    {
      provide: GET_QUIZ_DETAIL,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new GetQuizDetailUseCase(quizRepository),
    },
    {
      provide: CREATE_QUIZ,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new CreateQuizUseCase(quizRepository),
    },
    {
      provide: UPDATE_QUIZ,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new UpdateQuizUseCase(quizRepository),
    },
    {
      provide: DELETE_QUIZ,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new DeleteQuizUseCase(quizRepository),
    },
    {
      provide: CREATE_QUESTION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new CreateQuestionUseCase(quizRepository),
    },
    {
      provide: UPDATE_QUESTION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new UpdateQuestionUseCase(quizRepository),
    },
    {
      provide: DELETE_QUESTION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new DeleteQuestionUseCase(quizRepository),
    },
    {
      provide: CREATE_QUIZ_SESSION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new CreateQuizSessionUseCase(quizRepository),
    },
    {
      provide: JOIN_QUIZ_SESSION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new JoinQuizSessionUseCase(quizRepository),
    },
    {
      provide: GET_QUIZ_SESSION,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new GetQuizSessionUseCase(quizRepository),
    },
    {
      provide: SUBMIT_QUIZ_SESSION_ANSWER,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new SubmitQuizSessionAnswerUseCase(quizRepository),
    },
    {
      provide: GET_QUIZ_SESSION_RESULT,
      inject: [QUIZ_REPOSITORY],
      useFactory: (quizRepository: PrismaQuizRepository) =>
        new GetQuizSessionResultUseCase(quizRepository),
    },
    QuizService,
  ],
  exports: [QuizService],
})
export class QuizModule {}
