import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity'; // Adjust the path if necessary
import { CreateReportDto } from './dtos/create-report.dto'; // Adjust the path if necessary
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    // Convert CreateReportDto to Report entity
    const report = this.repo.create(createReportDto);
    report.user = user; // Gán thực thể người dùng vào báo cáo
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder('report')
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model }) // Lọc theo model (mẫu xe)
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat }) // Lọc theo khoảng vĩ độ
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng }) // Lọc theo khoảng kinh độ
        .andWhere('year - :year BETWEEN -3 AND 3', { year }) // Lọc theo khoảng năm sản xuất
        .orderBy('mileage', 'DESC') // Sắp xếp theo mileage (quãng đường)
        // .setParameters({ mileage }) // Thiết lập tham số
        .limit(3)
        .getRawOne()
    );
  }
}
