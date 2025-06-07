import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { CreatePaiementDto } from '../dtos/RequestDto';
import { Paiement } from '../entities/Paiement.entity';
import { PaiementStatus } from '../../../common/enums/paiement.enum'

import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { ConversationService } from '../../Chat/services/conversation.service';
@Injectable()
export class PaiementService {
  private readonly logger = new Logger(PaiementService.name);

  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(Rendezvous)
    private readonly rendezvousRepository: Repository<Rendezvous>,
    private readonly configService: ConfigService,
    private readonly conversationService: ConversationService,
  ) {}

  async createPayment(createPaiementDto: CreatePaiementDto) {
    const fluociConfig = this.configService.get('flouci');
    console.log(fluociConfig);
    const rendezvous = await this.rendezvousRepository.findOne({
        where: { id: createPaiementDto.rendezvousId }
      });
  
      if (!rendezvous) {
        throw new HttpException(
          'Rendezvous not found',
          HttpStatus.NOT_FOUND
        );
      }
    try {
      // 1. Call Flouci API
      const { data } = await axios.post(fluociConfig.apiUrl, {
        app_token: fluociConfig.appToken,
        app_secret: fluociConfig.appSecret,
        amount: createPaiementDto.amount,
        accept_card: true,
        session_timeout_secs: fluociConfig.sessionTimeout,
        success_link: fluociConfig.successUrl,
        fail_link: fluociConfig.failUrl,
        developer_tracking_id: fluociConfig.DEVELOPER_TRACKING_ID,
      });
  
    console.log(data);
     if(data.result.success)
     // 2. Create payment entity
     {const payment = new Paiement();
     payment.id = data.result.payment_id; // Manual ID assignment
     payment.amount = createPaiementDto.amount;
     payment.status = PaiementStatus.PENDING;
     payment.rendezvous = rendezvous;
  
      const savedPayment = await this.paiementRepository.save(payment);}
      else 
      throw new HttpException('Payment Failed', HttpStatus.BAD_REQUEST);

     
  
      return data.result;
  
    } catch (error) {
        // Enhanced error handling
        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data || {
            message: error.message,
            status: error.response?.status || 500
          };
          
          this.logger.error(`Payment failed with status ${error.response?.status}:`, errorData);
          
          // Return the API's error response if available
          if (error.response?.data) {
            throw new HttpException(
              error.response.data,
              error.response.status
            );
          }
        }
        
        // For non-Axios errors
        this.logger.error(`Unexpected payment error: ${error.message}`, error.stack);
        throw new HttpException(
          'Payment processing failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  }
  async markPaymentSuccess(paymentId: string) {
    const payment = await this.updatePaymentStatus(
      paymentId,
      PaiementStatus.COMPLETED
    );
     console.log(payment)
    // Get the associated rendezvous with relations
    const rendezvous = await this.rendezvousRepository.findOne({
      where: { id: payment.rendezvous.id },
      relations: ['veterinaire', 'proprietaire', 'lastSuccessfulPaiement']
    });

    if (!rendezvous) {
      this.logger.warn(`Rendezvous not found for payment ${paymentId}`);
      return payment;
    }

    // Update the rendezvous with the successful payment
    rendezvous.lastSuccessfulPaiement = payment;
    await this.rendezvousRepository.save(rendezvous);

    // Use conversation service to handle conversation creation
    await this.handleConversationCreation(
      rendezvous.veterinaire.id,
      rendezvous.proprietaire.id
    );

    return {
        success: true,
        paymentId: payment.id,
        status: payment.status,
        completedAt: payment.completedAt
      };
  }

  async markPaymentFailed(paymentId: string) {
    const payment = await this.updatePaymentStatus(
      paymentId,
      PaiementStatus.FAILED
    );
    return {
        success: false,
        paymentId: payment.id,
        status: payment.status,
        completedAt: payment.completedAt
      };
  }

  private async updatePaymentStatus(
    paymentId: string,
    status: PaiementStatus
  ) {
    try {
        console.log(paymentId);
      const payment = await this.paiementRepository.findOne({
        where: { id: paymentId }
      });
      
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      payment.status = status;
      payment.completedAt = status === PaiementStatus.COMPLETED ? new Date() : null;
      
      const paiement=await this.paiementRepository.save(payment);
          console.log(paiement)
      return paiement;

    } catch (error) {
      this.logger.error(`Payment status update failed: ${error.message}`, error.stack);
      throw new HttpException(
        error.response?.message || 'Status update failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  private async handleConversationCreation(userId1: number, userId2: number) {
    try {
      // The service will handle the existence check internally
      await this.conversationService.create({
        participant1Id: userId1,
        participant2Id: userId2
      });
      this.logger.log(`Ensured conversation exists between ${userId1} and ${userId2}`);
    } catch (error) {
      // The service already handles NotFound and BadRequest cases
      if (error instanceof BadRequestException && error.message.includes('already exists')) {
        this.logger.debug(`Conversation already exists between ${userId1} and ${userId2}`);
      } else {
        this.logger.error(`Conversation handling failed: ${error.message}`, error.stack);
      }
    }
  }
}