// src/routes/classes.ts
import { Router } from 'express';
import { AppDataSource } from '../db/data-source';
import { SchoolClass } from '../models/SchoolClass';
import { WeeklyLoad } from '../models/WeeklyLoad';

export const classesRouter = Router();
const classRepo = () => AppDataSource.getRepository(SchoolClass);
const loadRepo  = () => AppDataSource.getRepository(WeeklyLoad);

type Shift = 'MATUTINO'|'VESPERTINO';

classesRouter.get('/classes', async (_req, res) => {
  res.json(await classRepo().find());
});

classesRouter.post('/classes', async (req, res) => {
  const { name, gradeYear, shift } = req.body as { name:string; gradeYear:number; shift:Shift };
  if (!name || !gradeYear || !shift) return res.status(400).send('name, gradeYear, shift required');

  const hasContraturno = [6,7,8,9].includes(+gradeYear); // regra
  const entity = classRepo().create({ name, gradeYear:+gradeYear, shift, hasContraturno });
  const cls = await classRepo().save(entity);
  res.json(cls);
});

classesRouter.put('/classes/:id', async (req, res) => {
  const id = +req.params.id;
  const patch = req.body as Partial<SchoolClass>;
  if (patch.gradeYear !== undefined) {
    patch.hasContraturno = [6,7,8,9].includes(+patch.gradeYear);
  }
  await classRepo().update(id, patch);
  res.json(await classRepo().findOneBy({ id }));
});

// cargas semanais (put em lote)
classesRouter.get('/classes/:id/loads', async (req, res) => {
  const classId = +req.params.id;
  res.json(await loadRepo().find({ where: { schoolClassId: classId } }));
});

classesRouter.put('/classes/:id/loads', async (req, res) => {
  const classId = +req.params.id;
  const loads: Array<{subjectCode:string, hoursPerWeek:number}> = req.body.loads || [];
  await loadRepo().delete({ schoolClassId: classId }); // substitui tudo
  for (const {subjectCode, hoursPerWeek} of loads) {
    await loadRepo().save(loadRepo().create({
      schoolClassId: classId,
      subjectCode: String(subjectCode).toUpperCase(),
      hoursPerWeek: Math.max(0, Number(hoursPerWeek||0)),
    }));
  }
  res.json(await loadRepo().find({ where: { schoolClassId: classId } }));
});
