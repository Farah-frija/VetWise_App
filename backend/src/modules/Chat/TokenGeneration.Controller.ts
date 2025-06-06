// src/agora/agora.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatTokenBuilder } from 'agora-token';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Agora Tokens')
@Controller('chat/token')
export class ChatController {
  private readonly APP_ID: string;
  private readonly APP_CERTIFICATE: string;
  private readonly DEFAULT_TOKEN_EXPIRATION = 86400; // 1 hour
  private readonly MAX_TOKEN_EXPIRATION = 86400; // 24 hours

  constructor(private configService: ConfigService) {
    this.APP_ID = this.configService.get<string>('APP_ID') || "aacbfe2f1fe741cfb54fcf66e8b43420";
    this.APP_CERTIFICATE = this.configService.get<string>('APP_CERTIFICATE') || "79b3b2e5cf9b4ab48fbdfc42a8659ed0";
  }

  @Get('generateChannelToken')
  @ApiOperation({ summary: 'Generate RTC channel token' })
  @ApiQuery({ name: 'channelName', required: true, description: 'Name of the channel' })
  @ApiQuery({ name: 'uid', required: false, description: 'User ID (default: 0)' })
  @ApiQuery({ name: 'expirationTime', required: false, description: 'Token expiration time in seconds (default: 86400)' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 400, description: 'Channel name is required' })
  @ApiResponse({ status: 500, description: 'Token generation failed or server error' })
  generateRtcToken(
    @Query('channelName') channelName: string,
    @Query('uid') uid: string = '0',
    @Query('expirationTime') expirationTime: string
  ) {
    if (!channelName) {
      throw new HttpException('Channel name is required', HttpStatus.BAD_REQUEST);
    }

    if (!this.APP_ID || !this.APP_CERTIFICATE) {
      throw new HttpException('Server configuration error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + (parseInt(expirationTime) || this.DEFAULT_TOKEN_EXPIRATION);

      const token = RtcTokenBuilder.buildTokenWithUid(
        this.APP_ID,
        this.APP_CERTIFICATE,
        channelName,
        parseInt(uid),
        RtcRole.PUBLISHER,
        privilegeExpiredTs
      );

      return {
        status: "success",
        token,
        appId: this.APP_ID,
        channel: channelName,
        uid,
        expiresAt: privilegeExpiredTs
      };
    } catch (error) {
      throw new HttpException('Token generation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('generateUserToken')
  @ApiOperation({ summary: 'Generate user token for Agora Chat' })
  @ApiQuery({ name: 'account', required: true, description: 'User account name' })
  @ApiQuery({ name: 'expireTimeInSeconds', required: false, description: 'Token expiration time in seconds (default: 86400, max: 86400)' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 400, description: 'Account parameter is required' })
  @ApiResponse({ status: 500, description: 'Token generation failed' })
  generateUserToken(
    @Query('account') account: string,
    @Query('expireTimeInSeconds') expireTimeInSeconds: string
  ) {
    if (!account) {
      throw new HttpException('Account parameter is required', HttpStatus.BAD_REQUEST);
    }

    const expireTime = Math.min(
      parseInt(expireTimeInSeconds) || this.DEFAULT_TOKEN_EXPIRATION,
      this.MAX_TOKEN_EXPIRATION
    );

    try {
      const token = ChatTokenBuilder.buildUserToken(this.APP_ID, this.APP_CERTIFICATE, account, expireTime);
      return {
        status: "success",
        token,
        expiresIn: expireTime
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('generateAppToken')
  @ApiOperation({ summary: 'Generate app token for Agora Chat' })
  @ApiQuery({ name: 'expireTimeInSeconds', required: false, description: 'Token expiration time in seconds (default: 86400, max: 86400)' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 500, description: 'Token generation failed' })
  generateAppToken(@Query('expireTimeInSeconds') expireTimeInSeconds: string) {
    const expireTime = Math.min(
      parseInt(expireTimeInSeconds) || this.DEFAULT_TOKEN_EXPIRATION,
      this.MAX_TOKEN_EXPIRATION
    );

    try {
      const token = ChatTokenBuilder.buildAppToken(this.APP_ID, this.APP_CERTIFICATE, expireTime);
      return {
        status: "success",
        token,
        expiresIn: expireTime
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 
}