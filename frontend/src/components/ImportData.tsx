import React, { useState } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ImportData(){
  const [file, setFile] = useState<File|null>(null);
  async function send(){
    if(!file) return;
    const fd = new FormData(); fd.append('file', file);
    await fetch(API + '/import', { method:'POST', body: fd });
    alert('Import concluído!');
  }
  return (<div className="card">
    <h3>Importar Dados (CSV/XLSX)</h3>
    <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
    <button className="primary" onClick={send}>Importar</button>
  </div>);
}
