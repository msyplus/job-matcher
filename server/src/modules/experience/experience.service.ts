import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../../entities/education.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Project } from '../../entities/project.entity';
import { Skill } from '../../entities/skill.entity';
import { Certificate } from '../../entities/certificate.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Education) private eduRepo: Repository<Education>,
    @InjectRepository(WorkExperience) private workRepo: Repository<WorkExperience>,
    @InjectRepository(Project) private projRepo: Repository<Project>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
    @InjectRepository(Certificate) private certRepo: Repository<Certificate>,
  ) {}

  // Education
  async getEducations(userId: string) { return this.eduRepo.find({ where: { userId } }); }
  async createEducation(userId: string, dto: Partial<Education>) {
    return this.eduRepo.save(this.eduRepo.create({ ...dto, userId }));
  }
  async updateEducation(id: string, userId: string, dto: Partial<Education>) {
    const item = await this.eduRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('教育经历不存在');
    return this.eduRepo.save({ ...item, ...dto });
  }
  async deleteEducation(id: string, userId: string) {
    const item = await this.eduRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('教育经历不存在');
    return this.eduRepo.remove(item);
  }

  // Work Experience
  async getWorkExperiences(userId: string) {
    return this.workRepo.find({ where: { userId }, relations: ['projects'] });
  }
  async createWorkExperience(userId: string, dto: Partial<WorkExperience>) {
    return this.workRepo.save(this.workRepo.create({ ...dto, userId }));
  }
  async updateWorkExperience(id: string, userId: string, dto: Partial<WorkExperience>) {
    const item = await this.workRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('工作经历不存在');
    return this.workRepo.save({ ...item, ...dto });
  }
  async deleteWorkExperience(id: string, userId: string) {
    const item = await this.workRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('工作经历不存在');
    return this.workRepo.remove(item);
  }

  // Projects
  async getProjects(workExperienceId: string) {
    return this.projRepo.find({ where: { workExperienceId } });
  }
  async createProject(workExperienceId: string, dto: Partial<Project>) {
    return this.projRepo.save(this.projRepo.create({ ...dto, workExperienceId }));
  }
  async updateProject(id: string, dto: Partial<Project>) {
    const item = await this.projRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('项目不存在');
    return this.projRepo.save({ ...item, ...dto });
  }
  async deleteProject(id: string) {
    const item = await this.projRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('项目不存在');
    return this.projRepo.remove(item);
  }

  // Skills
  async getSkills(userId: string) { return this.skillRepo.find({ where: { userId } }); }
  async createSkill(userId: string, dto: Partial<Skill>) {
    return this.skillRepo.save(this.skillRepo.create({ ...dto, userId }));
  }
  async updateSkill(id: string, userId: string, dto: Partial<Skill>) {
    const item = await this.skillRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('技能不存在');
    return this.skillRepo.save({ ...item, ...dto });
  }
  async deleteSkill(id: string, userId: string) {
    const item = await this.skillRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('技能不存在');
    return this.skillRepo.remove(item);
  }

  // Certificates
  async getCertificates(userId: string) { return this.certRepo.find({ where: { userId } }); }
  async createCertificate(userId: string, dto: Partial<Certificate>) {
    return this.certRepo.save(this.certRepo.create({ ...dto, userId }));
  }
  async updateCertificate(id: string, userId: string, dto: Partial<Certificate>) {
    const item = await this.certRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('证书不存在');
    return this.certRepo.save({ ...item, ...dto });
  }
  async deleteCertificate(id: string, userId: string) {
    const item = await this.certRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('证书不存在');
    return this.certRepo.remove(item);
  }
}
