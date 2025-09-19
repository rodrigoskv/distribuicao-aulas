const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export async function api<T>(path:string, init?:RequestInit):Promise<T>{
  const res = await fetch(API + path, { headers: { 'Content-Type':'application/json', ...(init?.headers||{}) }, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const get=<T,>(p:string)=>api<T>(p);
export const post=<T,>(p:string,b:any)=>api<T>(p,{method:'POST', body: JSON.stringify(b)});
