import 'reflect-metadata';
import { DataSource } from 'typeorm';

import 'dotenv/config';
import Client from './entity/Client';
import Company from './entity/Company';
import User from './entity/User';
import UserProfile from './entity/UserProfile';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [User, UserProfile, Company, Client],
  migrations: [],
  subscribers: [],
});
