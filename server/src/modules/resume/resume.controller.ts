import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeService } from './resume.service';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get()
  getAll(@Req() req: any) { return this.resumeService.getAll(req.user.id); }

  @Post('generate')
  generate(@Req() req: any, @Body() body: { jdId?: string; template?: string }) {
    return this.resumeService.generate(req.user.id, body);
  }

  @Get('export/:id')
  async export(@Req() req: any, @Param('id') id: string, @Res() res: any) {
    const html = await this.resumeService.exportHtml(id, req.user.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) { return this.resumeService.getById(id, req.user.id); }

  @Put(':id')
  updateContent(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.resumeService.updateContent(id, req.user.id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) { return this.resumeService.delete(id, req.user.id); }
}
