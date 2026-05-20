import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { ResumeParserService } from './resume-parser.service';
import { Education } from '../../entities/education.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Project } from '../../entities/project.entity';
import { Skill } from '../../entities/skill.entity';
import { Certificate } from '../../entities/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, WorkExperience, Project, Skill, Certificate])],
  controllers: [ExperienceController],
  providers: [ExperienceService, ResumeParserService],
})
export class ExperienceModule {}
