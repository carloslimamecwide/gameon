import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email válido do utilizador',
    example: 'carlos@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Nome completo do utilizador',
    example: 'Carlos Lima',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({
    description:
      'Password forte com pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo',
    example: 'MinhaPassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Password deve ser texto' })
  @MinLength(8, { message: 'Password deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password deve conter pelo menos: 1 minúscula, 1 maiúscula, 1 número e 1 símbolo especial',
  })
  password: string;
}
