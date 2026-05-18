import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobSearchService } from './job-search.service';
import { JobRecommendService } from '../job-recommend/job-recommend.service';

@Controller('job-search')
@UseGuards(JwtAuthGuard)
export class JobSearchController {
  constructor(
    private jobSearchService: JobSearchService,
    private jobRecommendService: JobRecommendService,
  ) {}

  @Post('search')
  async search(@Req() req: any, @Body() body: { keyword: string; location?: string; limit?: number }) {
    return this.jobSearchService.searchAndMatch(
      req.user.id,
      body.keyword,
      body.location,
      body.limit || 20,
    );
  }

  @Post('collect')
  async collect(@Req() req: any, @Body() body: {
    url: string; rawText: string; platform: string;
    title: string; company: string; location?: string; salary?: string;
  }) {
    // Parse JD with AI
    let parsedResult: any = {};
    try {
      parsedResult = await this.jobSearchService.parseAndMatch(req.user.id, body.rawText);
    } catch (e) {
      // If AI fails, use basic match from raw text
      parsedResult = { matchScore: 30, matchDetails: { matchedSkills: [] } };
    }

    // Save to recommendations
    const saved = await this.jobRecommendService.saveRecommendations(req.user.id, [{
      title: body.title || parsedResult.position || '未知职位',
      company: body.company || '',
      location: body.location || '',
      salary: body.salary || '',
      description: body.rawText,
      sourceUrl: body.url,
      sourcePlatform: body.platform,
      matchScore: parsedResult.matchScore || 0,
      matchDetails: parsedResult.matchDetails || {},
    }]);

    return {
      ...saved[0],
      matchScore: parsedResult.matchScore,
      matchDetails: parsedResult.matchDetails,
    };
  }
}
