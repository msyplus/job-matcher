import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { GeneratedResume } from './generated-resume.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  resumeId: string;

  @ManyToOne(() => GeneratedResume, { nullable: true })
  @JoinColumn({ name: 'resumeId' })
  resume: GeneratedResume;

  @Column()
  platform: string;

  @Column()
  jobTitle: string;

  @Column()
  company: string;

  @Column({ default: 'applied' })
  status: string;

  @Column()
  appliedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
