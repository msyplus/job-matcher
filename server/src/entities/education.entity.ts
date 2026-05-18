import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.educations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  school: string;

  @Column()
  major: string;

  @Column()
  degree: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
