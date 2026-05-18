import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { InitDbService } from './database/init-db.service';
import { AuthModule } from './modules/auth/auth.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { JdModule } from './modules/jd/jd.module';
import { ResumeModule } from './modules/resume/resume.module';
import { ApplicationModule } from './modules/application/application.module';
import { AiModule } from './modules/ai/ai.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ExperienceModule,
    JdModule,
    ResumeModule,
    ApplicationModule,
    AiModule,
    FeedbackModule,
    AdminModule,
  ],
  providers: [InitDbService],
})
export class AppModule {}
