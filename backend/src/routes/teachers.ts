// src/routes/teachers.ts
import { Router } from 'express';
import { AppDataSource } from '../db/data-source';
import { Teacher } from '../models/Teacher';

export const teachersRouter = Router();
const repo = () => AppDataSource.getRepository(Teacher);

teachersRouter.get('/teachers', async (_req, res) => res.json(await repo().find()));
teachersRouter.post('/teachers', async (req, res) => {
  const t = repo().create(req.body); // {name,email,subjectCodes,availableMorning,...}
  res.json(await repo().save(t));
});
teachersRouter.put('/teachers/:id', async (req, res) => {
  await repo().update(+req.params.id, req.body);
  res.json(await repo().findOneBy({ id: +req.params.id }));
});
teachersRouter.delete('/teachers/:id', async (req, res) => {
  await repo().delete(+req.params.id);
  res.json({ ok: true });
});
