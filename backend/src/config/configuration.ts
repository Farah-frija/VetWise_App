// config/configuration.ts
import { registerAs } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Database configuration
export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}));

// JWT configuration
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  ignoreExpiration: process.env.NODE_ENV === 'development',
}));

// Mail configuration
export const mailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 10) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
}));
// TypeORM DataSource (for migrations and direct connection)
export const AppDataSource = new DataSource({
  type: 'postgres', // Changed from 'mysql' to 'postgres'
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432, // Default PostgreSQL port
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  synchronize: true,
  // Removed driver specification (not needed for PostgreSQL)
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
//générer une migration
// npm run migration:generate -- src/migrations/migration_name
//éxecuter migration
// npm run migration:run