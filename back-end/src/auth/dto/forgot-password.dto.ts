import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email do utilizador para envio do token de reset',
    example: 'carlos@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}
