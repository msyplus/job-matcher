import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobRecommendService } from './job-recommend.service';

@Controller('job-recommend')
@UseGuards(JwtAuthGuard)
export class JobRecommendController {
  constructor(private jobRecommendService: JobRecommendService) {}

  @Get('feed')
  getFeed(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.jobRecommendService.getFeed(req.user.id, Number(page) || 1, Number(limit) || 20);
  }

  @Post('save')
  saveRecommendations(@Req() req: any, @Body() body: { jobs: any[] }) {
    return this.jobRecommendService.saveRecommendations(req.user.id, body.jobs);
  }

  @Put(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.jobRecommendService.updateStatus(id, req.user.id, status);
  }
}
