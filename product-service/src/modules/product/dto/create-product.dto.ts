// import { IsString, IsNumber } from 'class-validator';

// export class CreateProductDto {
//   @IsString()
//   title: string;

//   @IsString()
//   description: string;

//   @IsNumber()
//   price: number;
// }

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ example: 99.99 })
  price: number;
}