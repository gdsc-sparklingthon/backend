import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Answer } from './entities/answer.entity';
import { Template } from './entities/template.entity';
import { Survey } from './entities/survey.entity';
import { Result } from './entities/result.entity';
import { Question } from './entities/question.entity';
import { Parent } from './entities/parent.entity';
import { Child } from './entities/child.entity';
import { GptModule } from './modules/gpt/gpt.module';
import { GptController } from './modules/gpt/gpt.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ParentModule } from './modules/parent/parent.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChildModule } from './modules/child/child.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Answer, Child, Parent, Question, Result, Survey, Template],
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
    GptModule,
    AuthModule,
    ParentModule,
    ProfileModule,
    ChildModule,
  ],
  controllers: [AppController, GptController],
  providers: [AppService],
})
export class AppModule {}
