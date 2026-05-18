import { Injectable } from '@nestjs/common';
import { searchBoss, JobListing } from './adapters/boss.adapter';
import { AiService } from '../ai/ai.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill.entity';
import { WorkExperience } from '../../entities/work-experience.entity';
import { Education } from '../../entities/education.entity';

@Injectable()
export class JobSearchService {
  constructor(
    private aiService: AiService,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
    @InjectRepository(WorkExperience) private workRepo: Repository<WorkExperience>,
    @InjectRepository(Education) private eduRepo: Repository<Education>,
  ) {}

  async search(keyword: string, location?: string, limit = 20) {
    const jobs = await searchBoss(keyword, location, limit);
    return jobs;
  }

  async searchAndMatch(userId: string, keyword: string, location?: string, limit = 20) {
    const jobs = await this.search(keyword, location, limit);

    // Get user profile for matching
    const [skills, works, educations] = await Promise.all([
      this.skillRepo.find({ where: { userId } }),
      this.workRepo.find({ where: { userId } }),
      this.eduRepo.find({ where: { userId } }),
    ]);

    const userSkills = skills.map((s) => s.name);
    const userYears = works.reduce((sum, w) => {
      const start = parseInt(w.startDate);
      const end = parseInt(w.endDate || String(new Date().getFullYear()));
      return sum + (isNaN(end - start) ? 0 : end - start);
    }, 0);

    // Score each job
    const scored = jobs.map((job) => {
      let score = 0;
      const matchedSkills: string[] = [];
      const unmatchedSkills: string[] = [];

      // Skill matching
      const jdText = `${job.title} ${job.description}`.toLowerCase();
      for (const skill of userSkills) {
        if (jdText.includes(skill.toLowerCase())) {
          score += 20;
          matchedSkills.push(skill);
        }
      }

      // Experience matching
      const yearMatch = jdText.match(/(\d+)[\s-]*年/);
      if (yearMatch && userYears >= parseInt(yearMatch[1])) {
        score += 15;
      }

      // Education matching
      for (const edu of educations) {
        if (jdText.includes(edu.degree.toLowerCase()) || jdText.includes(edu.major.toLowerCase())) {
          score += 10;
          break;
        }
      }

      // Keyword bonus
      const keywords = ['react', 'vue', 'angular', 'java', 'python', 'node', 'golang', 'rust', 'mysql', 'redis',
        'kafka', 'docker', 'kubernetes', 'aws', '微服务', '高并发', '架构', '团队管理', '全栈'];
      for (const kw of keywords) {
        if (jdText.includes(kw.toLowerCase()) && userSkills.some((s) => s.toLowerCase().includes(kw.toLowerCase()))) {
          score += 5;
        }
      }

      return {
        ...job,
        matchScore: Math.min(score, 95),
        matchDetails: { matchedSkills, unmatchedSkills, userYears },
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  }

  async parseAndMatch(userId: string, rawText: string) {
    // Parse JD with AI
    let parsedResult: any = {};
    try {
      parsedResult = await this.aiService.parseJD(rawText);
    } catch (e) {
      parsedResult = { keywords: [] };
    }

    // Match against user profile
    const [skills, works, educations] = await Promise.all([
      this.skillRepo.find({ where: { userId } }),
      this.workRepo.find({ where: { userId } }),
      this.eduRepo.find({ where: { userId } }),
    ]);

    const userSkills = skills.map((s) => s.name);
    const userYears = works.reduce((sum, w) => {
      const start = parseInt(w.startDate);
      const end = parseInt(w.endDate || String(new Date().getFullYear()));
      return sum + (isNaN(end - start) ? 0 : end - start);
    }, 0);

    let score = 0;
    const matchedSkills: string[] = [];
    const jdText = rawText.toLowerCase();

    for (const skill of userSkills) {
      if (jdText.includes(skill.toLowerCase())) {
        score += 20;
        matchedSkills.push(skill);
      }
    }

    const yearMatch = jdText.match(/(\d+)[\s-]*年/);
    if (yearMatch && userYears >= parseInt(yearMatch[1])) {
      score += 15;
    }

    return {
      ...parsedResult,
      matchScore: Math.min(score + 10, 95),
      matchDetails: { matchedSkills, userYears },
    };
  }
}
