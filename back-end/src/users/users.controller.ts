import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Listar todos os utilizadores (apenas ADMIN)',
    description:
      'Retorna lista de todos os utilizadores registados (apenas administradores)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de utilizadores retornada com sucesso',
    schema: {
      example: [
        {
          id: 1,
          email: 'carlos@example.com',
          name: 'Carlos Lima',
          role: 'USER',
          createdAt: '2025-11-02T18:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas administradores',
  })
  all() {
    return this.users.findAll();
  }

  @Get('me/profile')
  @ApiOperation({
    summary: 'Ver próprio perfil',
    description: 'Retorna os dados do utilizador autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do utilizador',
    schema: {
      example: {
        id: 1,
        email: 'carlos@example.com',
        name: 'Carlos Lima',
        role: 'USER',
        createdAt: '2025-11-02T18:00:00.000Z',
        updatedAt: '2025-11-02T18:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  getProfile(@CurrentUser() user: any) {
    return this.users.findOne(user.userId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Buscar utilizador por ID (apenas ADMIN)',
    description:
      'Retorna os dados de um utilizador específico (apenas administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do utilizador',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Utilizador encontrado',
    schema: {
      example: {
        id: 1,
        email: 'carlos@example.com',
        name: 'Carlos Lima',
        role: 'USER',
        createdAt: '2025-11-02T18:00:00.000Z',
        updatedAt: '2025-11-02T18:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas administradores',
  })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  one(@Param('id') id: string) {
    return this.users.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar utilizador',
    description:
      'Permite ao utilizador atualizar o próprio perfil ou ADMIN atualizar qualquer utilizador',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do utilizador a atualizar',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização (todos os campos são opcionais)',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilizador atualizado com sucesso',
    schema: {
      example: {
        id: 1,
        email: 'carlos.novo@example.com',
        name: 'Carlos Lima Silva',
        role: 'USER',
        createdAt: '2025-11-02T18:00:00.000Z',
        updatedAt: '2025-11-02T19:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já em uso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar este utilizador',
  })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.users.update(Number(id), updateUserDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Eliminar utilizador (apenas ADMIN)',
    description:
      'Remove um utilizador do sistema. Apenas administradores podem executar esta ação.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do utilizador a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Utilizador eliminado com sucesso',
    schema: {
      example: {
        message: 'Utilizador eliminado com sucesso',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem eliminar utilizadores',
  })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.users.remove(Number(id), user);
  }
}
