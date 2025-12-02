# 🎮 Game On - Sistema de Gestão de Jogos

Sistema completo de gestão de jogos e equipas com autenticação segura, sistema de roles e gestão de utilizadores.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar base de dados
npx prisma migrate dev

# 3. Resetar DB e criar admin
npm run reset-db

# 4. Iniciar servidor
npm run start:dev
```

**🌐 Acesso:** http://localhost:3002  
**📚 Swagger:** http://localhost:3002/api/docs

## 👑 Credenciais de Admin

**📧 Email:** `developer.mecwide@gmail.com`  
**🔑 Password:** `AdminPassword123!`

## 🎭 Sistema de Roles

- **USER** - Jogador padrão (registro público)
- **CAPTAIN** - Criador e gestor de equipas
- **COMPANY_ADMIN** - Gestor de campos e horários
- **ADMIN** - Controlo total do sistema

## 📚 Documentação

- **[📖 Documentação Principal](DOCUMENTATION.md)** - Guia completo
- **[👑 Credenciais de Admin](ADMIN-CREDENTIALS.md)** - Informações de acesso
- **[🎭 Sistema de Roles](ROLES-SYSTEM-GUIDE.md)** - Guia de permissões
- **[📂 Guias Específicos](docs/)** - Documentação detalhada

## 🛠️ Scripts Disponíveis

```bash
npm run start:dev      # Servidor desenvolvimento
npm run build          # Build produção
npm run reset-db       # Reset DB + criar admin
npm run create-admin   # Criar admin adicional
npm run test           # Executar testes
```

## 🔒 Funcionalidades de Segurança

- ✅ JWT com refresh tokens
- ✅ Rate limiting multinível
- ✅ Verificação de email obrigatória
- ✅ Role-based access control
- ✅ Password hashing seguro
- ✅ Validação e sanitização de input

## 🗄️ Tecnologias

- **Backend:** NestJS + TypeScript
- **Base de Dados:** PostgreSQL + Prisma
- **Autenticação:** JWT + Passport
- **Email:** Nodemailer + Gmail
- **Documentação:** Swagger UI
- **Validação:** class-validator

## 📧 Configuração de Email

Para emails reais, configure no `.env`:

```env
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password-16-digitos"
FROM_EMAIL="seu-email@gmail.com"
```

## 🎯 Status do Projeto

- ✅ **Autenticação completa** - Login, registro, verificação
- ✅ **Sistema de roles** - USER, CAPTAIN, COMPANY_ADMIN, ADMIN
- ✅ **Gestão de utilizadores** - CRUD completo com permissões
- ✅ **Reset de password** - Fluxo completo via email
- ✅ **Documentação** - Swagger UI + guias detalhados
- 🔄 **Gestão de equipas** - Em desenvolvimento
- 🔄 **Sistema de jogos** - Em desenvolvimento

---

**🚀 Sistema pronto para produção!**
DATABASE_URL="postgresql://playuser:playpass@localhost:5432/playdb?schema=public" npx prisma studio
