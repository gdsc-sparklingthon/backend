import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  point: string;

  @Column()
  answer: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
