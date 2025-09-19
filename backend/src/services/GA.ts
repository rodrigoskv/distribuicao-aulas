import { AppDataSource } from '../db/data-source';
import { Demand } from '../models/Demand';
import { SchoolClass } from '../models/SchoolClass';
import { Subject } from '../models/Subject';
import { Teacher } from '../models/Teacher';
import { Timeslot } from '../models/Timeslot';
import { Resource } from '../models/Resource';
import { Schedule } from '../models/Schedule';
import { Lesson } from '../models/Lesson';

export async function generate({ generations=120, popSize=40, mutationRate=0.07 }:{generations?:number; popSize?:number; mutationRate?:number}){
  const dRepo = AppDataSource.getRepository(Demand);
  const cRepo = AppDataSource.getRepository(SchoolClass);
  const sRepo = AppDataSource.getRepository(Subject);
  const tRepo = AppDataSource.getRepository(Teacher);
  const tmRepo = AppDataSource.getRepository(Timeslot);
  const rRepo = AppDataSource.getRepository(Resource);

  const demands = await dRepo.find();
  const classes = await cRepo.find();
  const subjects = await sRepo.find();
  const teachers = await tRepo.find();
  const times = await tmRepo.find();
  const resources = await rRepo.find();

  const subjByCode = new Map(subjects.map(s=>[s.code,s]));
  const teacherBySubj = new Map<string, Teacher[]>(subjects.map(s=>[s.code, teachers.filter(t=>t.subjectCodes.split(',').includes(s.code))]));

  type Gene = { className:string; subjectCode:string; teacher:string; day:number; slot:number; shift:'MATUTINO'|'VESPERTINO'|'CONTRATURNO'; resource?:string|null; label:string };
  const units: Gene[] = [];
  for (const d of demands) {
    const cls = classes.find(c=>c.name===d.className);
    if (!cls) continue;
    const feas = times.filter(ts=> ts.isTeaching && (ts.shift===cls.shift || (cls.hasContraturno && ts.shift==='CONTRATURNO')) );
    for (let i=0;i<d.weekly;i++){
      const ts = feas[Math.floor(Math.random()*feas.length)];
      const tsTeachers = teacherBySubj.get(d.subjectCode) || [];
      const t = tsTeachers[Math.floor(Math.random()*Math.max(1, tsTeachers.length))];
      const res = d.needsLab ? 'LAB' : d.needsQuadra ? 'QUADRA' : null;
      units.push({ className:d.className, subjectCode:d.subjectCode, teacher: t ? t.name : 'N/A', day: ts.day, slot: ts.index, shift: ts.shift, resource: res, label: ts.label });
    }
  }

  function fitness(ch: Gene[]): number {
    let pen=0;
    const teachSlot = new Map<string, number>();
    const classSlot = new Map<string, number>();
    const resSlot = new Map<string, number>();

    for (const g of ch){
      const k1 = `${g.teacher}-${g.shift}-${g.day}-${g.slot}`;
      const k2 = `${g.className}-${g.shift}-${g.day}-${g.slot}`;
      const k3 = `${g.resource||'none'}-${g.shift}-${g.day}-${g.slot}`;
      teachSlot.set(k1, (teachSlot.get(k1)||0)+1);
      classSlot.set(k2, (classSlot.get(k2)||0)+1);
      resSlot.set(k3, (resSlot.get(k3)||0)+1);
    }
    for (const v of teachSlot.values()) if (v>1) pen += (v-1)*1000;
    for (const v of classSlot.values()) if (v>1) pen += (v-1)*1000;
    for (const [k,v] of resSlot.entries()){
      if (!k.startswith('none') && v>1) pen += (v-1)*1000;
    }
    return 1/(1+pen);
  }

  function crossover(a:Gene[], b:Gene[]):[Gene[],Gene[]]{
    const p = Math.floor(Math.random()*a.length);
    return [ a.slice(0,p).concat(b.slice(p)), b.slice(0,p).concat(a.slice(p)) ];
  }
  function mutate(ch:Gene[]):Gene[]{
    return ch.map(g=>{
      if (Math.random()<mutationRate){
        const cls = classes.find(c=>c.name===g.className)!;
        const feas = times.filter(ts=> ts.isTeaching && (ts.shift===cls.shift || (cls.hasContraturno && ts.shift==='CONTRATURNO')) );
        const ts = feas[Math.floor(Math.random()*feas.length)];
        return { ...g, day: ts.day, slot: ts.index, shift: ts.shift, label: ts.label };
      }
      return g;
    });
  }

  let pop: Gene[][] = Array.from({length: popSize}, ()=> JSON.parse(JSON.stringify(units)));
  let best = { ch: pop[0], fit: fitness(pop[0]) };

  for (let g=0; g<generations; g++){
    const scored = pop.map(ch=>({ ch, f: fitness(ch) })).sort((a,b)=>b.f-a.f);
    if (scored[0].f > best.fit) best = { ch: scored[0].ch, fit: scored[0].f };
    const next: Gene[][] = [scored[0].ch, scored[1].ch];
    while (next.length < popSize){
      const t1 = scored[Math.floor(Math.random()*Math.min(10, scored.length))].ch;
      const t2 = scored[Math.floor(Math.random()*Math.min(10, scored.length))].ch;
      const [c1,c2] = crossover(t1,t2);
      next.push(Math.random()<0.5 ? c1 : c2);
    }
    pop = next.map(ch=> Math.random()<0.07 ? mutate(ch) : ch);
  }

  const schRepo = AppDataSource.getRepository(Schedule);
  const lessonRepo = AppDataSource.getRepository(Lesson);
  const sch = await schRepo.save({ createdAt: new Date(), fitness: best.fit } as Schedule);
  await lessonRepo.clear();
  for (const g of best.ch){
    await lessonRepo.save({ scheduleId: sch.id, teacher: g.teacher, subject: g.subjectCode, schoolClass: g.className, timeslotLabel: g.label, resource: g.resource||undefined, shift: g.shift, day: g.day, slot: g.slot } as Lesson);
  }
  return sch;
}
