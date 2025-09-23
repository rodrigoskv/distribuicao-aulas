import React, { useEffect, useState } from 'react';
import { get } from '../lib/api';

export default function ScheduleViewer(){
  const [lessons, setLessons] = useState<any[]>([]);
  const [fitness, setFitness] = useState<number|undefined>();
  async function load(){
    const data = await get<{schedule:any, lessons:any[]}>('/schedule');
    setLessons(data.lessons||[]); setFitness(data.schedule?.fitness);
  }
  useEffect(()=>{ load(); },[]);

  const shifts:('MATUTINO'|'VESPERTINO'|'CONTRATURNO')[]=['MATUTINO','VESPERTINO','CONTRATURNO'];
  const days = ['','Seg','Ter','Qua','Qui','Sex'];

  return (<div className="card">
    <h3>Horário (visualização) {fitness!==undefined && <span className="badge">fitness {fitness.toFixed(6)}</span>}</h3>
    {shifts.map(shift=>{
      const ls = lessons.filter(l=>l.shift===shift);
      if (!ls.length) return null;
      const maxIndex = Math.max(...ls.map(l=>l.slot));
      const grid: Record<number, Record<number, any[]>> = {};
      ls.forEach(l=>{ grid[l.day] ||= {}; (grid[l.day][l.slot] ||= []).push(l); });
      return (<div key={shift} style={{marginTop:12}}>
        <h4>{shift}</h4>
        <div className="grid">
          <div></div>
          {Array.from({length:maxIndex+1},(_,i)=><div key={i} className="cell"><b>Slot {i}</b></div>)}
          {Array.from({length:5},(_,d)=>d+1).map(day=>(
            <React.Fragment key={day}>
              <div className="cell"><b>{days[day]}</b></div>
              {Array.from({length:maxIndex+1},(_,i)=>{
                const v=(grid[day]?.[i] || []);
                return (<div key={i} className="cell">
                  {v.map((l:any,idx:number)=>(<div className="badge" key={idx}>{l.schoolClass} · {l.subject} · {l.teacher}{l.resource?` · ${l.resource}`:''}</div>))}
                </div>)
              })}
            </React.Fragment>
          ))}
        </div>
      </div>)
    })}
  </div>);
}
