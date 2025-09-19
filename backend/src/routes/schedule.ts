import { Router } from 'express';
import { AppDataSource } from '../db/data-source';
import { Schedule } from '../models/Schedule';
import { Lesson } from '../models/Lesson';
import { generate } from '../services/GA';

export const scheduleRouter = Router();

scheduleRouter.post('/generate', async (req, res) => {
  const sch = await generate(req.body || {});
  res.json({ scheduleId: sch.id, fitness: sch.fitness });
});

scheduleRouter.get('/', async (_req, res) => {
  const sRepo = AppDataSource.getRepository(Schedule);
  const lRepo = AppDataSource.getRepository(Lesson);
  const latest = await sRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
  if (!latest.length) return res.json({ schedule: null, lessons: [] });
  const lessons = await lRepo.find();
  res.json({ schedule: latest[0], lessons });
});
