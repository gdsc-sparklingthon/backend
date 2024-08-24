import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parent } from './parent.entity';
import { Survey } from './survey.entity';

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
  age: string;

  @Column()
  gender: string;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent: Parent;

  @OneToMany(() => Survey, (survey) => survey.child)
  surveys: Survey[];
}
