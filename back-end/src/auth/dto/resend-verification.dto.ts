import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationDto {
  @ApiProperty({
    description: 'Email do utilizador para reenvio de verificação',
    example: 'carlos@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}
