import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobDescription } from '../../entities/job-description.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class JdService {
  constructor(
    @InjectRepository(JobDescription)
    private jdRepo: Repository<JobDescription>,
    private aiService: AiService,
  ) {}

  async getAll(userId: string) {
    return this.jdRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async create(userId: string, dto: { rawText: string; sourceUrl?: string }) {
    return this.jdRepo.save(this.jdRepo.create({ ...dto, userId }));
  }

  async parse(id: string, userId: string) {
    const jd = await this.jdRepo.findOne({ where: { id, userId } });
    if (!jd) throw new NotFoundException('JD 不存在');

    const parsedResult = await this.aiService.parseJD(jd.rawText);
    jd.parsedResult = parsedResult;
    return this.jdRepo.save(jd);
  }

  async delete(id: string, userId: string) {
    const jd = await this.jdRepo.findOne({ where: { id, userId } });
    if (!jd) throw new NotFoundException('JD 不存在');
    return this.jdRepo.remove(jd);
  }
}
