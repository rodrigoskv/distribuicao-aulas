import React, { useEffect, useState } from 'react';
import { get, post } from '../lib/api';

export default function SubjectConfig(){
  const [subs, setSubs] = useState<any[]>([]);
  const [code,setCode]=useState(''); const [name,setName]=useState(''); const [w,setW]=useState(1);
  useEffect(()=>{ (async()=>setSubs(await get('/subjects')))(); },[]);
  async function add(){ await post('/subjects',{ code,name,weeklyDefault:w }); setCode(''); setName(''); setW(1); setSubs(await get('/subjects')); }
  return (<div className="card">
    <h3>Disciplinas (BNCC)</h3>
    <div className="row">
      <input placeholder="Código" value={code} onChange={e=>setCode(e.target.value)} />
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <input type="number" placeholder="Aulas/semana" value={w} onChange={e=>setW(Number(e.target.value))} />
      <button className="primary" onClick={add}>Adicionar</button>
    </div>
    <table><thead><tr><th>Código</th><th>Nome</th><th>Semanal</th></tr></thead>
      <tbody>{subs.map((s:any)=>(<tr key={s.id}><td>{s.code}</td><td>{s.name}</td><td>{s.weeklyDefault}</td></tr>))}</tbody></table>
  </div>);
}
