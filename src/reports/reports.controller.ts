import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto) {
    // Logic xử lý tạo báo cáo
    return this.reportsService.create(body);
  }
}
