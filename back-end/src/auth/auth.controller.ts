import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { PromoteUserDto } from './dto/promote-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 tentativas por 5 minutos
  @ApiOperation({
    summary: 'Registrar novo utilizador',
    description:
      'Cria uma nova conta de utilizador com role USER. Para outras roles (CAPTAIN, COMPANY_ADMIN), use o endpoint de promoção após o registro.',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilizador registrado com sucesso (sempre com role USER)',
    schema: {
      example: {
        message:
          'Utilizador criado com sucesso. Verifique o seu email para ativar a conta.',
        userId: 1,
        emailSent: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email já existe ou dados inválidos',
  })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar email',
    description:
      'Confirma o email do utilizador usando o token recebido por email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado com sucesso',
    schema: {
      example: {
        message: 'Email verificado com sucesso! Pode agora fazer login.',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'carlos@example.com',
          name: 'Carlos Lima',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  verifyEmail(@Body() dto: { token: string }) {
    return this.auth.verifyEmail(dto.token);
  }

  @Get('verify-email')
  @ApiOperation({
    summary: 'Verificar email via link (GET)',
    description:
      'Endpoint GET para verificação por link direto do email - retorna página HTML',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado com sucesso via link',
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async verifyEmailViaLink(@Query('token') token: string, @Res() res: any) {
    if (!token) {
      return res.status(400).send(this.getErrorPage('Token não fornecido'));
    }

    try {
      const result = await this.auth.verifyEmail(token);
      return res.status(200).send(this.getSuccessPage());
    } catch (error) {
      return res.status(400).send(this.getErrorPage(error.message));
    }
  }

  private getSuccessPage(): string {
    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verificado - FootMatch</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 1s ease infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          h1 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          .info {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: left;
          }
          .info strong {
            color: #667eea;
          }
          .footer {
            color: #999;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>Email Verificado com Sucesso!</h1>
          <p>A sua conta FootMatch foi ativada com sucesso.</p>
          <div class="info">
            <strong>Próximo passo:</strong><br>
            Abra a aplicação FootMatch no seu telemóvel e faça login com as suas credenciais.
          </div>
          <p>Já pode fechar esta página e voltar à aplicação.</p>
          <div class="footer">
            ⚽ FootMatch - Organize os seus jogos de futebol
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getErrorPage(errorMessage: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro na Verificação - FootMatch</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          h1 {
            color: #f5576c;
            font-size: 28px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          .error-box {
            background: #fff5f5;
            border-left: 4px solid #f5576c;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: left;
          }
          .error-box strong {
            color: #f5576c;
          }
          .info {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: left;
          }
          .footer {
            color: #999;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Erro na Verificação</h1>
          <p>Não foi possível verificar o seu email.</p>
          <div class="error-box">
            <strong>Motivo:</strong><br>
            ${errorMessage}
          </div>
          <div class="info">
            <strong>O que fazer:</strong><br>
            • Tente fazer login na aplicação FootMatch<br>
            • Um novo email de verificação será enviado automaticamente<br>
            • Verifique também a pasta de spam
          </div>
          <div class="footer">
            ⚽ FootMatch - Organize os seus jogos de futebol
          </div>
        </div>
      </body>
      </html>
    `;
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reenviar email de verificação',
    description:
      'Reenvia o email de verificação para utilizadores não verificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de verificação reenviado',
    schema: {
      example: {
        message: 'Email de verificação reenviado com sucesso',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email já verificado' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.auth.resendEmailVerification(dto.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 tentativas por 5 minutos
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica o utilizador e retorna tokens de acesso',
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'carlos@example.com',
          name: 'Carlos Lima',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas ou email não verificado',
  })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acesso',
    description: 'Usa o refresh token para obter um novo access token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Token de refresh válido',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.auth.refreshToken(body.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar reset de password',
    description:
      'Envia email com token para reset de password. REQUER email verificado previamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação processada (email enviado se existir)',
    schema: {
      example: {
        message: 'Se o email existir, receberá instruções para reset',
        token: 'abc123...', // apenas em desenvolvimento
        resetUrl: 'http://localhost:3000/reset-password?token=abc123...', // apenas em desenvolvimento
        emailSent: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email não verificado - verifique primeiro o email',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirmar reset de password',
    description: 'Usa o token recebido por email para definir nova password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password resetada com sucesso',
    schema: {
      example: {
        message: 'Password resetada com sucesso',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Get('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Página de reset de password via link (GET)',
    description:
      'Endpoint GET para mostrar formulário de reset - usar com frontend',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido - mostrar formulário',
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  resetPasswordPage(@Query('token') token: string) {
    if (!token) {
      return {
        error: 'Token é obrigatório',
        message:
          'Use o endpoint POST /auth/reset-password com token e newPassword',
      };
    }
    return {
      message:
        'Token recebido. Use POST /auth/reset-password com token e newPassword',
      token: token,
      instructions:
        'Endpoint: POST /auth/reset-password | Body: {"token": "' +
        token +
        '", "newPassword": "sua-nova-password"}',
    };
  }

  @Post('test-smtp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Testar conectividade SMTP',
    description:
      'Endpoint para testar se as configurações de email estão corretas',
  })
  @ApiResponse({
    status: 200,
    description: 'Teste de SMTP executado',
    schema: {
      example: {
        success: true,
        message: 'Conexão SMTP testada com sucesso',
      },
    },
  })
  async testSmtp() {
    return this.auth.testSmtpConnection();
  }

  @Post('promote-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Promover utilizador (apenas ADMIN)',
    description:
      'Promove um utilizador USER para CAPTAIN ou COMPANY_ADMIN. Apenas administradores podem executar esta ação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilizador promovido com sucesso',
    schema: {
      example: {
        message: 'Utilizador promovido para CAPTAIN com sucesso',
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'User Name',
          role: 'CAPTAIN',
          emailVerified: true,
          createdAt: '2025-11-02T18:00:00.000Z',
          updatedAt: '2025-11-02T18:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Role inválida ou utilizador não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem promover utilizadores',
  })
  promoteUser(@Body() dto: PromoteUserDto, @CurrentUser() user: any) {
    return this.auth.promoteUser(dto.email, dto.role, user);
  }

  @Post('demote-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Rebaixar utilizador para USER (apenas ADMIN)',
    description:
      'Rebaixa um utilizador CAPTAIN ou COMPANY_ADMIN para USER. Apenas administradores podem executar esta ação.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email do utilizador a rebaixar',
          example: 'captain@example.com',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Utilizador rebaixado com sucesso',
    schema: {
      example: {
        message: 'Utilizador rebaixado para USER com sucesso',
        user: {
          id: 1,
          email: 'captain@example.com',
          name: 'Captain Name',
          role: 'USER',
          emailVerified: true,
          createdAt: '2025-11-02T18:00:00.000Z',
          updatedAt: '2025-11-02T18:35:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Utilizador não encontrado ou já é USER',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem rebaixar utilizadores',
  })
  demoteUser(@Body() body: { email: string }, @CurrentUser() user: any) {
    return this.auth.demoteUser(body.email, user);
  }
}
