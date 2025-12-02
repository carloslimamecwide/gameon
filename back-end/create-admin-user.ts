import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();
const SALT = 12;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createAdminUser() {
  console.log('🔐 Criação de Utilizador Administrador');
  console.log('====================================\n');

  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('⚠️  Já existe um utilizador ADMIN no sistema:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nome: ${existingAdmin.name}`);
      console.log(`   Criado em: ${existingAdmin.createdAt}`);

      const overwrite = await question(
        '\n❓ Deseja criar outro administrador? (s/N): ',
      );
      if (
        overwrite.toLowerCase() !== 's' &&
        overwrite.toLowerCase() !== 'sim'
      ) {
        console.log('❌ Operação cancelada.');
        return;
      }
    }

    // Coletar dados do novo admin
    const email = await question('📧 Email do administrador: ');
    const name = await question('👤 Nome completo: ');
    const password = await question('🔑 Password (min. 8 caracteres): ');

    // Validações básicas
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!name || name.length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!password || password.length < 8) {
      throw new Error('Password deve ter pelo menos 8 caracteres');
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Este email já está registrado no sistema');
    }

    // Criar hash da password
    const hashedPassword = await bcrypt.hash(password, SALT);

    // Criar utilizador admin
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true, // Admin já verificado
        emailVerificationToken: null,
      },
    });

    console.log('\n✅ Utilizador administrador criado com sucesso!');
    console.log('===============================================');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Nome: ${adminUser.name}`);
    console.log(`🎭 Role: ${adminUser.role}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`📅 Criado em: ${adminUser.createdAt}`);
    console.log('\n🔐 O administrador pode agora:');
    console.log('   • Fazer login normalmente');
    console.log('   • Promover utilizadores para CAPTAIN ou COMPANY_ADMIN');
    console.log('   • Rebaixar utilizadores para USER');
    console.log('   • Gerir todos os utilizadores do sistema');
  } catch (error) {
    console.error('\n❌ Erro ao criar administrador:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { createAdminUser };
