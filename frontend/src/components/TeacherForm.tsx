import React, { useEffect, useState } from 'react';
import { get, post } from '../lib/api';

export default function TeacherForm(){
  const [subs, setSubs] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [name,setName]=useState(''); const [email,setEmail]=useState('');
  const [sel,setSel]=useState<string[]>([]); const [max,setMax]=useState(0);
  useEffect(()=>{ (async()=>{ setSubs(await get('/subjects')); setTeachers(await get('/teachers')); })(); },[]);
  async function add(){ await post('/teachers',{ name,email, subjectCodes: sel, maxWeeklyLoad: max }); setName(''); setEmail(''); setSel([]); setMax(0); setTeachers(await get('/teachers')); }
  return (<div className="card">
    <h3>Professores</h3>
    <div className="row">
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <select multiple value={sel} onChange={e=>setSel(Array.from(e.target.selectedOptions).map(o=>o.value))}>
        {subs.map((s:any)=><option key={s.id} value={s.code}>{s.code} - {s.name}</option>)}
      </select>
      <input type="number" placeholder="Carga máx" value={max} onChange={e=>setMax(Number(e.target.value))}/>
      <button className="primary" onClick={add}>Adicionar</button>
    </div>
    <table><thead><tr><th>Nome</th><th>Email</th><th>Disciplinas</th><th>Máx</th></tr></thead>
      <tbody>{teachers.map((t:any)=>(<tr key={t.id}><td>{t.name}</td><td>{t.email}</td><td>{t.subjectCodes}</td><td>{t.maxWeeklyLoad}</td></tr>))}</tbody></table>
  </div>);
}
