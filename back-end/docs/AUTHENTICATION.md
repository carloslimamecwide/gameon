# Game On - Sistema de Autenticação Completo

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação Robusto

- **Registro de utilizadores** com validações avançadas
- **Login seguro** com JWT tokens
- **Refresh tokens** para renovação automática
- **Reset de password** com tokens seguros
- **Rate limiting** para prevenir ataques
- **Logging completo** de ações de segurança

### ✅ Segurança Avançada

- **Passwords fortes** obrigatórias (mínimo 8 caracteres + maiúscula + minúscula + número + símbolo)
- **Rate limiting** por endpoint:
  - Login: 5 tentativas por 5 minutos
  - Registro: 3 tentativas por 5 minutos
  - Reset password: 2 tentativas por 10 minutos
- **Tokens seguros** com expiração (15 min para access, 7 dias para refresh)
- **Salt forte** (bcrypt com 12 rounds)

### ✅ Documentação Swagger Completa

- **Documentação interativa** em `/api/docs`
- **Exemplos** para todos os endpoints
- **Esquemas** detalhados de request/response
- **Autenticação Bearer** configurada

## 🌐 Endpoints Disponíveis

### Públicos (sem autenticação)

- `GET /` - Página inicial
- `POST /auth/register` - Registrar novo utilizador
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar token
- `POST /auth/forgot-password` - Solicitar reset de password
- `POST /auth/reset-password` - Confirmar reset de password

### Protegidos (requer JWT token)

- `GET /users` - Listar todos os utilizadores
- `GET /users/:id` - Buscar utilizador por ID

## 🔧 Como Usar

### 1. Aplicação em execução

A aplicação está rodando em: **http://localhost:3001**

### 2. Documentação Swagger

Acesse: **http://localhost:3001/api/docs**

### 3. Exemplos de Uso

#### Registrar novo utilizador

```bash
curl -X POST http://localhost:3001/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "carlos@example.com",
    "name": "Carlos Lima",
    "password": "MinhaPassword123!"
  }'
```

#### Fazer login

```bash
curl -X POST http://localhost:3001/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "carlos@example.com",
    "password": "MinhaPassword123!"
  }'
```

#### Solicitar reset de password (em desenvolvimento retorna o token)

```bash
curl -X POST http://localhost:3001/auth/forgot-password \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "carlos@example.com"
  }'
```

#### Confirmar reset de password

```bash
curl -X POST http://localhost:3001/auth/reset-password \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "TOKEN_RECEBIDO_DO_ENDPOINT_ANTERIOR",
    "newPassword": "NovaPassword123!"
  }'
```

#### Acessar dados protegidos

```bash
# Primeiro faça login para obter o token
# Depois use o token nos headers
curl -X GET http://localhost:3001/users \\
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

## 📋 Validações Implementadas

### Password Segura

- Mínimo 8 caracteres
- Pelo menos 1 letra minúscula
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 símbolo especial (@$!%\*?&)

### Email

- Formato válido obrigatório
- Verificação de unicidade

### Rate Limiting

- Proteção contra ataques de força bruta
- Limites específicos por endpoint
- Headers informativos sobre limites

## 🔒 Recursos de Segurança

1. **Tokens JWT** com expiração curta (15 min)
2. **Refresh tokens** para renovação (7 dias)
3. **Password hashing** com bcrypt (12 rounds)
4. **Rate limiting** global e por endpoint
5. **Validação rigorosa** de inputs
6. **Logging** de todas as ações de segurança
7. **Tokens de reset** com expiração (15 min)
8. **Invalidação automática** de tokens usados

## 🎯 Próximos Passos Sugeridos

1. **Configurar SMTP** para envio real de emails
2. **Implementar 2FA** para segurança extra
3. **Adicionar módulos Teams e Games** conforme schema Prisma
4. **Implementar middleware de auditoria**
5. **Configurar monitorização** (logs, métricas)
6. **Adicionar testes** unitários e e2e

## 🔧 Configurações Importantes

### Variáveis de Ambiente (.env)

```
DATABASE_URL="postgresql://playuser:playpass@localhost:5432/playdb?schema=public"
JWT_SECRET="muda_este_seguro_em_prod"
APP_URL="http://localhost:3001"
PORT=3001
NODE_ENV="development"
```

### Base de Dados

- PostgreSQL configurado e sincronizado
- Schema Prisma com relacionamentos corretos
- Tabelas para users, teams, games, tokens de reset

Agora tens um sistema de autenticação completo, seguro e bem documentado! 🚀
