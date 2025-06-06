import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    const config = this.configService.get('mail');

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }
  async sendVerificationEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const appUrl = this.configService.get('mail').APP_URL;
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;

    const verificationEmailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Vérification de votre adresse email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            .logo {
                max-width: 150px;
            }
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Vérification de votre adresse email</h2>
            </div>
            
            <p>Bonjour {{firstName}},</p>
            
            <p>Merci de vous être inscrit sur VetMed. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
                <a href="{{verificationUrl}}" class="button">Vérifier mon email</a>
            </div>
            
            <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
            
            <p style="word-break: break-all;">{{verificationUrl}}</p>
            
            <p>Ce lien expirera dans 24 heures.</p>
            
            <p>Si vous n'avez pas créé de compte sur VetMed, veuillez ignorer cet email.</p>
            
            <p>Cordialement,<br>L'équipe VetMed</p>
            
            <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p>&copy; 2025 VetMed. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
      `;

    const htmlContent = verificationEmailTemplate
      .replace('{{firstName}}', firstName)
      .replace(/{{verificationUrl}}/g, verificationUrl);

    await this.transporter.sendMail({
      from: `"VetMed Support" <${this.configService.get('mail').from}>`,
      to: email,
      subject: 'Vérifiez votre adresse email - VetMed',
      html: htmlContent,
    });
    return {
      success: true,
      message: 'Email de vérification envoyé avec succès',
    };
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const appUrl = this.configService.get('mail').APP_URL;
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"VetMed Support" <${this.configService.get('mail').from}>`,
      to: email,
      subject: 'Réinitialisation de mot de passe - VetMed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bonjour ${firstName},</h2>
          <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Réinitialiser mon mot de passe</a>
          </p>
          <p>Ou copiez ce lien dans votre navigateur:</p>
          <p>${resetUrl}</p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe VetMed</p>
        </div>
      `,
    });
    return {
      success: true,
      message: 'Email de réinitialisation de mot de passe envoyé avec succès',
    };
  }
}
