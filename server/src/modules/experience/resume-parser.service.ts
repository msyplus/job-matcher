import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ExperienceService } from './experience.service';

@Injectable()
export class ResumeParserService {
  constructor(
    private aiService: AiService,
    private experienceService: ExperienceService,
  ) {}

  async parse(buffer: Buffer, filename: string) {
    let text = '';
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (ext === 'pdf') {
      try {
        const pdfModule: any = await import('pdf-parse');
        const pdfParse = pdfModule.default || pdfModule;
        const data = await pdfParse(buffer);
        text = data.text;
      } catch (e: any) {
        throw new Error('PDF 解析失败：' + (e.message || '文件可能已加密、为扫描图片或格式不受支持，请尝试另存为文本PDF或使用Word格式'));
      }
    } else if (ext === 'docx') {
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (e: any) {
        throw new Error('Word 解析失败：' + e.message);
      }
    } else if (ext === 'doc') {
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch {
        text = buffer.toString('utf-8').replace(/[^\x20-\x7E一-鿿　-〿＀-￯]/g, ' ');
      }
    } else {
      text = buffer.toString('utf-8');
    }

    if (!text || text.length < 30) {
      throw new Error('无法从文件中提取文本，请确认文件格式或尝试另存为PDF后重新上传');
    }

    const parsed = await this.parseWithAI(text);
    return parsed;
  }

  private async parseWithAI(text: string) {
    const system = `你是简历解析助手。从简历文本中提取结构化信息，返回JSON。

格式：
{
  "name": "姓名",
  "email": "邮箱",
  "phone": "电话",
  "city": "城市",
  "educations": [{"school":"学校","major":"专业","degree":"学历","startDate":"开始","endDate":"结束"}],
  "works": [{"company":"公司","position":"职位","startDate":"开始","endDate":"结束","description":"工作描述"}],
  "projects": [{"name":"项目名","role":"角色","description":"描述","techStack":["技术1"],"achievements":"成果"}],
  "skills": [{"name":"技能名","proficiency":4,"years":3}],
  "certificates": [{"name":"证书名","issuer":"颁发机构","date":"日期"}]
}

规则：
- 日期格式统一为 YYYY-MM 或 YYYY
- proficiency 根据熟练度估算1-5
- years 根据简历中的年限估算
- 缺失字段用空字符串或空数组
- 不要编造信息`;

    const content = await this.aiService.chat([
      { role: 'system', content: system },
      { role: 'user', content: text.substring(0, 8000) },
    ], true);

    return JSON.parse(content);
  }

  async saveParsedData(userId: string, parsed: any) {
    const results: string[] = [];

    for (const edu of (parsed.educations || [])) {
      await this.experienceService.createEducation(userId, edu);
      results.push('教育: ' + edu.school);
    }

    for (const work of (parsed.works || [])) {
      const saved = await this.experienceService.createWorkExperience(userId, work);
      for (const proj of (parsed.projects || [])) {
        await this.experienceService.createProject(saved.id, proj);
      }
      results.push('工作: ' + work.company);
    }

    for (const skill of (parsed.skills || [])) {
      await this.experienceService.createSkill(userId, skill);
      results.push('技能: ' + skill.name);
    }

    for (const cert of (parsed.certificates || [])) {
      await this.experienceService.createCertificate(userId, cert);
      results.push('证书: ' + cert.name);
    }

    return { saved: results };
  }
}
