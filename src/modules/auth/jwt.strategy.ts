import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../../entities/parent.entity';
import { Child } from '../../entities/child.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { email, sub, isParent } = payload;

    let user;

    if (isParent) {
      user = await this.parentRepository.findOne({ where: { email, id: sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid parent credentials');
      }
    } else {
      user = await this.childRepository.findOne({ where: { email, id: sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid child credentials');
      }
    }

    return { userId: user.id, email: user.email, isParent };
  }
}
