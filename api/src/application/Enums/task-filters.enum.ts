export interface TaskFilter {
  END_DATE?: Date | string;
  TYPE?: 'recorrente' | 'pontual';
  FREQUENCY?: 'daily' | 'weekly' | 'monthly';
  DESCRIPTION?: string;
  TITLE?: string;
  START_DATE?: Date | string;
  STREAK?: number;
}
