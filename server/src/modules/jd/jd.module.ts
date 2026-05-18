import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JdService } from './jd.service';
import { JdController } from './jd.controller';
import { JobDescription } from '../../entities/job-description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobDescription])],
  controllers: [JdController],
  providers: [JdService],
})
export class JdModule {}
