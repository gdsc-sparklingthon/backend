import { Injectable } from '@nestjs/common';
import { PostAnswerResponse } from './dto/response/post-answer.response';
import { GetQuestionResponse } from './dto/response/get-question.response';
import { GptService } from '../gpt/gpt.service';
import { PostAnswerRequest } from './dto/request/post-answer.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { Template } from '../../entities/template.entity';
import { Child } from '../../entities/child.entity';
import { Result } from '../../entities/result.entity';
import { Survey } from '../../entities/survey.entity';

@Injectable()
export class ChildService {
  constructor(
    private readonly gptService: GptService,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async getFirstResponse(childId: number): Promise<GetQuestionResponse> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    const firstQuestion = await this.gptService.getFirstResponse(child.name);

    const survey = await this.surveyRepository.findOne({
      where: { child },
      order: {
        createdAt: 'DESC',
      },
    });

    if (survey == null) {
      const result = await this.resultRepository.save({
        status: 'NOT_DONE',
      });

      const survey = await this.surveyRepository.save({
        child,
        result,
      });

      const nextTemplate = await this.templateRepository.findOne({
        where: { id: 1 },
      });

      const nextQuestion = await this.questionRepository.save({
        question: nextTemplate.content,
        template: nextTemplate,
        survey,
      });

      return {
        question: firstQuestion,
        nextQuestionId: nextQuestion.id,
      };
    }

    const answer = await this.answerRepository.findOneBy({ child });

    if (answer != null) {
      const nextTemplate = await this.templateRepository.findOne({
        where: { id: answer.question.template.id + 1 },
      });

      const nextQuestion = await this.questionRepository.save({
        question: nextTemplate.content,
        survey,
      });
      return {
        question: firstQuestion,
        nextQuestionId: nextQuestion.id,
      };
    }

    const nextTemplate = await this.templateRepository.findOne({
      where: { id: 1 },
    });

    const nextQuestion = await this.questionRepository.save({
      question: nextTemplate.content,
      template: nextTemplate,
      survey,
    });

    return {
      question: firstQuestion,
      nextQuestionId: nextQuestion.id,
    };
  }

  async postAnswerRequest(
    childId: number,
    questionId: number,
    postAnswerRequest: PostAnswerRequest,
  ): Promise<PostAnswerResponse> {
    const randomValue = Math.random();

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['template', 'survey', 'answers'],
    });

    if (postAnswerRequest.isFirst) {
      const nextTemplateId = question.template.id + 1;
      const nextTemplate = await this.templateRepository.findOne({
        where: { id: nextTemplateId },
      });
      const nextQuestion = await this.questionRepository.save({
        question: nextTemplate.content,
        survey: question.survey,
        template: nextTemplate,
      });

      return {
        question: nextTemplate.content,
        questionId: nextQuestion.id,
      };
    }

    const survey = await this.surveyRepository.findOne({
      where: { id: question.survey.id },
      relations: ['result'],
    });

    const point = await this.gptService.getPoint(
      question.question,
      postAnswerRequest.answer,
    );

    const child = await this.childRepository.findOneBy({
      id: 1,
    });

    await this.answerRepository.save({
      point: Number(point),
      answer: postAnswerRequest.answer,
      question: question,
      child,
    });

    survey.result.point += Number(point);
    survey.result.progress += (question.template.id / 27) * 100;

    await this.surveyRepository.save(survey);

    if (question.template.id < 26) {
      const nextTemplate = await this.templateRepository.findOne({
        where: { id: question.template.id + 1 },
      });
      const nextQuestion = await this.questionRepository.save({
        question: nextTemplate.content,
        survey,
        template: nextTemplate,
      });

      if (randomValue < 0.7) {
        const response = await this.gptService.getResponse(
          postAnswerRequest.answer,
        );
        return { question: response, questionId: nextQuestion.id };
      }

      return {
        point: Number(point),
        question: nextTemplate.content,
        questionId: nextQuestion.id,
      };
    }

    const answers = await this.answerRepository.findBy({
      child,
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

    await this.resultRepository.update(
      { id: survey.result.id },
      {
        point: totalSum,
        result,
        createdAt: new Date(),
        doneAt: new Date(),
        status: 'DONE',
        progress: 100,
        survey: question.survey,
      },
    );

    const firstTemplate = await this.templateRepository.findOne({
      where: { id: 1 },
    });
    const nextQuestion = await this.questionRepository.save({
      question: firstTemplate.content,
      survey,
    });

    return {
      point: Number(point),
      question: firstTemplate.content,
      questionId: nextQuestion.id,
    };
  }
}
