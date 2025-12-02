# 🎭 Sistema de Roles - Game On

## 📋 **Visão Geral**

O sistema possui 4 roles com permissões específicas e regras de criação controladas:

### **🔐 Roles Disponíveis**

| Role              | Criação               | Permissões                       | Responsabilidades     |
| ----------------- | --------------------- | -------------------------------- | --------------------- |
| **USER**          | ✅ Registro público   | Participar em jogos, ver equipas | Jogador padrão        |
| **CAPTAIN**       | 🔄 Promoção por ADMIN | Criar e gerir equipas            | Líder de equipa       |
| **COMPANY_ADMIN** | 🔄 Promoção por ADMIN | Gerir campos e horários          | Gestor de instalações |
| **ADMIN**         | 🛠️ Script manual      | Controlo total do sistema        | Administrador         |

## 🚀 **Fluxo de Criação de Utilizadores**

### **1. Registro Público (USER)**

```json
POST /auth/register
{
  "email": "user@example.com",
  "name": "Nome User",
  "password": "Password123!"
}

Resultado: Role = USER (sempre)
```

### **2. Criação de ADMIN (Manual)**

```bash
# Executar script interativo
npm run create-admin

# Ou diretamente
npx ts-node create-admin-user.ts
```

### **3. Promoção para CAPTAIN/COMPANY_ADMIN**

```json
POST /auth/promote-user
Authorization: Bearer <admin-token>
{
  "email": "user@example.com",
  "role": "CAPTAIN"  // ou "COMPANY_ADMIN"
}
```

### **4. Rebaixamento para USER**

```json
POST /auth/demote-user
Authorization: Bearer <admin-token>
{
  "email": "captain@example.com"
}
```

## 🔒 **Regras de Segurança**

### **Criação de ADMIN**

- ❌ **Impossível via API**: Não há endpoint para criar ADMIN
- ✅ **Apenas por script**: Utilizador deve ter acesso ao servidor
- ✅ **Verificação manual**: Script interativo com validações
- ✅ **Email pré-verificado**: ADMIN criado já verificado

### **Promoção de Utilizadores**

- ✅ **Apenas ADMIN pode promover**: Guard com verificação de role
- ✅ **Email deve estar verificado**: Validação obrigatória
- ✅ **Roles limitadas**: Apenas CAPTAIN e COMPANY_ADMIN
- ❌ **Não pode promover outro ADMIN**: Proteção contra escalação

### **Rebaixamento de Utilizadores**

- ✅ **Apenas ADMIN pode rebaixar**: Controlo centralizado
- ❌ **Não pode rebaixar outro ADMIN**: Proteção de administradores
- ✅ **Apenas para USER**: Simplifica gestão de permissões

## 📊 **Hierarquia de Permissões**

```
ADMIN
├── Gerir todos os utilizadores
├── Promover/rebaixar qualquer utilizador
├── Acesso total ao sistema
└── Criar outros ADMINs (apenas via script)

COMPANY_ADMIN
├── Gerir campos desportivos
├── Definir horários disponíveis
├── Ver estatísticas de utilização
└── Gerir reservas

CAPTAIN
├── Criar equipas
├── Gerir membros da equipa
├── Organizar jogos
└── Definir estratégias

USER
├── Participar em jogos
├── Ver equipas e jogos
├── Avaliar outros jogadores
└── Ver estatísticas pessoais
```

## 🛡️ **Implementação de Segurança**

### **Guards Aplicados**

```typescript
// Apenas ADMIN
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')

// ADMIN ou CAPTAIN
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'CAPTAIN')

// Qualquer utilizador autenticado
@UseGuards(JwtAuthGuard)
```

### **Validações nos Services**

```typescript
// Verificar role do utilizador atual
if (currentUser.role !== 'ADMIN') {
  throw new UnauthorizedException('Apenas administradores...');
}

// Verificar email verificado
if (!userToPromote.emailVerified) {
  throw new BadRequestException('Utilizador deve verificar email...');
}

// Proteger outros ADMINs
if (userToPromote.role === 'ADMIN') {
  throw new BadRequestException('Não é possível alterar role de outro admin');
}
```

## 📝 **Endpoints de Gestão de Roles**

### **Promoção**

```http
POST /auth/promote-user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "user@example.com",
  "role": "CAPTAIN"
}
```

### **Rebaixamento**

```http
POST /auth/demote-user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "captain@example.com"
}
```

### **Listar Utilizadores (Admin)**

```http
GET /users
Authorization: Bearer <admin-token>
```

## 🎯 **Casos de Uso**

### **CAPTAIN - Criação de Equipa**

1. Utilizador registra como USER
2. Admin promove para CAPTAIN
3. CAPTAIN pode criar equipas
4. CAPTAIN gere membros da equipa

### **COMPANY_ADMIN - Gestão de Campos**

1. Empresa registra utilizador como USER
2. Admin promove para COMPANY_ADMIN
3. COMPANY_ADMIN gere campos e horários
4. Disponibiliza horários para reserva

### **Workflow Completo**

```
1. Registro público → USER
2. Verificação de email → Conta ativa
3. Admin promove → CAPTAIN/COMPANY_ADMIN
4. Utilizador ganha permissões específicas
5. Pode ser rebaixado se necessário
```

## ⚠️ **Limitações e Considerações**

### **Segurança**

- ✅ **ADMIN apenas via script**: Previne criação acidental
- ✅ **Email verificado obrigatório**: Evita contas inativas
- ✅ **Logging detalhado**: Rastreamento de todas as alterações
- ✅ **Rate limiting**: Proteção contra spam

### **Escalabilidade**

- 🔄 **Roles fixas**: Sistema não suporta roles dinâmicas
- 🔄 **Hierarquia simples**: Estrutura linear de permissões
- 🔄 **Admin único**: Pode ser expandido no futuro

## 🚀 **Status Atual**

- ✅ **Registro público**: Apenas USER
- ✅ **Promoção controlada**: Apenas por ADMIN
- ✅ **Criação de ADMIN**: Script manual seguro
- ✅ **Validações**: Email verificado obrigatório
- ✅ **Documentação**: Swagger atualizado
- ✅ **Logs**: Rastreamento completo

**Sistema de roles 100% funcional e seguro!** 🎭
