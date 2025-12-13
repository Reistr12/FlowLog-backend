import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddUserIdToTaskEventTable1765643121185 implements MigrationInterface {
    name = 'AddUserIdToTaskEventTable1765643121185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna userId na tabela task_events
        await queryRunner.addColumn(
            'task_events',
            new TableColumn({
                name: 'userId',
                type: 'varchar',
                isNullable: false,
            }),
        );

        // Criar foreign key de task_events para users
        await queryRunner.createForeignKey(
            'task_events',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign key
        const table = await queryRunner.getTable('task_events');
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('userId') !== -1,
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('task_events', foreignKey);
        }

        // Remover coluna userId
        await queryRunner.dropColumn('task_events', 'userId');
    }

}
