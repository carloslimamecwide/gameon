# 🔒 Recomendações de Segurança - Game On

## 1. **Implementações Críticas em Falta**

### **CORS Configuration**

```typescript
// main.ts - Adicionar configuração CORS
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### **Helmet para Headers de Segurança**

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';
app.use(helmet());
```

### **Input Sanitization**

```bash
npm install class-sanitizer
```

### **JWT Secret Validation**

```typescript
// jwt.strategy.ts - CRÍTICO: usar ConfigService
constructor(private configService: ConfigService) {
  const secret = configService.get('JWT_SECRET');
  if (!secret || secret === 'dev') {
    throw new Error('JWT_SECRET deve ser definido em produção');
  }
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: secret,
  });
}
```

## 2. **Variáveis de Ambiente Seguras**

### **Criar .env com valores seguros:**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gameon"

# JWT - GERAR SECRET FORTE
JWT_SECRET="super-secret-key-minimum-32-chars-long-random-string"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App
NODE_ENV="production"
PORT=3000
APP_URL="https://yourdomain.com"

# CORS
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

## 3. **Rate Limiting Específico**

### **Proteger endpoints críticos:**

```typescript
// auth.controller.ts
@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 tentativas por minuto
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // ...
}

@Throttle({ default: { limit: 2, ttl: 300000 } }) // 2 tentativas por 5 minutos
@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  // ...
}
```

## 4. **Auditoria e Monitoramento**

### **Logger mais detalhado:**

```typescript
// Adicionar ao auth.service.ts
private logSecurityEvent(event: string, email: string, ip?: string) {
  this.logger.warn(`SECURITY: ${event} - Email: ${email} - IP: ${ip}`);
}
```

### **IP Tracking:**

```typescript
// Capturar IP nas tentativas de login
async login(email: string, password: string, ip: string) {
  // ... existing code
  if (!user) {
    this.logSecurityEvent('FAILED_LOGIN', email, ip);
    throw new UnauthorizedException('Credenciais inválidas');
  }
}
```

## 5. **Validação de Passwords**

### **Password Policy:**

```typescript
// dto/register.dto.ts
@IsStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}, { message: 'Password deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo' })
password: string;
```

## 6. **Session Management**

### **Logout e Blacklist:**

```typescript
// Implementar blacklist de tokens JWT
// Adicionar tabela TokenBlacklist no Prisma
model TokenBlacklist {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## 7. **HTTPS e SSL**

### **Produção:**

- ✅ **SSL/TLS** obrigatório
- ✅ **HTTP Strict Transport Security (HSTS)**
- ✅ **Certificate pinning** se possível

## 8. **Database Security**

### **Prisma Security:**

```typescript
// prisma.service.ts - Adicionar middleware de auditoria
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  // Log operações sensíveis
  if (['create', 'update', 'delete'].includes(params.action)) {
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`,
    );
  }

  return result;
});
```

## 9. **Content Security Policy**

### **CSP Headers:**

```typescript
// main.ts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);
```

## 10. **Backup e Recovery**

### **Database Backups:**

- ✅ **Backups automáticos** diários
- ✅ **Encriptação** de backups
- ✅ **Testes de recovery** regulares

---

## **Prioridade de Implementação:**

1. 🔴 **CRÍTICO**: JWT Secret seguro + ConfigService
2. 🔴 **CRÍTICO**: CORS configuration
3. 🟡 **ALTO**: Helmet headers
4. 🟡 **ALTO**: Password policy
5. 🟢 **MÉDIO**: Rate limiting específico
6. 🟢 **MÉDIO**: Auditoria e logging
7. 🔵 **BAIXO**: Session blacklist
8. 🔵 **BAIXO**: CSP headers

## **Score Atual: 7.5/10** ✅

Seu projeto já tem uma base de segurança sólida. As implementações críticas em falta são principalmente configurações de infraestrutura e refinamentos.
