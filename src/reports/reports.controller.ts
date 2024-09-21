import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { User } from 'src/users/user.entity';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report-dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
// import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';

@Controller('reports')
// @UseInterceptors(CurrentUserInterceptor)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/create')
  @UseGuards(AdminGuard)
  @UseInterceptors(new SerializeInterceptor(ReportDTO)) // Áp dụng Interceptor với ReportDTO
  createReport(
    @Body() body: CreateReportDto,
    // @CurrentUser() currentUser: User,
    @Session() session: any,
  ) {
    // Logic xử lý tạo báo cáo
    // console.log(session.userId);
    return this.reportsService.create(body, session.userId);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    const report = await this.reportsService.changeApproval(id, body.approved);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  @Get('estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    // Logic để ước tính giá trị xe
    console.log(query); // Để kiểm tra dữ liệu đầu vào
    return {
      message: 'Giá trị ước tính của xe',
      data: query, // Có thể thay thế bằng logic ước tính thực tế
    };
  }
}
