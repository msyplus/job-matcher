import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkExperience } from './work-experience.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workExperienceId: string;

  @ManyToOne(() => WorkExperience, (w) => w.projects)
  @JoinColumn({ name: 'workExperienceId' })
  workExperience: WorkExperience;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  techStack: string[];

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @CreateDateColumn()
  createdAt: Date;
}
