# Guia de Testes - Insomnia

## 🚀 Configuração Inicial

### 1. Certifique-se de que a API está rodando:
```bash
cd Flow-Log-Backend/api
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

### 2. Configure as variáveis de ambiente (se necessário):
Crie um arquivo `.env` na pasta `api/`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=flowlog
DB_PASSWORD=flowlog
DB_NAME=flowlog_db
JWT_SECRET=seu-secret-key-super-seguro-aqui
JWT_EXPIRES_IN=24h
PORT=3000
```

---

## 📡 Requisições para Testar

### 1. **POST /auth/register** - Criar Usuário

**URL:** `http://localhost:3000/auth/register`

**Método:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta Esperada (201 Created):**
```json
{
  "user": {
    "id": "uuid-gerado",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis Erros:**
- **400 Bad Request:** Dados inválidos (email inválido, senha muito curta, campos obrigatórios faltando)
- **409 Conflict:** Email já está em uso

---

### 2. **POST /auth/login** - Fazer Login

**URL:** `http://localhost:3000/auth/login`

**Método:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "user": {
    "id": "uuid-gerado",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis Erros:**
- **400 Bad Request:** Dados inválidos (email inválido, campos obrigatórios faltando)
- **401 Unauthorized:** Credenciais inválidas (email ou senha incorretos)

---

### 3. **GET /auth/profile** - Ver Perfil (Protegido)

**URL:** `http://localhost:3000/auth/profile`

**Método:** `GET`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota:** Use o `accessToken` retornado no login/register.

**Resposta Esperada (200 OK):**
```json
{
  "id": "uuid-gerado",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Possíveis Erros:**
- **401 Unauthorized:** Token inválido ou ausente
- **401 Unauthorized:** Token expirado

---

## 🧪 Casos de Teste

### Teste 1: Criar usuário válido
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha123456"
}
```

### Teste 2: Tentar criar usuário com email duplicado
```json
{
  "name": "Outro Nome",
  "email": "maria@example.com",
  "password": "outrasenha"
}
```
**Esperado:** 409 Conflict

### Teste 3: Criar usuário com senha muito curta
```json
{
  "name": "Teste",
  "email": "teste@example.com",
  "password": "123"
}
```
**Esperado:** 400 Bad Request (senha deve ter no mínimo 6 caracteres)

### Teste 4: Criar usuário com email inválido
```json
{
  "name": "Teste",
  "email": "email-invalido",
  "password": "senha123"
}
```
**Esperado:** 400 Bad Request (email inválido)

### Teste 5: Login com credenciais corretas
```json
{
  "email": "maria@example.com",
  "password": "senha123456"
}
```

### Teste 6: Login com senha incorreta
```json
{
  "email": "maria@example.com",
  "password": "senhaerrada"
}
```
**Esperado:** 401 Unauthorized

### Teste 7: Login com email inexistente
```json
{
  "email": "naoexiste@example.com",
  "password": "senha123"
}
```
**Esperado:** 401 Unauthorized

### Teste 8: Acessar perfil sem token
**Headers:** (sem Authorization)
**Esperado:** 401 Unauthorized

### Teste 9: Acessar perfil com token inválido
**Headers:**
```
Authorization: Bearer token-invalido-123
```
**Esperado:** 401 Unauthorized

---

## 📝 Dicas para o Insomnia

1. **Criar Environment:**
   - Crie uma variável `base_url` = `http://localhost:3000`
   - Use `{{ base_url }}/auth/register` nas URLs

2. **Salvar Token Automaticamente:**
   - Após o login/register, salve o `accessToken` em uma variável de ambiente
   - Use `{{ accessToken }}` no header Authorization

3. **Criar Collection:**
   - Organize as requisições em uma collection "FlowLog Auth"
   - Facilita a execução sequencial dos testes

4. **Testes Automatizados:**
   - Configure testes no Insomnia para validar respostas
   - Exemplo: verificar se `statusCode === 201` no register

---

## ✅ Checklist de Testes

- [ ] Criar usuário com dados válidos
- [ ] Tentar criar usuário com email duplicado
- [ ] Validar senha mínima (6 caracteres)
- [ ] Validar formato de email
- [ ] Login com credenciais corretas
- [ ] Login com senha incorreta
- [ ] Login com email inexistente
- [ ] Acessar perfil com token válido
- [ ] Acessar perfil sem token
- [ ] Acessar perfil com token inválido

---

**Boa sorte com os testes! 🚀**

