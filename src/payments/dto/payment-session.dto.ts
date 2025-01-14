import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentSessionDto {
  @ApiProperty({
    description: 'Order ID',
    example: '41528c98-c980-457a-9b87-3f05cfb70914',
  })
  @IsString()
  @IsUUID()
  orderId: string;
}
