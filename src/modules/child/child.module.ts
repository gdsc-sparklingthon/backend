import { Global, Module } from '@nestjs/common';
import { GptService } from '../gpt/gpt.service';
import { ChildService } from './child.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { Template } from '../../entities/template.entity';
import { Child } from '../../entities/child.entity';
import { Result } from '../../entities/result.entity';
import OpenAI from 'openai';
import { ChildController } from './child.controller';
import { Survey } from '../../entities/survey.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Answer,
      Question,
      Template,
      Child,
      Result,
      Survey,
    ]),
  ],
  providers: [ChildService, GptService, OpenAI],
  controllers: [ChildController],
  exports: [],
})
export class ChildModule {}
