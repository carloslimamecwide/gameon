# 🎮 Game On - Documentação Principal

## 📋 **Visão Geral**

Sistema completo de gestão de jogos e equipas com autenticação segura e sistema de roles hierárquico.

---

## 🚀 **Quick Start**

### **1. Setup Inicial**

```bash
# Instalar dependências
npm install

# Configurar base de dados
npx prisma migrate dev

# Resetar DB e criar admin
npm run reset-db

# Iniciar servidor
npm run start:dev
```

### **2. Credenciais de Admin**

**📧 Email:** `developer.mecwide@gmail.com`  
**🔑 Password:** `AdminPassword123!`  
**🌐 Swagger:** http://localhost:3002/api/docs

---

## 🎭 **Sistema de Roles**

| Role              | Criação            | Permissões              |
| ----------------- | ------------------ | ----------------------- |
| **USER**          | Registro público   | Participar em jogos     |
| **CAPTAIN**       | Promoção por ADMIN | Criar e gerir equipas   |
| **COMPANY_ADMIN** | Promoção por ADMIN | Gerir campos e horários |
| **ADMIN**         | Script manual      | Controlo total          |

### **Fluxo de Criação:**

```
1. POST /auth/register → USER (sempre)
2. POST /auth/verify-email → Ativar conta
3. ADMIN promove → CAPTAIN/COMPANY_ADMIN
```

---

## 🔐 **Autenticação**

### **Registro:**

```json
POST /auth/register
{
  "email": "user@example.com",
  "name": "Nome User",
  "password": "Password123!"
}
```

### **Login:**

```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### **Verificação de Email:**

```json
POST /auth/verify-email
{
  "token": "token-do-email"
}
```

### **Reset de Password:**

```json
POST /auth/forgot-password
{
  "email": "user@example.com"
}

POST /auth/reset-password
{
  "token": "token-do-email",
  "newPassword": "NovaPassword123!"
}
```

---

## 👥 **Gestão de Utilizadores (ADMIN)**

### **Promoção:**

```json
POST /auth/promote-user
Authorization: Bearer <admin-token>
{
  "email": "user@example.com",
  "role": "CAPTAIN"
}
```

### **Rebaixamento:**

```json
POST /auth/demote-user
Authorization: Bearer <admin-token>
{
  "email": "captain@example.com"
}
```

### **Listar Utilizadores:**

```json
GET /users
Authorization: Bearer <admin-token>
```

---

## 📧 **Configuração de Email**

### **Gmail Setup:**

1. Ativar autenticação de 2 fatores
2. Gerar App Password (16 dígitos)
3. Configurar no `.env`:

```env
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password-16-digitos"
FROM_EMAIL="seu-email@gmail.com"
```

### **Testar SMTP:**

```json
POST /auth/test-smtp
```

---

## 🔒 **Segurança**

### **Implementadas:**

- ✅ JWT com refresh tokens
- ✅ Rate limiting (múltiplos níveis)
- ✅ Password hashing (bcrypt salt=12)
- ✅ Email verification obrigatório
- ✅ Role-based access control
- ✅ Input validation & sanitization
- ✅ Logging de eventos de segurança

### **Configuração Produção:**

```env
NODE_ENV="production"
JWT_SECRET="chave-super-secreta-32-chars-minimum"
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

---

## 🗄️ **Base de Dados**

### **Modelos Principais:**

- **User**: Utilizadores com roles
- **Team**: Equipas criadas por CAPTAINs
- **Game**: Jogos entre equipas
- **GamePlayers**: Jogadores por jogo
- **PasswordResetToken**: Tokens de reset

### **Scripts Úteis:**

```bash
# Reset completo da DB + criar admin
npm run reset-db

# Criar admin adicional
npm run create-admin

# Migrations
npx prisma migrate dev
npx prisma generate
```

---

## 🛠️ **Desenvolvimento**

### **Scripts Disponíveis:**

```bash
npm run start:dev      # Servidor desenvolvimento
npm run build          # Build produção
npm run test           # Testes
npm run lint           # Linting
npm run format         # Formatting
```

### **Estrutura do Projeto:**

```
src/
├── auth/              # Autenticação e autorização
├── users/             # Gestão de utilizadores
├── email/             # Serviço de email
├── app.module.ts      # Módulo principal
└── main.ts            # Entry point

prisma/
└── schema.prisma      # Schema da base de dados
```

---

## 🚨 **Troubleshooting**

### **Email não chega:**

- Verificar configuração SMTP no `.env`
- Usar `POST /auth/test-smtp`
- Verificar pasta spam

### **Swagger não autoriza:**

- Formato: `Bearer <token>`
- Clicar "🔒 Authorize" após login
- Token deve começar com `eyJ`

### **Erro de base de dados:**

- Verificar `DATABASE_URL`
- Executar `npx prisma migrate dev`
- Verificar se PostgreSQL está ativo

---

## 📚 **API Reference**

**Swagger UI:** http://localhost:3002/api/docs

### **Principais Endpoints:**

#### **Autenticação:**

- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `POST /auth/verify-email` - Verificar email
- `POST /auth/forgot-password` - Solicitar reset
- `POST /auth/reset-password` - Confirmar reset

#### **Utilizadores:**

- `GET /users` - Listar (ADMIN)
- `GET /users/me/profile` - Próprio perfil
- `PUT /users/:id` - Atualizar
- `DELETE /users/:id` - Eliminar (ADMIN)

#### **Gestão de Roles:**

- `POST /auth/promote-user` - Promover (ADMIN)
- `POST /auth/demote-user` - Rebaixar (ADMIN)

---

## 🎯 **Próximas Funcionalidades**

### **Em Desenvolvimento:**

- Gestão de equipas (CAPTAIN)
- Sistema de jogos
- Avaliação de jogadores
- Gestão de campos (COMPANY_ADMIN)
- Dashboard administrativo

### **Futuras Melhorias:**

- Notificações em tempo real
- Sistema de ranking
- Estatísticas avançadas
- Mobile app
- Integração com calendários

---

**🎮 Game On - Sistema pronto para produção!** 🚀
