import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'flowlog',
  password: process.env.DB_PASSWORD || 'flowlog',
  database: process.env.DB_NAME || 'flowlog_db',
}));
