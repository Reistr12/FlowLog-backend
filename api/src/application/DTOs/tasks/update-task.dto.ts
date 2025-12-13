import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['recorrente', 'pontual'])
    type?: 'recorrente' | 'pontual';
    
    @IsOptional()
    @IsEnum(['daily', 'weekly', 'monthly'])
    @ValidateIf((o) => o.type === 'recorrente')
    frequency?: 'daily' | 'weekly' | 'monthly';

    @IsOptional()
    @IsEnum(['pending', 'completed', 'missed'])
    status?: 'pending' | 'completed' | 'missed';

    @IsOptional()
    @IsNumber()
    streak?: number;
    
    @IsOptional()
    @IsDateString()
    startDate?: Date;
    
    @IsOptional()
    @IsDateString()
    endDate?: Date;
}
