import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeedbackService } from './feedback.service';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  create(@Body() body: { type: string; content: string; contact?: string }, @Req() req?: any) {
    return this.feedbackService.create(body, req?.user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.feedbackService.getAll(Number(page) || 1, Number(limit) || 20);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: string; adminNote?: string }) {
    return this.feedbackService.updateStatus(id, body.status, body.adminNote);
  }
}
