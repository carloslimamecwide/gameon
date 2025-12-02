# Guia de Verificação de Email - Game On

## 🎯 **Funcionalidade Implementada**

Sistema completo de verificação de email para novos utilizadores:

### ✅ **Fluxo de Verificação**

1. **Registo** → Conta criada mas **inativa**
2. **Email enviado** com token de verificação
3. **Verificação** → Conta **ativada** automaticamente
4. **Login** apenas após verificação

### ✅ **Novos Endpoints**

- `POST /auth/verify-email` - Verificar email com token
- `POST /auth/resend-verification` - Reenviar email de verificação

## 🧪 **Como Testar**

### 1. Registar Novo Utilizador

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "name": "Utilizador Teste",
    "password": "TestPassword123!"
  }'
```

**Resposta esperada:**

```json
{
  "message": "Utilizador criado com sucesso. Verifique o seu email para ativar a conta.",
  "userId": 4,
  "emailSent": true
}
```

### 2. Verificar Logs para Token (Desenvolvimento)

No terminal do servidor, verás:

```
=== EMAIL DE VERIFICAÇÃO (DESENVOLVIMENTO) ===
Para: teste@example.com
Nome: Utilizador Teste
Token: abc123def456...
URL: http://localhost:3001/auth/verify-email?token=abc123def456...
============================================
```

### 3. Tentar Login Antes da Verificação (deve falhar)

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "TestPassword123!"
  }'
```

**Resposta esperada: 401 Unauthorized**

```json
{
  "message": "Email não verificado. Verifique o seu email antes de fazer login.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 4. Verificar Email com Token

```bash
# Usar o token dos logs
curl -X POST http://localhost:3001/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_DOS_LOGS_AQUI"
  }'
```

**Resposta esperada:**

```json
{
  "message": "Email verificado com sucesso! Pode agora fazer login.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "email": "teste@example.com",
    "name": "Utilizador Teste",
    "role": "USER"
  }
}
```

### 5. Login Após Verificação (deve funcionar)

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "TestPassword123!"
  }'
```

### 6. Reenviar Email de Verificação (se necessário)

```bash
curl -X POST http://localhost:3001/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com"
  }'
```

## 🛡️ **Validações de Segurança**

### ✅ **Registo**

- Email deve ser único
- Password forte obrigatória
- Conta criada como **não verificada**
- Token único gerado automaticamente

### ✅ **Login**

- Credenciais devem estar corretas
- **Email deve estar verificado**
- Tokens apenas após verificação

### ✅ **Verificação**

- Token deve ser válido
- Token usado apenas uma vez
- Conta ativada automaticamente

## 🔧 **Configuração de Produção**

### Variáveis de Ambiente (.env)

```bash
# Para envio real de emails em produção
NODE_ENV="production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@gameapp.com"
```

### Em Desenvolvimento

- Emails são **simulados** (aparecem nos logs)
- Tokens mostrados no terminal
- URLs completas nos logs

### Em Produção

- Emails **enviados realmente**
- Tokens não mostrados nos logs
- URLs seguras

## 📊 **Estado da Base de Dados**

### Novos Campos na Tabela User:

- `emailVerified` (boolean) - Estado de verificação
- `emailVerificationToken` (string) - Token único para verificação

### Verificar Utilizadores:

```sql
SELECT id, email, name, emailVerified,
       emailVerificationToken IS NOT NULL as "tem_token"
FROM "User";
```

## 🌐 **Documentação Swagger**

Acede a: **http://localhost:3001/api/docs**

Todos os novos endpoints estão documentados:

- Exemplos de request/response
- Códigos de status
- Fluxo completo de verificação

## ⚡ **Resultado Final**

Agora o sistema tem:

- ✅ **Segurança**: Apenas emails verificados podem fazer login
- ✅ **Validação**: Confirma que o email existe e pertence ao utilizador
- ✅ **UX**: Processo claro com feedback adequado
- ✅ **Flexibilidade**: Reenvio de verificação se necessário
- ✅ **Logs**: Auditoria completa de tentativas de verificação
