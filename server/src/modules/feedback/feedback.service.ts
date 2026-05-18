import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../../entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
  ) {}

  async create(dto: { type: string; content: string; contact?: string }, userId?: string) {
    return this.feedbackRepo.save(this.feedbackRepo.create({ ...dto, userId }));
  }

  async getAll(page = 1, limit = 20) {
    const [items, total] = await this.feedbackRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, status: string, adminNote?: string) {
    const fb = await this.feedbackRepo.findOne({ where: { id } });
    if (!fb) throw new NotFoundException('反馈不存在');
    fb.status = status;
    if (adminNote) fb.adminNote = adminNote;
    return this.feedbackRepo.save(fb);
  }
}
