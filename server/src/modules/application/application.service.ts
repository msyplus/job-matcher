import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
  ) {}

  async getAll(userId: string) {
    return this.appRepo.find({ where: { userId }, order: { appliedAt: 'DESC' } });
  }

  async create(userId: string, dto: {
    resumeId?: string;
    platform: string;
    jobTitle: string;
    company: string;
    appliedAt?: string;
    notes?: string;
  }) {
    return this.appRepo.save(this.appRepo.create({
      ...dto,
      userId,
      appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : new Date(),
    }));
  }

  async updateStatus(id: string, userId: string, status: string) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    app.status = status;
    return this.appRepo.save(app);
  }

  async update(id: string, userId: string, dto: Partial<Application>) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    return this.appRepo.save({ ...app, ...dto });
  }

  async delete(id: string, userId: string) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    return this.appRepo.remove(app);
  }

  async getStats(userId: string) {
    const apps = await this.appRepo.find({ where: { userId } });
    const total = apps.length;
    const byStatus: Record<string, number> = {};
    apps.forEach((a) => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });
    return {
      total,
      viewed: byStatus['viewed'] || 0,
      screening: byStatus['screening'] || 0,
      interview: byStatus['interview'] || 0,
      offer: byStatus['offer'] || 0,
      rejected: byStatus['rejected'] || 0,
      interviewRate: total > 0 ? ((byStatus['interview'] || 0) / total * 100).toFixed(1) : '0',
    };
  }
}
