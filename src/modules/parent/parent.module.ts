import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { Parent } from '../../entities/parent.entity';
import { Child } from '../../entities/child.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parent, Child]),
    AuthModule,
  ],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
