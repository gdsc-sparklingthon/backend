import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from './survey.entity';
import { Template } from './template.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @ManyToOne(() => Template, (template) => template.questions)
  template: Template;

  @OneToOne(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
