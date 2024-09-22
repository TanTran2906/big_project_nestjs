import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string; // Hãng xe (vd: Honda, Toyota)

  @Column()
  model: string; // Mẫu xe (vd: Mustang, Corolla)

  @Column()
  year: number; // Năm sản xuất

  @Column('float')
  lng: number; // Kinh độ nơi bán xe

  @Column('float')
  lat: number; // Vĩ độ nơi bán xe

  @Column()
  mileage: number; // Số dặm/kilomet đã chạy

  // Sử dụng ManyToOne để xác định mối quan hệ
  @ManyToOne(() => User, (user) => user.reports)
  user: User; // Một report thuộc về một user

  @Column({ default: false })
  approved: boolean;
}
