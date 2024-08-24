import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Survey } from './survey.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  point: string;

  @Column()
  createdAt: Date;

  @Column()
  doneAt: Date;

  @Column()
  status: string;

  @Column()
  progress: number;

  @OneToOne(() => Survey, (survey) => survey.result)
  survey: Survey;
}
