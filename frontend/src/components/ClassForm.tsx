import React, { useEffect, useState } from 'react';
import { get, post } from '../lib/api';

export default function ClassForm(){
  const [classes, setClasses] = useState<any[]>([]);
  const [name,setName]=useState('');
  const [shift,setShift]=useState<'MATUTINO'|'VESPERTINO'>('MATUTINO');
  const [hasCT,setCT]=useState(false);
  useEffect(()=>{ (async()=>setClasses(await get('/classes')))(); },[]);
  async function add(){ await post('/classes',{ name, shift, hasContraturno: hasCT }); setName(''); setCT(false); setClasses(await get('/classes')); }
  return (<div className="card">
    <h3>Turmas</h3>
    <div className="row">
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <select value={shift} onChange={e=>setShift(e.target.value as any)}>
        <option value="MATUTINO">Matutino</option><option value="VESPERTINO">Vespertino</option>
      </select>
      <label><input type="checkbox" checked={hasCT} onChange={e=>setCT(e.target.checked)} /> Contraturno</label>
      <button className="primary" onClick={add}>Adicionar</button>
    </div>
    <table><thead><tr><th>Turma</th><th>Turno</th><th>CT</th></tr></thead>
    <tbody>{classes.map((c:any)=>(<tr key={c.id}><td>{c.name}</td><td>{c.shift}</td><td>{c.hasContraturno?'Sim':'Não'}</td></tr>))}</tbody></table>
  </div>);
}
