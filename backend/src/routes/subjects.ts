// src/routes/subjects.ts
import { Router } from 'express';
import { AppDataSource } from '../db/data-source';
import { Subject } from '../models/Subject';

export const subjectsRouter = Router();

const DEFAULTS = [
  ['PORT','Língua Portuguesa'], ['MAT','Matemática'], ['CIE','Ciências'],
  ['HIST','História'], ['GEO','Geografia'], ['EF','Educação Física'],
  ['ART','Arte'], ['ING','Inglês'], ['ESP','Espanhol'],
  ['ER','Ensino Religioso'], ['INF','Informática']
];

subjectsRouter.post('/subjects/seed-defaults', async (_req, res) => {
  const repo = AppDataSource.getRepository(Subject);
  for (const [code, name] of DEFAULTS) {
    const existing = await repo.findOne({ where: { code } });
    if (!existing) {
      await repo.save(repo.create({ code, name, active: true }));
    }
  }
  res.json({ ok: true, count: DEFAULTS.length });
});

subjectsRouter.get('/subjects', async (_req, res) => {
  const repo = AppDataSource.getRepository(Subject);
  res.json(await repo.find());
});
