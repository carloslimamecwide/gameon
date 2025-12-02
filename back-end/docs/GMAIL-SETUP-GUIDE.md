# Configuração Gmail para Envio de Emails - Game On

## 🔧 **Passos para Configurar Gmail**

### 1. **Ativar Autenticação de 2 Fatores**

1. Vai às **Definições da Conta Google**
2. Clica em **Segurança**
3. Ativa a **Verificação em 2 passos**

### 2. **Gerar Password de Aplicação**

1. Nas **Definições de Segurança**
2. Clica em **Passwords de aplicações**
3. Seleciona **Aplicação personalizada**
4. Dá o nome "Game On API"
5. **Copia a password gerada** (16 caracteres)

### 3. **Configurar .env**

```bash
# Email Configuration - Gmail
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="teu-email@gmail.com"
SMTP_PASS="abcd efgh ijkl mnop"  # Password de aplicação
FROM_EMAIL="teu-email@gmail.com"
```

### 4. **Verificar Configuração Atual**

No arquivo `.env` tens:

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="carloslima.dev@gmail.com"
SMTP_PASS="rxtk ptrv sssn tvdg"
FROM_EMAIL="carloslima.dev@gmail.com"
```

## 🧪 **Testar Envio Real**

### 1. Registar Novo Utilizador

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-destino@example.com",
    "name": "Teste Gmail",
    "password": "TestGmail123!"
  }'
```

### 2. Verificar Logs do Servidor

Se estiver configurado corretamente, verás:

```
[EmailService] Transporter SMTP configurado para envio real de emails
[EmailService] Email de verificação enviado para: email-destino@example.com
```

Se houver erro, verás:

```
[EmailService] Erro ao enviar email para email-destino@example.com: [detalhes do erro]
```

## 🔍 **Problemas Comuns e Soluções**

### **Erro: "Invalid login"**

- ✅ Verificar se a **autenticação de 2 fatores** está ativa
- ✅ Usar **password de aplicação**, não a password normal
- ✅ Email correto no `SMTP_USER`

### **Erro: "Connection timeout"**

- ✅ Verificar `SMTP_HOST="smtp.gmail.com"`
- ✅ Verificar `SMTP_PORT=587`
- ✅ Verificar ligação à internet

### **Erro: "Authentication failed"**

- ✅ **Regenerar password de aplicação**
- ✅ Verificar se não há espaços extra na password
- ✅ Email e password correspondem à mesma conta

### **Emails não chegam**

- ✅ Verificar **pasta SPAM** do destinatário
- ✅ Verificar se o email remetente não está bloqueado
- ✅ Tentar com email diferente

## 📧 **Template de Email**

O sistema envia emails HTML com:

- **Cabeçalho** com nome da aplicação
- **Botão** de verificação destacado
- **Link alternativo** para copiar/colar
- **Informação de expiração**
- **Aviso de segurança**

## 🛠️ **Debug e Monitorização**

### Verificar Status do Transporter

No log, procura por:

```
[EmailService] Transporter SMTP configurado para envio real de emails
```

### Verificar Envio Específico

```
[EmailService] Email de verificação enviado para: email@example.com
```

### Verificar Erros

```
[EmailService] Erro ao enviar email para email@example.com: Error: ...
```

## 🔄 **Alternar entre Modos**

### Modo Desenvolvimento (Simulação)

```bash
# .env
NODE_ENV="development"
# ou remover/comentar SMTP_USER e SMTP_PASS
```

### Modo Produção (Envio Real)

```bash
# .env
SMTP_USER="teu-email@gmail.com"
SMTP_PASS="password-de-aplicacao"
```

## ✅ **Checklist de Configuração**

- [ ] Autenticação de 2 fatores ativa no Gmail
- [ ] Password de aplicação gerada
- [ ] `.env` com configurações corretas
- [ ] Servidor reiniciado após mudanças
- [ ] Log mostra "Transporter SMTP configurado"
- [ ] Teste de envio realizado
- [ ] Email recebido (verificar SPAM)
