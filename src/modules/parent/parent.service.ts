import { Injectable,NotFoundException,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../../entities/child.entity';
import { Parent } from '../../entities/parent.entity';
import { Survey } from 'src/entities/survey.entity';
import { Result } from 'src/entities/result.entity';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private jwtService: JwtService,
  ) {}

  async registerChild(
    parentId: number,
    name: string,
    age: number,
    gender: string,
  ): Promise<string> {
    const parent = await this.parentRepository.findOne({ where: { id: parentId } });
    if (!parent) {
        throw new NotFoundException('Parent not found');
    }
    const childCode = this.generateSixDigitCode(); // 6자리 숫자 코드 생성
    const newChild = this.childRepository.create({
      name,
      email: parent.email,
      age,
      gender,
      parent: { id: parentId },
      code: childCode,
    });

    await this.childRepository.save(newChild);
    return childCode;
  }

  private generateSixDigitCode(): string {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  async getChildList(parentId: number): Promise<Child[]> {
    return this.childRepository.find({ where: { parent: { id: parentId } } });
  }

  // 자식 정보와 result 리스트를 가져오는 메서드
  async getChildDetails(childId: number) {
    // 아이 정보 가져오기
    const child = await this.childRepository.findOne({ where: { id: childId } });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    // Survey 테이블에서 아이의 surveyId 가져오기
    const surveys = await this.surveyRepository.find({ where: { child: { id: childId } } });

    // 각 Survey에 대해 result 정보 가져오기
    const resultList = await Promise.all(
      surveys.map(async (survey) => {
        const result = await this.resultRepository.findOne({ where: { survey: { id: survey.id } } });
        return {
          surveyId: survey.id,
          resultCode: result?.point || null,
        };
      })
    );

    // 응답 데이터 구성
    return {
      id: child.id,
      name: child.name,
      age: child.age,
      gender: child.gender,
      resultList: resultList,
    };
  }

  async validateChildOwnership(childId: number, parentId: number): Promise<void> {
    const child = await this.childRepository.findOne({ where: { id: childId, parent: { id: parentId } } });
    if (!child) {
      throw new UnauthorizedException('You do not have access to this child\'s survey details.');
    }
  }

  async getSurveyDetailsForChild(childId: number): Promise<any> {
    // Survey 테이블에서 해당 childId를 갖는 모든 survey를 가져옵니다.
    const surveys = await this.surveyRepository.find({ where: { child: { id: childId } } });

    if (!surveys.length) {
      throw new NotFoundException('No surveys found for this child.');
    }

    const surveyDetails = await Promise.all(
      surveys.map(async (survey) => {
        // Result 테이블에서 해당 surveyId와 연결된 모든 결과를 가져옵니다.
        const results = await this.resultRepository.find({ where: { survey: { id: survey.id } } });
        
        // 각 결과에 대해 필요한 데이터를 리스트로 만듭니다.
        const resultList = results.map(result => ({
            totalPoint: (result.point ?? 0).toString(),
            createdAt: result.createdAt,
            doneAt: result.doneAt,
            status: result.status,
            progress: result.progress,
        }));

        return {
            surveyId: survey.id,
            results: resultList
        };
        })
    );

    return surveyDetails;
  }

  async getChildIdBySurveyId(surveyId: number): Promise<number> {
    const survey = await this.surveyRepository.findOne({ where: { id: surveyId }, relations: ['child'] });

    if (!survey || !survey.child) {
      throw new NotFoundException('Survey or Child not found');
    }

    return survey.child.id;
  }

  async getSurveyAnswers(surveyId: number): Promise<any> {
    // Survey에 연결된 질문들을 가져옵니다.
    const questions = await this.questionRepository.find({ where: { survey: { id: surveyId } } });

    // 각 질문에 대해 답변을 찾고, 답변 리스트를 구성합니다.
    const answerList = await Promise.all(
      questions.map(async (question) => {
        const answer = await this.answerRepository.findOne({ where: { question: { id: question.id } } });

        return {
          surveyId: surveyId,
          question: question.question,
          answer: answer ? answer.answer : null,
        };
      })
    );

    return answerList;
  }

}
