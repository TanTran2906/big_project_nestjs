import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDTO {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  @Transform(({ obj }) => {
    // console.log(obj);
    return obj.user;
  }) // Lấy ID từ thực thể người dùng
  userId: number;
}
