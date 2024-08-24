import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../../entities/child.entity';
import { Parent } from '../../entities/parent.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    private jwtService: JwtService,
  ) {}

  async registerChild(
    parentId: number,
    name: string,
    age: number,
    gender: string,
  ): Promise<string> {
    const childCode = this.generateSixDigitCode(); // 6자리 숫자 코드 생성
    const newChild = this.childRepository.create({
      name,
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
}
