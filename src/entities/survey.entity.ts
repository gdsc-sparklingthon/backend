import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Child } from './child.entity';
import { Result } from './result.entity';
import { Question } from './question.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Child, (child) => child.surveys)
  child: Child;

  @OneToOne(() => Result, (result) => result.survey)
  result: Result;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];
}
