import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendedJob } from '../../entities/recommended-job.entity';

@Injectable()
export class JobRecommendService {
  constructor(
    @InjectRepository(RecommendedJob)
    private recRepo: Repository<RecommendedJob>,
  ) {}

  async getFeed(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.recRepo.findAndCount({
      where: { userId },
      order: { matchScore: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async saveRecommendations(userId: string, jobs: Array<{
    title: string; company: string; location?: string; salary?: string;
    description?: string; sourceUrl?: string; sourcePlatform?: string;
    matchScore: number; matchDetails?: any;
  }>) {
    const entities = jobs.map((j) =>
      this.recRepo.create({ ...j, userId, status: 'new' }),
    );
    return this.recRepo.save(entities);
  }

  async updateStatus(id: string, userId: string, status: string) {
    const job = await this.recRepo.findOne({ where: { id, userId } });
    if (!job) return null;
    job.status = status;
    return this.recRepo.save(job);
  }
}
