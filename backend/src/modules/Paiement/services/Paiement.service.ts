import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import axios from 'axios';

import { CreatePaiementDto } from '../dtos/RequestDto';
import { Paiement } from '../entities/Paiement.entity';
import { PaiementStatus } from '../../../common/enums/paiement.enum'

import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { ConversationService } from '../../Chat/services/conversation.service';
import { Conversation } from '../../Chat/Entities/conversation.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { RendezvousCheckResponseDto } from '../dtos/RendezVusCheckResponseDto';
import { RendezvousStatus } from '../../../common/enums/rendezvous-status.enum';
@Injectable()
export class PaiementService {
  private readonly logger = new Logger(PaiementService.name);

  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(Rendezvous)
    private readonly rendezvousRepository: Repository<Rendezvous>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
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
  async checkRendezvousStatus(conversationId: string): Promise<RendezvousCheckResponseDto> {
    // 1. Get the conversation with participants
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participant1', 'participant2'],
    });

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
    }

    // 2. Verify one participant is vet and other is owner
    const { participant1, participant2 } = conversation;
    const isParticipant1Vet = participant1.role === UserRole.VETERINARIAN;
    const isParticipant2Vet = participant2.role === UserRole.VETERINARIAN;
    
    if (!(isParticipant1Vet == isParticipant2Vet)) {
      return { status: 'failure', reason: 'Invalid participant roles' };
    }

    const veterinaireId = isParticipant1Vet ? participant1.id : participant2.id;
    const proprietaireId = isParticipant1Vet ? participant2.id : participant1.id;

    // 3. Find all rendezvous between these participants with successful payment
    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;

    const rendezvousList = await this.rendezvousRepository.find({
      where: [
        { 
          veterinaire: { id: veterinaireId }, 
          proprietaire: { id: proprietaireId },
          lastSuccessfulPaiement: { status: PaiementStatus.COMPLETED }
        },
      
      ],
      relations: ['lastSuccessfulPaiement'],
      order: { date: 'DESC', heure: 'DESC' },
    });

    if (!rendezvousList || rendezvousList.length === 0) {
      return { status: 'failure', reason: 'No completed rendezvous found' };
    }

    // 4. Check each rendezvous to find one that's within the time window
    for (const rendezvous of rendezvousList) {
      const rendezvousStart = new Date(`${rendezvous.date}T${rendezvous.heure}`);
      const rendezvousEnd = new Date(rendezvousStart.getTime() + oneHourInMs);
      
      // Check if current time is between start and end (start <= now <= end)
      if (now >= rendezvousStart && now <= rendezvousEnd) {
        return { 
          conversationId:conversationId,
          status: 'success',
          rendezvousId: rendezvous.id,
          startTime: rendezvousStart.toISOString(),
          endTime: rendezvousEnd.toISOString(),
          currentTime: now.toISOString(),
          timeRemaining: Math.max(0, rendezvousEnd.getTime() - now.getTime()) // in ms
        };
      }
    }

    // If we get here, no matching rendezvous was found
    return { 
      status: 'failure', 
      reason: 'No active rendezvous found (payment completed and within time window)' 
    };
  }
  async checkActiveConversationOFOneUser(userId: number): Promise<RendezvousCheckResponseDto> {
    // 1. Get all conversations for the user
    const conversations = await this.conversationRepository.find({
        where: [
            { participant1: { id: userId } },
            { participant2: { id: userId } }
        ],
        relations: ['participant1', 'participant2'],
    });

    if (!conversations || conversations.length === 0) {
        return { status: 'failure', reason: 'No conversations found for user' };
    }

    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;

    // 2. Check each conversation for active rendezvous
    for (const conversation of conversations) {
        // Determine roles
        const { participant1, participant2 } = conversation;
        const isParticipant1Vet = participant1.role === UserRole.VETERINARIAN;
        const isParticipant2Vet = participant2.role === UserRole.VETERINARIAN;

        // Skip if both participants have same role
        if (isParticipant1Vet === isParticipant2Vet) continue;

        const veterinaireId = isParticipant1Vet ? participant1.id : participant2.id;
        const proprietaireId = isParticipant1Vet ? participant2.id : participant1.id;

        // 3. Find completed rendezvous for this conversation pair
        const rendezvousList = await this.rendezvousRepository.find({
            where: {
                veterinaire: { id: veterinaireId },
                proprietaire: { id: proprietaireId },
                lastSuccessfulPaiement: { status: PaiementStatus.COMPLETED }
            },
            relations: ['lastSuccessfulPaiement'],
            order: { date: 'DESC', heure: 'DESC' },
        });

        if (!rendezvousList || rendezvousList.length === 0) continue;

        // 4. Check for active rendezvous
        for (const rendezvous of rendezvousList) {
            const rendezvousStart = new Date(`${rendezvous.date}T${rendezvous.heure}`);
            const rendezvousEnd = new Date(rendezvousStart.getTime() + oneHourInMs);

            if (now >= rendezvousStart && now <= rendezvousEnd) {
                return {
                    status: 'success',
                    conversationId: conversation.id,
                    rendezvousId: rendezvous.id,
                    startTime: rendezvousStart.toISOString(),
                    endTime: rendezvousEnd.toISOString(),
                    currentTime: now.toISOString(),
                    timeRemaining: Math.max(0, rendezvousEnd.getTime() - now.getTime()),
                   
                };
            }
        }
    }

    return {
        status: 'failure',
        reason: 'No active rendezvous found in any conversation'
    };
}
}

