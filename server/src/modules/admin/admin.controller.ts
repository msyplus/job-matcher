import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() { return this.adminService.getStats(); }

  @Get('feedbacks')
  getFeedbacks(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.adminService.getFeedbackList(Number(page) || 1, Number(limit) || 20, status);
  }

  @Get('users')
  getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getUsers(Number(page) || 1, Number(limit) || 20);
  }
}
