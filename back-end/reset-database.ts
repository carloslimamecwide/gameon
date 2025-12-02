import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT = 12;

async function resetDatabaseAndCreateAdmin() {
  console.log('🗑️  Limpando base de dados...');
  console.log('============================\n');

  try {
    // Limpar todas as tabelas na ordem correta (respeitando foreign keys)
    console.log('🔄 Apagando dados das tabelas...');

    await prisma.gamePlayers.deleteMany({});
    console.log('   ✅ GamePlayers limpa');

    await prisma.game.deleteMany({});
    console.log('   ✅ Games limpa');

    await prisma.passwordResetToken.deleteMany({});
    console.log('   ✅ PasswordResetTokens limpa');

    await prisma.team.deleteMany({});
    console.log('   ✅ Teams limpa');

    await prisma.user.deleteMany({});
    console.log('   ✅ Users limpa');

    console.log('\n🔄 Resetando sequências...');

    // Reset das sequências (auto-increment) no PostgreSQL
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Team_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Game_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "GamePlayers_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "PasswordResetToken_id_seq" RESTART WITH 1;`;

    console.log('   ✅ Sequências resetadas');

    console.log('\n👑 Criando administrador...');
    console.log('===========================');

    // Dados do admin
    const adminEmail = 'developer.mecwide@gmail.com';
    const adminName = 'Developer MecWide';
    const adminPassword = 'AdminPassword123!'; // Password temporária

    // Hash da password
    const hashedPassword = await bcrypt.hash(adminPassword, SALT);

    // Criar utilizador admin
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true, // Admin já verificado
        emailVerificationToken: null,
      },
    });

    console.log('✅ Base de dados resetada e administrador criado!');
    console.log('================================================');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Nome: ${adminUser.name}`);
    console.log(`🎭 Role: ${adminUser.role}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`📅 Criado em: ${adminUser.createdAt}`);
    console.log(`🔑 Password temporária: ${adminPassword}`);
    console.log('\n🔐 Próximos passos:');
    console.log('   1. Faça login com as credenciais acima');
    console.log('   2. Altere a password imediatamente');
    console.log('   3. Comece a criar outros utilizadores');
    console.log('\n🚀 Sistema pronto para uso!');
  } catch (error) {
    console.error('\n❌ Erro durante o reset:', error);

    if (
      error.message.includes('relation') &&
      error.message.includes('does not exist')
    ) {
      console.log('\n💡 Parece que as tabelas não existem ainda.');
      console.log('   Execute primeiro: npx prisma migrate dev');
      console.log('   Depois execute novamente este script.');
    }

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  resetDatabaseAndCreateAdmin().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { resetDatabaseAndCreateAdmin };
