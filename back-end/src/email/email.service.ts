import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    // Configurar transporter de email
    if (this.config.get('SMTP_USER') && this.config.get('SMTP_PASS')) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Usar serviço Gmail específico
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.config.get('SMTP_USER'),
          pass: this.config.get('SMTP_PASS'), // App Password do Gmail
        },
        tls: {
          rejectUnauthorized: false,
        },
        pool: true, // Para melhor performance
        maxConnections: 5,
        maxMessages: 10,
      });

      this.logger.log('Transporter SMTP configurado para envio real de emails');
    } else {
      // Em desenvolvimento, usar logger em vez de envio real
      this.logger.log(
        'Modo desenvolvimento: emails serão simulados (SMTP não configurado)',
      );
    }
  }

  async sendEmailVerification(email: string, name: string, token: string) {
    // Construir URL correta baseada no ambiente
    const baseUrl =
      this.config.get('APP_URL') ||
      `http://localhost:${this.config.get('PORT') || 3000}`;
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Bem-vindo ao Game On!</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Obrigado por se registar na nossa plataforma. Para completar o seu registo, por favor confirme o seu email clicando no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirmar Email
          </a>
        </div>
        
        <p>Ou use este endpoint diretamente no Swagger:</p>
        <p><strong>POST</strong> <code>/auth/verify-email</code></p>
        <p>Body: <code>{"token": "${token}"}</code></p>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        
        <p><strong>Este link expira em 24 horas.</strong></p>
        
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Se não se registou na nossa plataforma, pode ignorar este email.
        </p>
      </div>
    `;

    if (this.transporter) {
      // Enviar email real via SMTP
      try {
        await this.transporter.sendMail({
          from: `"Game On" <${this.config.get('FROM_EMAIL')}>`,
          to: email,
          subject: 'Confirme o seu email - Game On',
          html: htmlContent,
        });

        this.logger.log(`Email de verificação enviado para: ${email}`);
        return { success: true, message: 'Email de verificação enviado' };
      } catch (error) {
        this.logger.error(`Erro ao enviar email para ${email}:`, error);
        return { success: false, message: 'Erro ao enviar email' };
      }
    } else {
      // Em desenvolvimento, mostrar no log
      this.logger.log(`
=== EMAIL DE VERIFICAÇÃO (DESENVOLVIMENTO) ===
Para: ${email}
Nome: ${name}
Token: ${token}
URL: ${verificationUrl}
============================================
      `);
      return { success: true, message: 'Email simulado em desenvolvimento' };
    }
  }

  async sendPasswordReset(email: string, name: string, token: string) {
    // Deep link para abrir a app diretamente
    const appScheme = this.config.get('APP_SCHEME') || 'footmatch';
    const resetUrl = `${appScheme}://reset-password?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset de Password - Game On</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Recebemos um pedido para resetar a password da sua conta. Clique no botão abaixo para definir uma nova password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Resetar Password
          </a>
        </div>
        
        <p>Ou use este endpoint diretamente no Swagger:</p>
        <p><strong>POST</strong> <code>/auth/reset-password</code></p>
        <p>Body: <code>{"token": "${token}", "newPassword": "sua-nova-password"}</code></p>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        
        <p><strong>Este link expira em 15 minutos.</strong></p>
        
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Se não solicitou o reset de password, pode ignorar este email.
        </p>
      </div>
    `;

    if (this.transporter) {
      // Enviar email real via SMTP
      try {
        await this.transporter.sendMail({
          from: `"Game On" <${this.config.get('FROM_EMAIL')}>`,
          to: email,
          subject: 'Reset de Password - Game On',
          html: htmlContent,
        });

        this.logger.log(`Email de reset enviado para: ${email}`);
        return { success: true, message: 'Email de reset enviado' };
      } catch (error) {
        this.logger.error(`Erro ao enviar email para ${email}:`, error);
        return { success: false, message: 'Erro ao enviar email' };
      }
    } else {
      this.logger.log(`
=== EMAIL DE RESET PASSWORD (DESENVOLVIMENTO) ===
Para: ${email}
Nome: ${name}
Token: ${token}
URL: ${resetUrl}
===============================================
      `);
      return { success: true, message: 'Email simulado em desenvolvimento' };
    }
  }

  // Método para testar conectividade SMTP
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(
        'Transporter não configurado - não é possível testar conexão',
      );
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log('✅ Conexão SMTP testada com sucesso!');
      return true;
    } catch (error) {
      this.logger.error('❌ Erro na conexão SMTP:', error);
      this.logger.error('💡 Verifique se:');
      this.logger.error('   1. Autenticação de 2 fatores está ativa no Gmail');
      this.logger.error('   2. Está usando App Password (não a senha normal)');
      this.logger.error('   3. App Password tem 16 caracteres');
      this.logger.error('   4. Email e App Password estão corretos no .env');
      return false;
    }
  }
}
