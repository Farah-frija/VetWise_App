import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreatePaiementDto {
  @ApiProperty({ description: 'Appointment ID' })
  @IsUUID()
  rendezvousId: number;

  @ApiProperty({ description: 'Payment amount', example: 99.99 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
export class PaymentStatusResponse {
    @ApiProperty({ description: 'Whether operation succeeded' })
    success: boolean;
  
    @ApiProperty({ description: 'Payment ID' })
    paymentId: string;
  
    @ApiProperty({ 
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      description: 'Current payment status' 
    })
    status: string;
  
    @ApiProperty({ 
      required: false,
      description: 'Completion timestamp (if completed)' 
    })
    completedAt?: Date;
  
    @ApiProperty({ 
      required: false,
      description: 'Payment URL (only for creation)' 
    })
    paymentUrl?: string;
  
    @ApiProperty({ 
      required: false,
      description: 'Payment amount (only for creation)' 
    })
    amount?: number;
  }