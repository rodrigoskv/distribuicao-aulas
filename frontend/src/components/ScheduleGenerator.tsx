import React, { useState } from 'react';
import { post } from '../lib/api';

export default function ScheduleGenerator({ onDone }:{ onDone:()=>void }){
  const [gens,setG]=useState(120); const [pop,setP]=useState(40); const [mut,setM]=useState(0.07);
  async function go(){ await post('/schedule/generate',{ generations:gens, popSize:pop, mutationRate:mut }); onDone(); }
  return (<div className="card">
    <h3>Gerar Horário </h3>
    <div className="row">
      <input type="number" value={gens} onChange={e=>setG(Number(e.target.value))} /> Gerações
      <input type="number" value={pop} onChange={e=>setP(Number(e.target.value))} /> População
      <input type="number" step="0.01" value={mut} onChange={e=>setM(Number(e.target.value))} /> Mutação
      <button className="primary" onClick={go}>Gerar</button>
    </div>
  </div>);
}
