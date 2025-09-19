import { Router } from 'express';
import type multer from 'multer';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { AppDataSource } from '../db/data-source';
import { Subject } from '../models/Subject';
import { Teacher } from '../models/Teacher';
import { SchoolClass } from '../models/SchoolClass';
import { Demand } from '../models/Demand';
import { Resource } from '../models/Resource';

export function importRouter(upload: ReturnType<typeof multer>) {
  const r = Router();
  r.post('/import', upload.single('file'), async (req,res)=>{
    if(!req.file) return res.status(400).json({ error: 'file required' });
    let payload: any;
    if (req.file.originalname.endsWith('.xlsx')) {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      payload = {};
      for (const name of wb.SheetNames) payload[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: '' });
    } else {
      payload = { data: parse(req.file.buffer.toString('utf-8'), { columns: true, skip_empty_lines: true }) };
    }
    const subjRepo = AppDataSource.getRepository(Subject);
    const tRepo = AppDataSource.getRepository(Teacher);
    const cRepo = AppDataSource.getRepository(SchoolClass);
    const dRepo = AppDataSource.getRepository(Demand);
    const resRepo = AppDataSource.getRepository(Resource);

    if (payload.Subjects) for (const row of payload.Subjects) await subjRepo.save({ code: row.code, name: row.name, weeklyDefault: Number(row.weeklyDefault||1) });
    if (payload.Resources) for (const row of payload.Resources) await resRepo.save({ code: row.code, name: row.name, isExclusive: String(row.isExclusive).toLowerCase()!=='false' });
    if (payload.Teachers) for (const row of payload.Teachers) await tRepo.save({ name: row.name, email: row.email, subjectCodes: String(row.subjectCodes||''), maxWeeklyLoad: Number(row.maxWeeklyLoad||0) });
    if (payload.Classes) for (const row of payload.Classes) await cRepo.save({ name: row.name, shift: row.shift, hasContraturno: String(row.hasContraturno||'').toLowerCase()==='true' });
    if (payload.Demands) for (const row of payload.Demands) await dRepo.save({ className: row.className, subjectCode: row.subjectCode, weekly: Number(row.weekly||1), priority: Number(row.priority||1), needsLab: String(row.needsLab||'').toLowerCase()==='true', needsQuadra: String(row.needsQuadra||'').toLowerCase()==='true' });

    res.json({ ok:true });
  });
  return r;
}
