import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInitialTables1737129600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilitar extensão UUID se não existir
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar tabela users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar tabela tasks
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'frequency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: 'pending',
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'streak',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar foreign key de tasks para users
    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Criar tabela task_events
    await queryRunner.createTable(
      new Table({
        name: 'task_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'taskId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'eventType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar foreign key de task_events para tasks
    await queryRunner.createForeignKey(
      'task_events',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tasks',
        onDelete: 'CASCADE',
      }),
    );

    // Criar tabela notifications
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'taskId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'scheduledAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'sentAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar foreign keys de notifications
    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tasks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Criar tabela metrics
    await queryRunner.createTable(
      new Table({
        name: 'metrics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'dailyCompletionRate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'weeklyStreaks',
            type: 'int',
            default: 0,
          },
          {
            name: 'tasksCompleted',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar foreign key de metrics para users
    await queryRunner.createForeignKey(
      'metrics',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Criar índices para melhor performance
    await queryRunner.createIndex('tasks', new TableIndex({ columnNames: ['userId'] }));
    await queryRunner.createIndex('task_events', new TableIndex({ columnNames: ['taskId'] }));
    await queryRunner.createIndex('notifications', new TableIndex({ columnNames: ['taskId'] }));
    await queryRunner.createIndex('notifications', new TableIndex({ columnNames: ['userId'] }));
    await queryRunner.createIndex('metrics', new TableIndex({ columnNames: ['userId'] }));
    await queryRunner.createIndex('metrics', new TableIndex({ columnNames: ['date'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices - verifica se existem antes de remover
    const metricsTable = await queryRunner.getTable('metrics');
    if (metricsTable) {
      const dateIndex = metricsTable.indices.find(idx => idx.columnNames.includes('date'));
      const userIdIndex = metricsTable.indices.find(idx => idx.columnNames.includes('userId') && idx.columnNames.length === 1);
      if (dateIndex) {
        await queryRunner.dropIndex('metrics', dateIndex);
      }
      if (userIdIndex) {
        await queryRunner.dropIndex('metrics', userIdIndex);
      }
    }

    const notificationsTable = await queryRunner.getTable('notifications');
    if (notificationsTable) {
      const userIdIndex = notificationsTable.indices.find(idx => idx.columnNames.includes('userId') && idx.columnNames.length === 1);
      const taskIdIndex = notificationsTable.indices.find(idx => idx.columnNames.includes('taskId') && idx.columnNames.length === 1);
      if (userIdIndex) {
        await queryRunner.dropIndex('notifications', userIdIndex);
      }
      if (taskIdIndex) {
        await queryRunner.dropIndex('notifications', taskIdIndex);
      }
    }

    const taskEventsTable = await queryRunner.getTable('task_events');
    if (taskEventsTable) {
      const taskIdIndex = taskEventsTable.indices.find(idx => idx.columnNames.includes('taskId') && idx.columnNames.length === 1);
      if (taskIdIndex) {
        await queryRunner.dropIndex('task_events', taskIdIndex);
      }
    }

    const tasksTable = await queryRunner.getTable('tasks');
    if (tasksTable) {
      const userIdIndex = tasksTable.indices.find(idx => idx.columnNames.includes('userId') && idx.columnNames.length === 1);
      if (userIdIndex) {
        await queryRunner.dropIndex('tasks', userIdIndex);
      }
    }

    // Remover foreign keys e tabelas (em ordem reversa)
    await queryRunner.dropTable('metrics');
    await queryRunner.dropTable('notifications');
    await queryRunner.dropTable('task_events');
    await queryRunner.dropTable('tasks');
    await queryRunner.dropTable('users');
  }
}

