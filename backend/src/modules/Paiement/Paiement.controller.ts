import { Controller, Post, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PaiementService } from './services/Paiement.service';
import { CreatePaiementDto, PaymentStatusResponse } from './dtos/RequestDto';
import { RendezvousCheckDto, RendezvousCheckResponseDto } from './dtos/RendezVusCheckResponseDto';

@ApiTags('Payments')
@Controller('payments')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate a new payment' })
  @ApiBody({ type: CreatePaiementDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment initiated successfully',
    type: PaymentStatusResponse
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rendezvous not found' 
  })
  async createPayment(@Body() dto: CreatePaiementDto) {
    return this.paiementService.createPayment(dto);
  }

  @Post(':id/success')
  @ApiOperation({ summary: 'Mark payment as successful' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment marked as successful',
    type: PaymentStatusResponse
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  async markSuccess(@Param('id') paymentId: string) {
    return this.paiementService.markPaymentSuccess(paymentId);
  }

  @Post(':id/fail')
  @ApiOperation({ summary: 'Mark payment as failed' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment marked as failed',
    type: PaymentStatusResponse
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  async markFailed(@Param('id') paymentId: string) {
    return this.paiementService.markPaymentFailed(paymentId);
  }
  @Post('check-rendezvous')
  @ApiOperation({ 
    summary: 'Check rendezvous status',
    description: 'Verifies if a rendezvous is active (has valid payment and within time window)' 
  })
  @ApiBody({ type: RendezvousCheckDto })
  @ApiResponse({
    status: 200,
    description: 'Rendezvous is active and valid',
    type: RendezvousCheckResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Rendezvous is not active (payment incomplete or time window expired)',
    type: RendezvousCheckResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found'
  })
  async checkRendezvousStatus(
    @Body() rendezvousCheckDto: RendezvousCheckDto
  ): Promise<RendezvousCheckResponseDto > {
    const result = await this.paiementService.checkRendezvousStatus(rendezvousCheckDto.conversationId);
    
    if (result.status === 'success') {
      return result;
    } else {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
  }
}