import { IsNotEmpty, MinLength, Matches, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de reset recebido por email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Token deve ser texto' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @ApiProperty({
    description: 'Nova password forte com pelo menos 8 caracteres',
    example: 'NovaPassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Password deve ser texto' })
  @MinLength(8, { message: 'Password deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password deve conter pelo menos: 1 minúscula, 1 maiúscula, 1 número e 1 símbolo especial',
  })
  newPassword: string;
}
