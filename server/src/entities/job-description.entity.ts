import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('job_descriptions')
export class JobDescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  rawText: string;

  @Column({ type: 'simple-json', nullable: true })
  parsedResult: {
    position?: string;
    company?: string;
    location?: string;
    salaryRange?: string;
    requiredSkills?: string[];
    preferredSkills?: string[];
    education?: string;
    yearsRequired?: string;
    keywords?: string[];
  };

  @Column({ nullable: true })
  sourceUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
