# Guia de Testes - Update e Delete de Utilizadores

## 🎯 Funcionalidades Implementadas

### ✅ **Update de Utilizador** (`PUT /users/:id`)

- **Próprio utilizador** pode atualizar: email, nome, password
- **ADMIN** pode atualizar: email, nome, password, role de qualquer utilizador
- Validações de segurança e unicidade de email

### ✅ **Delete de Utilizador** (`DELETE /users/:id`)

- **Apenas ADMIN** pode eliminar utilizadores
- Não pode eliminar a própria conta
- Confirmação de eliminação

## 🧪 Exemplos de Teste

### 1. Fazer Login como Utilizador Normal

### 1. Fazer Login como Utilizador Normal

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@example.com",
    "password": "SuaPassword123!"
  }'
```

### 2. Ver Próprio Perfil (qualquer utilizador)

```bash
# Guarda o token do login anterior
TOKEN="SEU_ACCESS_TOKEN_AQUI"

curl -X GET http://localhost:3001/users/me/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Tentar Ver Lista de Utilizadores (deve falhar se não for ADMIN)

```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer $TOKEN"
# Resposta esperada: 403 Forbidden
```

### 4. Atualizar Próprio Perfil (utilizador normal)

### 2. Atualizar Próprio Perfil (utilizador normal)

```bash
# Guarda o token do login anterior
TOKEN="SEU_ACCESS_TOKEN_AQUI"

curl -X PUT http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Novo Nome",
    "email": "novo-email@example.com"
  }'
```

### 5. Tentar Atualizar Role (deve falhar se não for ADMIN)

```bash
curl -X PUT http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "role": "ADMIN"
  }'
# Resposta esperada: 403 Forbidden
```

### 6. Login como ADMIN

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super.admin@gameapp.com",
    "password": "SuperAdmin123!"
  }'
```

### 7. Ver Lista de Utilizadores (como ADMIN)

```bash
# Guarda o token do ADMIN
ADMIN_TOKEN="TOKEN_DO_ADMIN_AQUI"

curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 8. Atualizar Qualquer Utilizador (como ADMIN)

```bash
# Guarda o token do ADMIN
ADMIN_TOKEN="TOKEN_DO_ADMIN_AQUI"

curl -X PUT http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Nome Atualizado pelo Admin",
    "role": "CAPTAIN"
  }'
```

### 9. Eliminar Utilizador (apenas ADMIN)

```bash
curl -X DELETE http://localhost:3001/users/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 10. Tentar Eliminar como Utilizador Normal (deve falhar)

```bash
curl -X DELETE http://localhost:3001/users/2 \
  -H "Authorization: Bearer $TOKEN"
# Resposta esperada: 403 Forbidden
```

## 📋 Validações de Segurança

### ✅ **Update de Utilizador**

- Só pode atualizar próprio perfil ou ser ADMIN
- Password só pode ser alterada pelo próprio utilizador
- Role só pode ser alterada por ADMIN
- Email deve ser único
- Validações de formato nos campos

### ✅ **Delete de Utilizador**

- Apenas ADMIN pode eliminar
- Não pode eliminar própria conta
- Utilizador deve existir

## 🌐 **Endpoints Disponíveis**

```
GET    /users/me/profile - Ver próprio perfil (qualquer utilizador)
GET    /users           - Listar utilizadores (apenas ADMIN)
GET    /users/:id       - Buscar utilizador (apenas ADMIN)
PUT    /users/:id       - Atualizar utilizador (próprio ou ADMIN)
DELETE /users/:id       - Eliminar utilizador (apenas ADMIN)
```

## 📚 **Documentação Swagger**

Acede a: **http://localhost:3001/api/docs**

Todos os novos endpoints estão documentados com:

- Descrições detalhadas
- Exemplos de request/response
- Códigos de status possíveis
- Esquemas de validação

## 🔐 **Regras de Permissão**

| Ação                       | Utilizador Normal | ADMIN |
| -------------------------- | ----------------- | ----- |
| Ver próprio perfil         | ✅                | ✅    |
| Ver lista utilizadores     | ❌                | ✅    |
| Ver perfil de outros       | ❌                | ✅    |
| Atualizar próprio perfil   | ✅                | ✅    |
| Atualizar qualquer perfil  | ❌                | ✅    |
| Alterar própria password   | ✅                | ✅    |
| Alterar password de outros | ❌                | ❌    |
| Alterar role               | ❌                | ✅    |
| Eliminar utilizadores      | ❌                | ✅    |
| Eliminar própria conta     | ❌                | ❌    |
