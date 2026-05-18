import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Feedback } from '../../entities/feedback.entity';
import { Application } from '../../entities/application.entity';
import { GeneratedResume } from '../../entities/generated-resume.entity';
import { JobDescription } from '../../entities/job-description.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Feedback) private feedbackRepo: Repository<Feedback>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
    @InjectRepository(GeneratedResume) private resumeRepo: Repository<GeneratedResume>,
    @InjectRepository(JobDescription) private jdRepo: Repository<JobDescription>,
  ) {}

  async getStats() {
    const [users, feedbacks, applications, resumes, jds] = await Promise.all([
      this.userRepo.count(),
      this.feedbackRepo.count(),
      this.appRepo.count(),
      this.resumeRepo.count(),
      this.jdRepo.count(),
    ]);

    const pendingFeedback = await this.feedbackRepo.count({ where: { status: 'pending' } });
    const feedbacksByType = await this.feedbackRepo
      .createQueryBuilder('f')
      .select('f.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('f.type')
      .getRawMany();

    return {
      users,
      feedbacks: { total: feedbacks, pending: pendingFeedback, byType: feedbacksByType },
      applications,
      resumes,
      jds,
    };
  }

  async getFeedbackList(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const [items, total] = await this.feedbackRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUsers(page = 1, limit = 20) {
    const [items, total] = await this.userRepo.findAndCount({
      select: ['id', 'email', 'name', 'city', 'jobStatus', 'createdAt'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }
}
