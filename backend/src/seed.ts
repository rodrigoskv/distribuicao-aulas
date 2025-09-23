import { AppDataSource } from './db/data-source';
import { Timeslot } from './models/Timeslot';
import { Subject } from './models/Subject';
import { Resource } from './models/Resource';

export async function seed() {
  const tsRepo = AppDataSource.getRepository(Timeslot);
  if (await tsRepo.count() === 0) {
    const mat = [
      [0,'07:45–08:04',false],[1,'08:04–08:44',true],[2,'08:44–09:26',true],
      [3,'09:26–10:07',true],[4,'10:07–10:23',false],[5,'10:23–11:04',true],[6,'11:04–11:45',true]
    ];
    const ves = [
      [0,'13:13–13:15',false],[1,'13:15–13:56',true],[2,'13:56–14:37',true],
      [3,'14:37–15:18',true],[4,'15:18–15:35',false],[5,'15:35–16:16',true],[6,'16:16–16:57',true]
    ];
    for (let d=1; d<=5; d++) {
      for (const [i,label,teach] of mat) await tsRepo.save({ day:d, shift:'MATUTINO', index:i, label, isTeaching:!!teach } as Timeslot);
      for (const [i,label,teach] of ves) await tsRepo.save({ day:d, shift:'VESPERTINO', index:i, label, isTeaching:!!teach } as Timeslot);
      for (let i=1;i<=2;i++) await tsRepo.save({ day:d, shift:'CONTRATURNO', index:i, label:`CT-${i}`, isTeaching:true } as Timeslot);
    }
  }
  const subj = AppDataSource.getRepository(Subject);
  if (await subj.count()===0){
    const arr = [['PORT','Língua Portuguesa'],['MAT','Matemática'],['CIE','Ciências'],['HIST','História'],['GEO','Geografia'],['EF','Educação Física'],['ART','Arte'],['ING','Inglês'],['ESP','Espanhol'],['ER','Ensino Religioso'],['INF','Informática']];
    for (const [code,name] of arr) await subj.save({ code, name, weeklyDefault:1 } as Subject);
  }
  const resRepo = AppDataSource.getRepository(Resource);
  if (await resRepo.count()===0){
    await resRepo.save([{ code:'LAB', name:'Laboratório de Informática', isExclusive:true }, { code:'QUADRA', name:'Quadra/Ginásio', isExclusive:true }]);
  }
}
