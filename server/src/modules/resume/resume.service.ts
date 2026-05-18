import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneratedResume } from '../../entities/generated-resume.entity';
import { JobDescription } from '../../entities/job-description.entity';
import { Education } from '../../entities/education.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Skill } from '../../entities/skill.entity';
import { Certificate } from '../../entities/certificate.entity';
import { User } from '../../entities/user.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(GeneratedResume)
    private resumeRepo: Repository<GeneratedResume>,
    @InjectRepository(JobDescription)
    private jdRepo: Repository<JobDescription>,
    @InjectRepository(Education)
    private eduRepo: Repository<Education>,
    @InjectRepository(WorkExperience)
    private workRepo: Repository<WorkExperience>,
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    @InjectRepository(Certificate)
    private certRepo: Repository<Certificate>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private aiService: AiService,
  ) {}

  async getAll(userId: string) {
    return this.resumeRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async getById(id: string, userId: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    return resume;
  }

  async generate(userId: string, dto: { jdId?: string; template?: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const educations = await this.eduRepo.find({ where: { userId } });
    const works = await this.workRepo.find({ where: { userId }, relations: ['projects'] });
    const skills = await this.skillRepo.find({ where: { userId } });
    const certificates = await this.certRepo.find({ where: { userId } });

    let jdData = {};
    if (dto.jdId) {
      const jd = await this.jdRepo.findOne({ where: { id: dto.jdId, userId } });
      if (jd?.parsedResult) {
        jdData = jd.parsedResult;
      }
    }

    const experienceData = {
      name: user?.name || '',
      educations: educations.map((e) => `${e.school} | ${e.major} | ${e.degree} | ${e.startDate}-${e.endDate}`),
      workExperiences: works.map((w) =>
        `${w.company} | ${w.position} | ${w.startDate}-${w.endDate || '至今'}\n${w.description || ''}\n项目: ${(w.projects || []).map((p) => p.name + ': ' + p.description).join('; ')}`,
      ),
      projects: works.flatMap((w) =>
        (w.projects || []).map((p) => `${p.name} | ${p.role} | ${p.description} | 技术栈: ${(p.techStack || []).join(', ')} | ${p.achievements || ''}`),
      ),
      skills: skills.map((s) => `${s.name} (熟练度${s.proficiency}/5, ${s.years}年)`),
      certificates: certificates.map((c) => `${c.name} - ${c.issuer} (${c.date})`),
    };

    const generated = await this.aiService.generateResume(experienceData, jdData);

    const resume = this.resumeRepo.create({
      userId,
      jdId: dto.jdId,
      template: dto.template || 'classic',
      content: generated,
      status: 'draft',
    });
    return this.resumeRepo.save(resume);
  }

  async updateContent(id: string, userId: string, content: any) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    resume.content = content;
    return this.resumeRepo.save(resume);
  }

  async delete(id: string, userId: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    return this.resumeRepo.remove(resume);
  }

  async exportHtml(id: string, userId: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const sections = resume.content?.sections || [];
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>简历 - JobMatcher</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; padding: 40px 50px; color: #333; line-height: 1.8; max-width: 800px; margin: 0 auto; }
  h2 { font-size: 16px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; margin: 24px 0 12px; color: #4f46e5; }
  .section-body { white-space: pre-wrap; font-size: 14px; }
  @media print { body { padding: 20px 30px; } }
</style>
</head>
<body>
${sections.map((s: any) => `<h2>${s.title}</h2><div class="section-body">${s.body}</div>`).join('\n')}
</body>
</html>`;
    return html;
  }
}
