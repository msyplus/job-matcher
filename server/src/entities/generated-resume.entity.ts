import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JobDescription } from './job-description.entity';

@Entity('generated_resumes')
export class GeneratedResume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  jdId: string;

  @ManyToOne(() => JobDescription, { nullable: true })
  @JoinColumn({ name: 'jdId' })
  jobDescription: JobDescription;

  @Column({ default: 'classic' })
  template: string;

  @Column({ type: 'simple-json' })
  content: {
    sections?: Array<{
      type: string;
      title: string;
      locked: boolean;
      body: string;
    }>;
    matchScore?: number;
    jdKeywords?: string[];
  };

  @Column({ nullable: true })
  pdfPath: string;

  @Column({ default: 'draft' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
