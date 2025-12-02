# 🚀 Base de Dados Resetada - Game On

## ✅ **Operação Concluída com Sucesso!**

### **🗑️ Base de Dados Limpa:**

- ✅ Todas as tabelas foram limpas
- ✅ Sequências foram resetadas (IDs começam em 1)
- ✅ Dados antigos completamente removidos

### **👑 Administrador Criado:**

**📧 Email:** `developer.mecwide@gmail.com`  
**👤 Nome:** `Developer MecWide`  
**🔑 Password:** `AdminPassword123!`  
**🎭 Role:** `ADMIN`  
**🆔 ID:** `1`  
**✅ Status:** Email já verificado

---

## 🚀 **Servidor Ativo**

**🌐 URL:** http://localhost:3002  
**📚 Swagger:** http://localhost:3002/api/docs  
**⚡ Status:** ✅ Funcionando

---

## 🔐 **Como Fazer Login**

### **1. Via Swagger (Recomendado)**

1. Acesse: http://localhost:3002/api/docs
2. Vá para `POST /auth/login`
3. Use as credenciais:
   ```json
   {
     "email": "developer.mecwide@gmail.com",
     "password": "AdminPassword123!"
   }
   ```
4. Copie o `accessToken` da resposta
5. Clique em **🔒 Authorize** no topo
6. Digite: `Bearer <seu-access-token>`
7. ✅ Agora pode usar todos os endpoints!

### **2. Resposta Esperada do Login:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "developer.mecwide@gmail.com",
    "name": "Developer MecWide",
    "role": "ADMIN"
  }
}
```

---

## 🎭 **Funcionalidades de ADMIN Disponíveis**

### **Gestão de Utilizadores:**

- `GET /users` - Listar todos os utilizadores
- `GET /users/me/profile` - Ver próprio perfil
- `POST /auth/promote-user` - Promover USER para CAPTAIN/COMPANY_ADMIN
- `POST /auth/demote-user` - Rebaixar para USER

### **Exemplo de Promoção:**

```json
POST /auth/promote-user
{
  "email": "user@example.com",
  "role": "CAPTAIN"
}
```

### **Exemplo de Rebaixamento:**

```json
POST /auth/demote-user
{
  "email": "captain@example.com"
}
```

---

## 🔒 **Próximos Passos de Segurança**

### **1. Alterar Password (Recomendado)**

```json
POST /auth/forgot-password
{
  "email": "developer.mecwide@gmail.com"
}
```

_Em desenvolvimento, o token aparecerá no console_

### **2. Criar Utilizadores de Teste**

1. Registre alguns utilizadores USER normalmente
2. Use o endpoint de promoção para testar roles
3. Teste todas as funcionalidades

### **3. Configurar Email (Opcional)**

Se quiser emails reais, configure no `.env`:

```env
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password-16-digitos"
FROM_EMAIL="seu-email@gmail.com"
```

---

## 📊 **Status do Sistema**

### **✅ Funcionando:**

- Autenticação JWT completa
- Sistema de roles (USER, CAPTAIN, COMPANY_ADMIN, ADMIN)
- Verificação de email
- Reset de password
- Rate limiting
- Validações de segurança
- Swagger UI funcional

### **🔄 Para Testar:**

- Registros públicos (sempre USER)
- Promoção de utilizadores
- Login/logout
- Endpoints protegidos
- Gestão de perfis

---

## 🛠️ **Scripts Disponíveis**

```bash
# Servidor desenvolvimento
npm run start:dev

# Resetar DB + criar admin
npm run reset-db

# Criar admin adicional
npm run create-admin

# Build produção
npm run build
npm run start:prod
```

---

## 📝 **Credenciais Resumidas**

**Email:** `developer.mecwide@gmail.com`  
**Password:** `AdminPassword123!`  
**Swagger:** http://localhost:3002/api/docs

**🎯 Tudo pronto para uso!** 🚀
