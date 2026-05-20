import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExperienceService } from './experience.service';
import { ResumeParserService } from './resume-parser.service';

@Controller('experiences')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(
    private experienceService: ExperienceService,
    private resumeParser: ResumeParserService,
  ) {}

  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadResume(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('请上传文件');
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext || '')) {
      throw new BadRequestException('不支持的文件格式，请上传 PDF、Word 或 TXT 文件');
    }
    try {
      const parsed = await this.resumeParser.parse(file.buffer, file.originalname);
      await this.resumeParser.saveParsedData(req.user.id, parsed);
      return parsed;
    } catch (e: any) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('解析失败：' + (e.message || '文件格式不支持，请尝试转换为 PDF 或 Word 格式后重新上传'));
    }
  }

  // Education
  @Get('educations')
  getEducations(@Req() req: any) { return this.experienceService.getEducations(req.user.id); }
  @Post('educations')
  createEducation(@Req() req: any, @Body() body: any) { return this.experienceService.createEducation(req.user.id, body); }
  @Put('educations/:id')
  updateEducation(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.experienceService.updateEducation(id, req.user.id, body); }
  @Delete('educations/:id')
  deleteEducation(@Req() req: any, @Param('id') id: string) { return this.experienceService.deleteEducation(id, req.user.id); }

  // Work Experience
  @Get('work')
  getWorkExperiences(@Req() req: any) { return this.experienceService.getWorkExperiences(req.user.id); }
  @Post('work')
  createWorkExperience(@Req() req: any, @Body() body: any) { return this.experienceService.createWorkExperience(req.user.id, body); }
  @Put('work/:id')
  updateWorkExperience(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.experienceService.updateWorkExperience(id, req.user.id, body); }
  @Delete('work/:id')
  deleteWorkExperience(@Req() req: any, @Param('id') id: string) { return this.experienceService.deleteWorkExperience(id, req.user.id); }

  // Projects
  @Get('work/:workId/projects')
  getProjects(@Param('workId') workId: string) { return this.experienceService.getProjects(workId); }
  @Post('work/:workId/projects')
  createProject(@Param('workId') workId: string, @Body() body: any) { return this.experienceService.createProject(workId, body); }
  @Put('projects/:id')
  updateProject(@Param('id') id: string, @Body() body: any) { return this.experienceService.updateProject(id, body); }
  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) { return this.experienceService.deleteProject(id); }

  // Skills
  @Get('skills')
  getSkills(@Req() req: any) { return this.experienceService.getSkills(req.user.id); }
  @Post('skills')
  createSkill(@Req() req: any, @Body() body: any) { return this.experienceService.createSkill(req.user.id, body); }
  @Put('skills/:id')
  updateSkill(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.experienceService.updateSkill(id, req.user.id, body); }
  @Delete('skills/:id')
  deleteSkill(@Req() req: any, @Param('id') id: string) { return this.experienceService.deleteSkill(id, req.user.id); }

  // Certificates
  @Get('certificates')
  getCertificates(@Req() req: any) { return this.experienceService.getCertificates(req.user.id); }
  @Post('certificates')
  createCertificate(@Req() req: any, @Body() body: any) { return this.experienceService.createCertificate(req.user.id, body); }
  @Put('certificates/:id')
  updateCertificate(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.experienceService.updateCertificate(id, req.user.id, body); }
  @Delete('certificates/:id')
  deleteCertificate(@Req() req: any, @Param('id') id: string) { return this.experienceService.deleteCertificate(id, req.user.id); }
}
