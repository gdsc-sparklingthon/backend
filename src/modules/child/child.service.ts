import { Injectable } from '@nestjs/common';
import { PostAnswerResponse } from './dto/response/post-answer.response';
import { GetQuestionResponse } from './dto/response/get-question.response';
import { GptService } from '../gpt/gpt.service';
import { PostAnswerRequest } from './dto/request/post-answer.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { Repository } from 'typeorm';
import { Survey } from '../../entities/survey.entity';
import { Question } from '../../entities/question.entity';
import { Template } from '../../entities/template.entity';
import { Child } from '../../entities/child.entity';
import { Result } from '../../entities/result.entity';

@Injectable()
export class ChildService {
  constructor(
    private readonly gptService: GptService,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Survey)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Survey)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  async getFirstResponse(childId: number): Promise<GetQuestionResponse> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    const firstQuestion = await this.gptService.getFirstResponse(child.name);
    return { question: firstQuestion };
  }

  async postAnswerRequest(
    questionId: number,
    postAnswerRequest: PostAnswerRequest,
  ): Promise<PostAnswerResponse> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    const point = await this.gptService.getPoint(
      question.question,
      postAnswerRequest.answer,
    );

    await this.answerRepository.save({
      point: Number(point),
      answer: postAnswerRequest.answer,
      createdAt: new Date(),
      question: question,
    });

    if (question.template.id < 27) {
      const nextTemplate = await this.templateRepository.findOne({
        where: { id: question.template.id + 1 },
      });
      const nextQuestion = await this.questionRepository.save({
        question: nextTemplate.content,
      });
      return {
        point: Number(point),
        question: nextTemplate.content,
        questionId: nextQuestion.id,
      };
    }

    const answers = await this.answerRepository.findBy({
      question,
    });

    const totalSum = answers.reduce((sum, answer) => sum + answer.point, 0);

    let result: string;

    if (totalSum < 22) {
      result = '정상';
    } else if (totalSum < 26) {
      result = '약간 우을 상태';
    } else if (totalSum < 29) {
      result = '상당한 우울 상태';
    } else {
      result = '매우 심한 우울 상태';
    }
    await this.resultRepository.save({
      point: totalSum,
      result,
      createdAt: new Date(),
      doneAt: new Date(),
      status: 'DONE',
      progress: 100,
      survey: question.survey,
    });

    const firstTemplate = await this.templateRepository.findOne({
      where: { id: 1 },
    });
    const nextQuestion = await this.questionRepository.save({
      question: firstTemplate.content,
    });
    return {
      point: Number(point),
      question: firstTemplate.content,
      questionId: nextQuestion.id,
    };
  }
}
