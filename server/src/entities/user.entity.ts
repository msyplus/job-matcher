import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Education } from './education.entity';
import { WorkExperience } from './work-experience.entity';
import { Skill } from './skill.entity';
import { Certificate } from './certificate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 'active' })
  jobStatus: string;

  @Column({ type: 'simple-json', nullable: true })
  preferences: {
    targetCities?: string[];
    expectedSalaryMin?: number;
    expectedIndustries?: string[];
    targetPositions?: string[];
  };

  @OneToMany(() => Education, (e) => e.user)
  educations: Education[];

  @OneToMany(() => WorkExperience, (w) => w.user)
  workExperiences: WorkExperience[];

  @OneToMany(() => Skill, (s) => s.user)
  skills: Skill[];

  @OneToMany(() => Certificate, (c) => c.user)
  certificates: Certificate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
