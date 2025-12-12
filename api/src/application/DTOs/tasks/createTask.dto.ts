export class CreateTaskDto {
    title: string;
    description?: string;
    userId: string;
    type: 'recorrente' | 'pontual';
    frequency?: 'daily' | 'weekly' | 'monthly';
    startDate: Date;
    endDate?: Date;
}