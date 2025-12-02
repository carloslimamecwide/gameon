# 🔧 Guia de Resolução - Links de Email e Swagger

## ✅ **Problemas Corrigidos**

### **1. Link do Email Quebrado**

- ✅ **URL dinâmica**: Agora usa `APP_URL` ou fallback para `localhost:PORT`
- ✅ **Endpoint GET**: Adicionado `/auth/verify-email` via GET para links diretos
- ✅ **Instruções no email**: Email agora inclui instruções para usar o Swagger
- ✅ **Layout melhorado**: Token destacado visualmente no email

### **2. Swagger não aceita Token JWT**

- ✅ **Bearer Auth corrigido**: Nome padronizado para `bearer`
- ✅ **Headers corretos**: `Authorization: Bearer <token>`
- ✅ **Configuração melhorada**: Swagger com persistência de autorização
- ✅ **Interface otimizada**: Melhor UX no Swagger UI

## 🚀 **Como Testar Agora**

### **Método 1: Via Link do Email**

1. Registre um utilizador
2. Copie o link do email
3. Cole no navegador
4. ✅ Verificação automática

### **Método 2: Via Swagger (Manual)**

1. Acesse: `http://localhost:3000/api/docs`
2. Use o endpoint `POST /auth/verify-email`
3. Cole o token do email
4. ✅ Verificação manual

### **Método 3: Via Swagger (Autenticado)**

1. Faça login em `POST /auth/login`
2. Copie o `accessToken`
3. Clique em **🔒 Authorize** no topo do Swagger
4. Cole: `Bearer <seu-access-token>`
5. ✅ Agora pode usar endpoints protegidos

## 🔑 **Como Usar Autenticação no Swagger**

### **Passo a Passo:**

```
1. Login -> POST /auth/login
   {
     "email": "seu@email.com",
     "password": "suasenha"
   }

2. Copiar accessToken da resposta:
   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

3. Clicar no botão "🔒 Authorize" no topo do Swagger

4. Inserir no campo:
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

5. Clicar "Authorize"

6. ✅ Agora todos os endpoints protegidos funcionam!
```

## 📧 **Configuração de Email**

### **Criar .env com suas credenciais:**

```env
# Copie .env.example para .env
cp .env.example .env

# Configure suas credenciais Gmail:
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password-16-digitos"
FROM_EMAIL="seu-email@gmail.com"
APP_URL="http://localhost:3000"
```

### **Como obter App Password do Gmail:**

1. Ative autenticação de 2 fatores
2. Vá em: Conta Google > Segurança > App Passwords
3. Gere password para "Mail"
4. Use essa password de 16 dígitos no .env

## 🔍 **Teste de Conectividade**

### **Verificar se email funciona:**

```bash
# No Swagger, use:
POST /auth/test-smtp

# Deve retornar:
{
  "success": true,
  "message": "Conexão SMTP testada com sucesso! ✅"
}
```

## 🐛 **Troubleshooting**

### **Email não chega:**

- ✅ Verifique .env com suas credenciais
- ✅ Use `POST /auth/test-smtp` para testar
- ✅ Confira spam/lixo eletrônico
- ✅ Verify App Password tem 16 dígitos

### **Swagger não autoriza:**

- ✅ Use exatamente: `Bearer <token>`
- ✅ Token deve começar com `eyJ`
- ✅ Não inclua aspas no token
- ✅ Clique "Authorize" após inserir

### **Link quebrado:**

- ✅ Configure `APP_URL` no .env
- ✅ Use endpoint GET ou POST
- ✅ Token deve estar na URL ou body

---

## 🎯 **Status Atual**

- ✅ **Email**: Links funcionais + instruções claras
- ✅ **Swagger**: Autenticação JWT 100% funcional
- ✅ **Endpoints**: GET e POST para verificação
- ✅ **Documentação**: Guias claros e exemplos

**Tudo corrigido e testado!** 🚀
