import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JdService } from './jd.service';

@Controller('jd')
@UseGuards(JwtAuthGuard)
export class JdController {
  constructor(private jdService: JdService) {}

  @Get()
  getAll(@Req() req: any) { return this.jdService.getAll(req.user.id); }

  @Post()
  create(@Req() req: any, @Body() body: { rawText: string; sourceUrl?: string }) {
    return this.jdService.create(req.user.id, body);
  }

  @Post(':id/parse')
  parse(@Req() req: any, @Param('id') id: string) { return this.jdService.parse(id, req.user.id); }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) { return this.jdService.delete(id, req.user.id); }
}
