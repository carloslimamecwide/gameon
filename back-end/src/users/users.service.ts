import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT = 12;

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    // Verificar se o utilizador existe
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    // Verificar permissões: só pode atualizar próprio perfil ou ser ADMIN
    if (currentUser.userId !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Não tem permissão para atualizar este utilizador',
      );
    }

    // Verificar se email já existe (se estiver a ser alterado)
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.name) updateData.name = updateUserDto.name;

    // Apenas o próprio utilizador pode alterar a password
    if (updateUserDto.password) {
      if (currentUser.userId !== id) {
        throw new ForbiddenException('Apenas pode alterar a própria password');
      }
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT,
      );
    }

    // Apenas ADMIN pode alterar roles
    if (updateUserDto.role) {
      if (currentUser.role !== 'ADMIN') {
        throw new ForbiddenException(
          'Apenas administradores podem alterar papéis',
        );
      }
      updateData.role = updateUserDto.role;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: number, currentUser: any) {
    // Apenas ADMIN pode eliminar utilizadores
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem eliminar utilizadores',
      );
    }

    // Verificar se o utilizador existe
    const userToDelete = await this.prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    // Impedir auto-eliminação
    if (currentUser.userId === id) {
      throw new ForbiddenException('Não pode eliminar a própria conta');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Utilizador eliminado com sucesso' };
  }
}
