import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT = 12;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(email: string, name: string, password: string) {
    this.logger.log(`Tentativa de registro para: ${email}`);

    const found = await this.prisma.user.findUnique({ where: { email } });
    if (found) {
      this.logger.warn(`Tentativa de registro com email existente: ${email}`);
      throw new BadRequestException('Ja existe um utilizador com este email.');
    }

    const hash = await bcrypt.hash(password, this.SALT);

    // Gerar token de verificação de email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        role: 'USER', // Sempre USER no registro público
        emailVerified: false,
        emailVerificationToken,
      },
    });

    // Enviar email de verificação
    await this.emailService.sendEmailVerification(
      email,
      name,
      emailVerificationToken,
    );

    this.logger.log(
      `Utilizador registrado com sucesso: ${email} (aguarda verificação)`,
    );

    return {
      message:
        'Utilizador criado com sucesso. Verifique o seu email para ativar a conta.',
      userId: user.id,
      emailSent: true,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }

  async login(email: string, password: string) {
    this.logger.log(`Tentativa de login para: ${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`Login falhou para: ${email} (registo não encontrado)`);
      throw new UnauthorizedException(
        'Registo não encontrado. Crie uma conta.',
      );
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      this.logger.warn(`Login falhou para: ${email} (password incorreta)`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se o email foi verificado
    if (!user.emailVerified) {
      this.logger.warn(`Login tentado com email não verificado: ${email}`);

      // Reenviar email de verificação automaticamente
      try {
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        await this.prisma.user.update({
          where: { id: user.id },
          data: { emailVerificationToken },
        });

        await this.emailService.sendEmailVerification(
          email,
          user.name || 'Utilizador',
          emailVerificationToken,
        );

        this.logger.log(
          `Email de verificação reenviado automaticamente para: ${email}`,
        );
      } catch (error) {
        this.logger.error(
          `Erro ao reenviar email de verificação: ${error.message}`,
        );
      }

      throw new UnauthorizedException(
        'Email não verificado. Enviámos um novo email de verificação. Verifique a sua caixa de entrada.',
      );
    }

    this.logger.log(`Login bem-sucedido para: ${email}`);
    return this.sign(user);
  }

  async verifyEmail(token: string) {
    this.logger.log(`Tentativa de verificação de email com token`);

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      this.logger.warn(`Token de verificação inválido ou já usado`);
      throw new BadRequestException(
        'Token de verificação inválido ou expirado',
      );
    }

    // Marcar email como verificado e remover token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    this.logger.log(
      `Email verificado com sucesso para utilizador ID: ${user.id}`,
    );

    // Retornar tokens de autenticação após verificação
    return {
      message: 'Email verificado com sucesso! Pode agora fazer login.',
      ...this.sign(user),
    };
  }

  async resendEmailVerification(email: string) {
    this.logger.log(`Reenvio de verificação solicitado para: ${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email já está verificado');
    }

    // Gerar novo token de verificação
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken },
    });

    // Reenviar email
    await this.emailService.sendEmailVerification(
      email,
      user.name || 'Utilizador',
      emailVerificationToken,
    );

    this.logger.log(`Email de verificação reenviado para: ${email}`);

    return { message: 'Email de verificação reenviado com sucesso' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Utilizador não encontrado');
      }

      return this.sign(user);
    } catch (error) {
      this.logger.warn(`Token refresh falhou: ${error.message}`);
      throw new UnauthorizedException('Token inválido');
    }
  }

  async forgotPassword(email: string) {
    this.logger.log(`Solicitação de reset de password para: ${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Retorna erro informando que o email não existe
      this.logger.warn(`Reset solicitado para email inexistente: ${email}`);
      throw new BadRequestException('Email não encontrado.');
    }

    // Verificar se o email foi verificado
    if (!user.emailVerified) {
      this.logger.warn(`Reset solicitado para email não verificado: ${email}`);
      throw new BadRequestException(
        'Email não verificado. Verifique o seu email antes de solicitar reset de password.',
      );
    }

    // Invalidar tokens existentes
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Criar novo token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    this.logger.log(`Token de reset criado para: ${email}`);

    // Retornar token para o front-end abrir modal de reset de senha
    return {
      success: true,
      message: 'Email encontrado. Pode redefinir a senha.',
      token,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    this.logger.log(`Tentativa de reset de password com token`);

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      this.logger.warn(`Token de reset inválido ou expirado`);
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Hash da nova password
    const hash = await bcrypt.hash(newPassword, this.SALT);

    // Atualizar password e marcar token como usado
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    this.logger.log(
      `Password resetada com sucesso para utilizador ID: ${resetToken.userId}`,
    );

    return { message: 'Password resetada com sucesso' };
  }

  private sign(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign(
      { sub: user.id },
      { secret: this.config.get('JWT_SECRET'), expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || undefined,
        role: user.role,
      },
    };
  }

  async testSmtpConnection() {
    try {
      const isConnected = await this.emailService.testConnection();
      if (isConnected) {
        return {
          success: true,
          message: 'Conexão SMTP testada com sucesso! ✅',
        };
      } else {
        return {
          success: false,
          message: 'Falha na conexão SMTP. Verifique as configurações. ❌',
        };
      }
    } catch (error) {
      this.logger.error('Erro ao testar conexão SMTP:', error);
      return {
        success: false,
        message: 'Erro interno ao testar SMTP',
      };
    }
  }

  async promoteUser(email: string, newRole: string, currentUser: any) {
    this.logger.log(
      `Tentativa de promoção para ${newRole}: ${email} por ${currentUser.email}`,
    );

    // Verificar se o utilizador atual é ADMIN
    if (currentUser.role !== 'ADMIN') {
      this.logger.warn(
        `Tentativa de promoção não autorizada por: ${currentUser.email}`,
      );
      throw new UnauthorizedException(
        'Apenas administradores podem promover utilizadores',
      );
    }

    // Verificar se a nova role é válida
    if (!['CAPTAIN', 'COMPANY_ADMIN'].includes(newRole)) {
      throw new BadRequestException(
        'Role inválida. Apenas CAPTAIN ou COMPANY_ADMIN são permitidas',
      );
    }

    // Encontrar utilizador a promover
    const userToPromote = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userToPromote) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    // Verificar se o email foi verificado
    if (!userToPromote.emailVerified) {
      throw new BadRequestException(
        'Utilizador deve verificar o email antes de ser promovido',
      );
    }

    // Não permitir promoção de outros ADMINs
    if (userToPromote.role === 'ADMIN') {
      throw new BadRequestException(
        'Não é possível alterar a role de outro administrador',
      );
    }

    // Atualizar role
    const updatedUser = await this.prisma.user.update({
      where: { id: userToPromote.id },
      data: { role: newRole as any },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(
      `Utilizador ${email} promovido para ${newRole} por ${currentUser.email}`,
    );

    return {
      message: `Utilizador promovido para ${newRole} com sucesso`,
      user: updatedUser,
    };
  }

  async demoteUser(email: string, currentUser: any) {
    this.logger.log(
      `Tentativa de rebaixamento para USER: ${email} por ${currentUser.email}`,
    );

    // Verificar se o utilizador atual é ADMIN
    if (currentUser.role !== 'ADMIN') {
      this.logger.warn(
        `Tentativa de rebaixamento não autorizada por: ${currentUser.email}`,
      );
      throw new UnauthorizedException(
        'Apenas administradores podem rebaixar utilizadores',
      );
    }

    // Encontrar utilizador a rebaixar
    const userToDemote = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userToDemote) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    // Não permitir rebaixamento de outros ADMINs
    if (userToDemote.role === 'ADMIN') {
      throw new BadRequestException(
        'Não é possível rebaixar outro administrador',
      );
    }

    // Já é USER
    if (userToDemote.role === 'USER') {
      throw new BadRequestException('Utilizador já tem role USER');
    }

    // Atualizar para USER
    const updatedUser = await this.prisma.user.update({
      where: { id: userToDemote.id },
      data: { role: 'USER' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(
      `Utilizador ${email} rebaixado para USER por ${currentUser.email}`,
    );

    return {
      message: 'Utilizador rebaixado para USER com sucesso',
      user: updatedUser,
    };
  }
}
