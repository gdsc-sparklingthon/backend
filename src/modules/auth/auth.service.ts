import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../../entities/parent.entity';
import { Child } from '../../entities/child.entity';
import * as bcrypt from 'bcryptjs';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    private jwtService: JwtService,
  ) {}

  async validateParent(email: string, password: string): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ where: { email } });
    if (parent && (await bcrypt.compare(password, parent.password))) {
      return parent;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateChild(email: string, code: string): Promise<Child> {
    const child = await this.childRepository.findOne({ where: { email, code } });
    if (child) {
      return child;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(name: string, email: string, password: string): Promise<Parent> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.parentRepository.create({ name, email, password: hashedPassword });
    return this.parentRepository.save(newUser);
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { isParent, email, password, code } = loginRequest;
    let user: Parent | Child;

    if (isParent) {
      user = await this.validateParent(email, password);
    } else {
      user = await this.validateChild(email, code);
    }

    const payload = { email: user.email, sub: user.id, isParent };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
