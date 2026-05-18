import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { User } from '../entities/user.entity';
import { Education } from '../entities/education.entity';
import { WorkExperience } from '../entities/work-experience.entity';
import { Project } from '../entities/project.entity';
import { Skill } from '../entities/skill.entity';
import { Certificate } from '../entities/certificate.entity';
import { JobDescription } from '../entities/job-description.entity';
import { GeneratedResume } from '../entities/generated-resume.entity';
import { Application } from '../entities/application.entity';
import { Feedback } from '../entities/feedback.entity';
import { RecommendedJob } from '../entities/recommended-job.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqljs',
  autoSave: true,
  location: path.resolve(process.env.DB_PATH || './data/jobmatcher.db'),
  entities: [
    User, Education, WorkExperience, Project, Skill,
    Certificate, JobDescription, GeneratedResume, Application, Feedback, RecommendedJob,
  ],
  synchronize: false,
  logging: false,
};
