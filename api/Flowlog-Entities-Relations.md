# FlowLog - Definição de Entities e Relações

Este documento descreve as **entidades principais** do FlowLog e seus **relacionamentos**, seguindo a arquitetura DDD + Clean Architecture.

---

## 1. Entidades

### 1.1 User

**Descrição:** Representa um usuário da aplicação.

**Atributos:**

* `id: string`
* `name: string`
* `email: string`
* `passwordHash: string`
* `createdAt: Date`
* `updatedAt: Date`

**Regras de negócio:**

* Email deve ser único.
* Senha deve estar criptografada.
* Usuário pode ter múltiplas tarefas.

---

### 1.2 Task

**Descrição:** Representa uma tarefa, que pode ser recorrente ou pontual.

**Atributos:**

* `id: string`
* `title: string`
* `description?: string`
* `userId: string`
* `type: 'recorrente' | 'pontual'`
* `frequency?: 'daily' | 'weekly' | 'monthly'` (para tarefas recorrentes)
* `startDate: Date`
* `endDate?: Date`
* `streak: number`
* `createdAt: Date`
* `updatedAt: Date`

**Regras de negócio:**

* Tarefas recorrentes geram instâncias futuras.
* Usuário só pode criar tarefas com data de início >= hoje.
* Streak aumenta apenas quando a tarefa é concluída no dia correto.
* Tarefas concluídas geram eventos para métricas.

---

### 1.3 TaskHistory

**Descrição:** Histórico de execução de uma tarefa.

**Atributos:**

* `id: string`
* `taskId: string`
* `date: Date`
* `status: 'pending' | 'completed' | 'missed'`

**Regras de negócio:**

* Cada tarefa deve ter um registro no dia de execução.
* Status `completed` só pode ser atribuído no dia ou após a tarefa.
* Usado para cálculo de streaks e métricas.

---

### 1.4 Metrics

**Descrição:** Métricas de produtividade e progresso do usuário.

**Exemplos de métricas:**

* `dailyCompletionRate`
* `weeklyStreaks`
* `tasksCompleted`

**Regras de negócio:**

* Recalcular métricas ao atualizar TaskHistory.
* Expor métodos para dashboards.

---

### 1.5 Notification

**Descrição:** Notificações de lembrete para tarefas.

**Regras de negócio:**

* Enviar lembretes antes da tarefa.
* Não enviar múltiplos lembretes para a mesma tarefa no mesmo dia.

---

## 2. Relações entre entidades

| Entidade A | Relação | Entidade B   | Cardinalidade   |
| ---------- | ------- | ------------ | --------------- |
| User       | possui  | Task         | 1:N             |
| Task       | possui  | TaskHistory  | 1:N             |
| Task       | gera    | Notification | 1:N             |
| Task/User  | calcula | Metrics      | 1:1 ou agregado |

### Diagrama conceitual

```text
User ───< Task ───< TaskHistory
         │
         └──< Notification
         │
         └──> Metrics (agregado)
```

**Observações:**

* TaskHistory é a base para métricas e streaks.
* Notifications podem ser assíncronas, via fila.
* As invariantes (streaks, datas, duplicidade de notificações) devem ser garantidas no domínio.
