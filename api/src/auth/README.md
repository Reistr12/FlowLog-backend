# Sistema de Autenticação - FlowLog

Este documento descreve o sistema de autenticação implementado no FlowLog.

## 📦 Dependências Necessárias

Instale as seguintes dependências:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt uuid
npm install --save-dev @types/passport-jwt @types/bcrypt @types/uuid
npm install class-validator class-transformer
```

## 🔐 Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env`:

```env
JWT_SECRET=seu-secret-key-super-seguro-aqui
JWT_EXPIRES_IN=24h
```

## 📡 Endpoints

### POST `/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/login`
Autentica um usuário existente.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET `/auth/profile`
Retorna o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

## 🔒 Proteção de Rotas

Por padrão, todas as rotas são protegidas pelo `JwtAuthGuard`. Para tornar uma rota pública, use o decorator `@Public()`:

```typescript
import { Public } from '../common/decorators/public.decorator';

@Controller('exemplo')
export class ExemploController {
  @Public()
  @Get('publico')
  rotaPublica() {
    return 'Esta rota é pública';
  }

  @Get('protegida')
  rotaProtegida(@CurrentUser() user: UserEntity) {
    return `Olá, ${user.name}!`;
  }
}
```

## 👤 Acessando o Usuário Atual

Use o decorator `@CurrentUser()` para acessar o usuário autenticado:

```typescript
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserEntity } from '../domain/entities/user.entity';

@Get('minha-rota')
minhaRota(@CurrentUser() user: UserEntity) {
  return user;
}
```

## 🏗️ Estrutura

```
src/
├── auth/
│   ├── auth.controller.ts      # Controller com endpoints de autenticação
│   ├── auth.service.ts          # Lógica de negócio de autenticação
│   ├── auth.module.ts           # Módulo de autenticação
│   ├── guards/
│   │   └── jwt-auth.guard.ts    # Guard JWT global
│   └── strategies/
│       └── jwt.strategy.ts       # Estratégia JWT do Passport
├── application/
│   └── DTOs/
│       ├── register.dto.ts      # DTO de registro
│       └── login.dto.ts          # DTO de login
├── infra/
│   └── repositories/
│       └── user.repository.ts    # Repositório de usuários
└── common/
    └── decorators/
        ├── public.decorator.ts   # Decorator para rotas públicas
        └── current-user.decorator.ts # Decorator para usuário atual
```

## 🔑 Funcionalidades

- ✅ Registro de usuários com validação
- ✅ Login com JWT
- ✅ Proteção automática de rotas
- ✅ Hash de senhas com bcrypt
- ✅ Validação de DTOs com class-validator
- ✅ Decorators para rotas públicas e usuário atual
- ✅ Tratamento de erros (email duplicado, credenciais inválidas)

## 🚀 Próximos Passos

- [ ] Refresh tokens
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Rate limiting para login
- [ ] Logout (blacklist de tokens)

