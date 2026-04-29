import { Module } from '@nestjs/common';
import { AdminQuizController } from './admin-quiz.controller';
import { QuizController } from './quiz.controller';
import { QuizService } from './interfaces/quiz.service';

@Module({
  controllers: [QuizController, AdminQuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
