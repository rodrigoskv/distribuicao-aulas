import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { config } from '../config';
import { Subject } from '../models/Subject';
import { Teacher } from '../models/Teacher';
import { SchoolClass } from '../models/SchoolClass';
import { Resource } from '../models/Resource';
import { Availability } from '../models/Availability';
import { Demand } from '../models/Demand';
import { Timeslot } from '../models/Timeslot';
import { Lesson } from '../models/Lesson';
import { Schedule } from '../models/Schedule';

const type = (config.db.type || 'sqlite') as any;

export const AppDataSource = new DataSource({
  type,
  //database: type === 'sqlite' ? (config.db.sqliteFile || path.join(process.cwd(), 'data.sqlite')) : undefined,
  host: type !== 'sqlite' ? config.db.host : undefined,
  port: type !== 'sqlite' ? config.db.port : undefined,
  username: type !== 'sqlite' ? config.db.username : undefined,
  password: type !== 'sqlite' ? config.db.password : undefined,
  database: type !== 'sqlite' ? config.db.database : undefined,
  charset: type === 'mysql' ? 'utf8mb4' : undefined,
  extra: type === 'mysql' ? { decimalNumbers: true, timezone: 'Z' } : undefined,

  synchronize: false,
  logging: false,

  entities: [Subject, Teacher, SchoolClass, Resource, Availability, Demand, Timeslot, Lesson, Schedule],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: []
});
