import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import User from './entities/user.js';
import Movie from './entities/movie.js';
import Review from './entities/review.js';

dotenv.config();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_POSTGRES_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_POSTGRES_USER,
  password: process.env.DATABASE_POSTGRES_PASSWORD,
  database: process.env.DATABASE_POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Movie, Review],
});
