import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('recommended_jobs')
export class RecommendedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @Column({ default: 'boss' })
  sourcePlatform: string;

  @Column({ default: 0 })
  matchScore: number;

  @Column({ type: 'simple-json', nullable: true })
  matchDetails: any;

  @Column({ default: 'new' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
