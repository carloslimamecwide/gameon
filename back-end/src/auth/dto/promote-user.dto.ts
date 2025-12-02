import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PromotableRole {
  CAPTAIN = 'CAPTAIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
}

export class PromoteUserDto {
  @ApiProperty({
    description: 'Email do utilizador a promover',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Deve fornecer um email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Nova role para o utilizador',
    enum: PromotableRole,
    example: PromotableRole.CAPTAIN,
  })
  @IsEnum(PromotableRole, {
    message: 'Role deve ser CAPTAIN ou COMPANY_ADMIN',
  })
  role: PromotableRole;
}
