import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  mileage: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  longitude?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  latitude?: number;
}
