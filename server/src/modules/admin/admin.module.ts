import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../../entities/user.entity';
import { Feedback } from '../../entities/feedback.entity';
import { Application } from '../../entities/application.entity';
import { GeneratedResume } from '../../entities/generated-resume.entity';
import { JobDescription } from '../../entities/job-description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Feedback, Application, GeneratedResume, JobDescription])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
