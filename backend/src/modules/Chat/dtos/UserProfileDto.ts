import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: number;

  @ApiProperty({
    description: 'Full name (combination of prenom and nom)',
    example: 'Jean Dupont'
  })
  fullName: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profiles/123.jpg',
    required: false
  })
  profileImage?: string;

  @ApiProperty({
    description: 'User role (for displaying special badges)',
    example: 'veterinaire',
    enum: ['client', 'veterinaire', 'admin']
  })
  role: string;

  @ApiProperty({
    description: 'Online status',
    example: true,
    required: false
  })
  isOnline?: boolean;
}