# Guia de Migrations - FlowLog

Este documento explica como usar as migrations do TypeORM no projeto FlowLog.

## 📋 Pré-requisitos

Certifique-se de que o banco de dados PostgreSQL está rodando e configurado corretamente.

## 🚀 Executando Migrations

### 1. Executar todas as migrations pendentes

```bash
npm run migration:run
```

Isso criará todas as tabelas no banco de dados:
- `users`
- `tasks`
- `task_events`
- `notifications`
- `metrics`

### 2. Reverter a última migration

```bash
npm run migration:revert
```

Isso desfaz a última migration executada.

### 3. Gerar uma nova migration automaticamente

```bash
npm run migration:generate src/migrations/NomeDaMigration
```

**Nota:** Isso compara as entidades com o banco atual e gera uma migration com as diferenças.

## 📁 Estrutura

```
api/
├── src/
│   └── migrations/
│       └── 1737129600000-CreateInitialTables.ts
└── data-source.ts
```

## 🔧 Configuração

O arquivo `data-source.ts` está configurado para usar as variáveis de ambiente:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=flowlog
DB_PASSWORD=flowlog
DB_NAME=flowlog_db
```

## 📝 Migration Inicial

A migration `CreateInitialTables` cria:

1. **users** - Tabela de usuários
2. **tasks** - Tabela de tarefas (com FK para users)
3. **task_events** - Tabela de eventos de tarefas (com FK para tasks)
4. **notifications** - Tabela de notificações (com FKs para tasks e users)
5. **metrics** - Tabela de métricas (com FK para users)

### Índices criados:
- `tasks.userId`
- `task_events.taskId`
- `notifications.taskId`
- `notifications.userId`
- `metrics.userId`
- `metrics.date`

### Foreign Keys:
- Todas as FKs têm `ON DELETE CASCADE` para manter integridade referencial

## ⚠️ Importante

- **Desative `synchronize: true`** no `app.module.ts` quando usar migrations em produção
- Sempre teste migrations em ambiente de desenvolvimento primeiro
- Faça backup do banco antes de executar migrations em produção

## 🔄 Workflow Recomendado

1. Desenvolver/alterar entidades
2. Gerar migration: `npm run migration:generate`
3. Revisar a migration gerada
4. Testar localmente: `npm run migration:run`
5. Commit da migration
6. Executar em produção: `npm run migration:run`

