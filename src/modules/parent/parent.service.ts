import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Child } from '../../entities/child.entity';
import { Parent } from '../../entities/parent.entity';
import { Survey } from 'src/entities/survey.entity';
import { Result } from 'src/entities/result.entity';
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

  async getMostRecentChildIdForParent(parentId: number): Promise<number | null> {
    console.log(parentId);
    // Child 테이블에서 해당 parentId를 갖는 모든 child id를 가져오기
    const children = await this.childRepository.find({ where: { parent: { id: parentId } } });
    console.log(children);
    if (children.length === 0) {
      return null; // 자식이 없으면 null 반환
    }
    console.log(children);
    // 모든 child id 추출
    const childIds = children.map(child => child.id);
    console.log(childIds);
    // Answer 테이블에서 해당 child id들 중 가장 최근에 추가된 데이터를 찾기
    const recentAnswer = await this.answerRepository.findOne({
      where: { child: { id: In(childIds) } },
      order: { createdAt: 'DESC' }, // 가장 최근에 추가된 데이터 기준으로 정렬
    });
    console.log(recentAnswer);
    return recentAnswer ? recentAnswer.child.id : null; // 최근 데이터가 있으면 child id 반환, 없으면 null
  }
}
