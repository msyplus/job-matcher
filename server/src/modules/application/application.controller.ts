import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationService } from './application.service';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get()
  getAll(@Req() req: any) { return this.applicationService.getAll(req.user.id); }

  @Get('stats')
  getStats(@Req() req: any) { return this.applicationService.getStats(req.user.id); }

  @Post()
  create(@Req() req: any, @Body() body: any) { return this.applicationService.create(req.user.id, body); }

  @Put(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.applicationService.updateStatus(id, req.user.id, status);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.applicationService.update(id, req.user.id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) { return this.applicationService.delete(id, req.user.id); }
}
