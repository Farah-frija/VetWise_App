export class RendezvousCheckResponseDto {
    status: 'success' | 'failure';
    reason?: string;
    rendezvousId?: number;
    startTime?: string;       // ISO string of when the rendezvous started
    endTime?: string;        // ISO string of when it ends (1 hour after start)
    currentTime?: string;    // ISO string of current server time
    timeRemaining?: number;  // Milliseconds remaining until end
  }
  // rendezvous-check.dto.ts
  import { ApiProperty } from '@nestjs/swagger';

  export class RendezvousCheckDto {
    @ApiProperty({
      description: 'ID of the conversation between veterinarian and owner',
      example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      required: true
    })
    conversationId: string;
  }