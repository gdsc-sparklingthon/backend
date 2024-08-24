import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../../entities/child.entity';
import { Parent } from '../../entities/parent.entity';
import { Survey } from 'src/entities/survey.entity';
import { Result } from 'src/entities/result.entity';
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
}
