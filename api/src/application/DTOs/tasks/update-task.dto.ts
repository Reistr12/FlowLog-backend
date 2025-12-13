import { IsDateString, IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";

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
    @IsDateString()
    startDate?: Date;
    
    @IsOptional()
    @IsDateString()
    endDate?: Date;
}