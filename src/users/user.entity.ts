// import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  // Sử dụng OneToMany để xác định mối quan hệ
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]; // Một user có thể có nhiều report

  // Thêm thuộc tính admin
  @Column({ default: true }) // Lưu ý: Mặc định là true để test, cần thay đổi cho production
  admin: boolean;
}
