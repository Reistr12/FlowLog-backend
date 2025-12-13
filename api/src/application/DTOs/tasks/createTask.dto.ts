import { IsString, IsOptional, IsEnum, IsDateString, ValidateIf } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(['recorrente', 'pontual'])
    type: 'recorrente' | 'pontual';

    @IsOptional()
    @IsEnum(['daily', 'weekly', 'monthly'])
    @ValidateIf((o) => o.type === 'recorrente')
    frequency?: 'daily' | 'weekly' | 'monthly';

    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;
}