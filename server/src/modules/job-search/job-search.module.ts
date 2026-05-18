import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSearchService } from './job-search.service';
import { JobSearchController } from './job-search.controller';
import { JobRecommendModule } from '../job-recommend/job-recommend.module';
import { Skill } from '../../entities/skill.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Education } from '../../entities/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, WorkExperience, Education]), JobRecommendModule],
  controllers: [JobSearchController],
  providers: [JobSearchService],
})
export class JobSearchModule {}
