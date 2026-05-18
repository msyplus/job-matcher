import { DataSource } from 'typeorm';
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

export async function initializeDatabase() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.resolve(process.env.DB_PATH || './data/jobmatcher.db'),
    entities: [
      User, Education, WorkExperience, Project, Skill,
      Certificate, JobDescription, GeneratedResume, Application,
    ],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  await dataSource.destroy();
  console.log('Database initialized successfully');
}

// Run directly
initializeDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Database init failed:', err.message);
    process.exit(1);
  });
