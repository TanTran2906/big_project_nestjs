import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity'; // Adjust the path if necessary
import { CreateReportDto } from './dtos/create-report.dto'; // Adjust the path if necessary

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    // Convert CreateReportDto to Report entity
    const report = this.repo.create(createReportDto);
    return this.repo.save(report);
  }
}
