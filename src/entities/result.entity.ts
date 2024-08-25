import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from './survey.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  result: string;

  @Column({ default: 0 })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  doneAt: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  progress: number;

  @OneToOne(() => Survey, (survey) => survey.result)
  @JoinColumn()
  survey: Survey;
}
