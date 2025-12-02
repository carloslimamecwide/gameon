import { IsEmail, MinLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email registrado do utilizador',
    example: 'carlos@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Password do utilizador',
    example: 'MinhaPassword123!',
    minLength: 6,
  })
  @IsString({ message: 'Password deve ser texto' })
  @MinLength(6, { message: 'Password deve ter pelo menos 6 caracteres' })
  @IsNotEmpty({ message: 'Password é obrigatória' })
  password: string;
}
