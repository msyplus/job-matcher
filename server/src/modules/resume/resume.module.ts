import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { GeneratedResume } from '../../entities/generated-resume.entity';
import { JobDescription } from '../../entities/job-description.entity';
import { Education } from '../../entities/education.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Skill } from '../../entities/skill.entity';
import { Certificate } from '../../entities/certificate.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    GeneratedResume, JobDescription, Education,
    WorkExperience, Skill, Certificate, User,
  ])],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
