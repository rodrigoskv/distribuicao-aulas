import React from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export default function ExportPanel(){
  return (<div className="card">
    <h3>Exportar</h3>
    <div className="row">
      <a className="primary" href={API + '/export/excel'}>Baixar Excel</a>
      <a className="primary" href={API + '/export/pdf'}>Baixar PDF</a>
    </div>
  </div>);
}
