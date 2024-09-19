import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
