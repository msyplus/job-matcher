import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: configService.get('DEEPSEEK_API_KEY') || 'sk-placeholder',
      baseURL: configService.get('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com/v1',
    });
    this.model = configService.get('DEEPSEEK_MODEL') || 'deepseek-chat';
  }

  async chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], jsonMode = false) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.3,
      max_tokens: 4096,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    });
    return response.choices[0]?.message?.content || '';
  }

  async parseJD(rawText: string) {
    const system = `你是一个招聘数据提取助手。从职位描述中提取结构化信息，以JSON格式返回。
返回格式必须严格遵循:
{
  "position": "职位名称",
  "company": "公司名称",
  "location": "工作地点",
  "salaryRange": "薪资范围",
  "requiredSkills": ["技能1", "技能2"],
  "preferredSkills": ["加分技能1"],
  "education": "学历要求",
  "yearsRequired": "经验年限要求",
  "keywords": ["关键词1", "关键词2"]
}
如果某项信息未提及，使用空字符串或空数组。`;

    const content = await this.chat([
      { role: 'system', content: system },
      { role: 'user', content: rawText },
    ], true);

    return JSON.parse(content);
  }

  async generateResume(experienceData: {
    name?: string;
    educations: string[];
    workExperiences: string[];
    projects: string[];
    skills: string[];
    certificates: string[];
  }, jdData: {
    position?: string;
    requiredSkills?: string[];
    preferredSkills?: string[];
    keywords?: string[];
  }) {
    const system = `你是一个资深简历撰写专家。根据用户的真实经历和职位描述，生成一份针对性的定制简历。

要求：
1. 不要编造任何经历、数据、技术名词——必须基于用户提供的真实经历
2. 将JD中的关键技能词自然地融入经历描述中
3. 量化成就（如果经历中提了数据的话）
4. 根据JD重点调整简历模块顺序

返回JSON格式：
{
  "sections": [
    {
      "type": "header",
      "title": "个人信息",
      "locked": true,
      "body": "姓名 | 城市 | 邮箱 | 电话"
    },
    {
      "type": "summary",
      "title": "个人概述",
      "locked": false,
      "body": "针对该岗位的3-4句概述，突出最相关的经验和技能"
    },
    {
      "type": "experience",
      "title": "工作经历",
      "locked": false,
      "body": "按JD定制后的工作经历描述，每段经历包含公司-职位-时间-描述-成就"
    },
    {
      "type": "education",
      "title": "教育背景",
      "locked": false,
      "body": "教育经历信息"
    },
    {
      "type": "skills",
      "title": "专业技能",
      "locked": false,
      "body": "技能列表，优先排列JD中要求的技能"
    },
    {
      "type": "projects",
      "title": "项目经验",
      "locked": false,
      "body": "与JD最相关的项目经验"
    }
  ],
  "matchScore": 85,
  "jdKeywords": ["已覆盖的关键词"]
}`;

    const userMessage = JSON.stringify({
      personalInfo: { name: experienceData.name },
      education: experienceData.educations,
      work: experienceData.workExperiences,
      projects: experienceData.projects,
      skills: experienceData.skills,
      certificates: experienceData.certificates,
      targetJD: jdData,
    }, null, 2);

    const content = await this.chat([
      { role: 'system', content: system },
      { role: 'user', content: `请基于以下真实经历和JD，生成定制简历:\n\n${userMessage}` },
    ], true);

    return JSON.parse(content);
  }
}
