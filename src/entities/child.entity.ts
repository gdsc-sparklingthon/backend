import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parent } from './parent.entity';
import { Survey } from './survey.entity';
import { Answer } from './answer.entity';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent: Parent;

  @OneToMany(() => Survey, (survey) => survey.child)
  surveys: Survey[];

  @OneToMany(() => Answer, (survey) => survey.answer)
  answers: Answer[];
}
