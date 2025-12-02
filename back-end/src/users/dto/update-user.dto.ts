import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  CAPTAIN = 'CAPTAIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  ADMIN = 'ADMIN',
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email válido do utilizador',
    example: 'carlos.novo@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nome completo do utilizador',
    example: 'Carlos Lima Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser texto' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone do utilizador',
    example: '+351912345678',
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser texto' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Nova password (apenas para o próprio utilizador)',
    example: 'NovaPassword123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'Password deve ser texto' })
  @MinLength(8, { message: 'Password deve ter pelo menos 8 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Papel do utilizador no sistema (apenas ADMIN pode alterar)',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel deve ser um dos valores válidos' })
  role?: UserRole;
}
