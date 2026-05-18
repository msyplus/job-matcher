import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('work_experiences')
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.workExperiences)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  endDate: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Project, (p) => p.workExperience)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;
}
