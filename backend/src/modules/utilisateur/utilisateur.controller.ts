import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateImageDto } from './dto/update-image.dto';

ApiTags('utilisateurs');
@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Get('veterinaires')
  async getAllVets() {
    const vets = await this.utilisateurService.getAllVets();
    if (!vets || vets.length === 0) {
      throw new NotFoundException('No veterinarians found');
    }
    return vets;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.PET_OWNER)
  @Roles(UserRole.VETERINARIAN)
  @Get('image/:id')
  async getUserImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.utilisateurService.getUserImage(id);
    if (!image) {
      throw new NotFoundException('User image not found');
    }
    return image;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.utilisateurService.getProfile(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-profile/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const updatedProfile = await this.utilisateurService.updateProfile(
        id,
        updateProfileDto,
      );
      if (!updatedProfile) {
        throw new NotFoundException('Profile not found');
      }
      return {
        message: 'Profile updated successfully',
        data: updatedProfile,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update profile');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-image/:id')
  async updateProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() imageDto: UpdateImageDto,
  ) {
    if (!imageDto.image) {
      throw new BadRequestException('No image data provided');
    }

    try {
      const result = await this.utilisateurService.updateProfileImage(
        id,
        imageDto.image,
      );
      if (!result) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'Profile image updated successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update profile image');
    }
  }
}
