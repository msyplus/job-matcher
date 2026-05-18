import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRecommendService } from './job-recommend.service';
import { JobRecommendController } from './job-recommend.controller';
import { RecommendedJob } from '../../entities/recommended-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendedJob])],
  controllers: [JobRecommendController],
  providers: [JobRecommendService],
  exports: [JobRecommendService],
})
export class JobRecommendModule {}
