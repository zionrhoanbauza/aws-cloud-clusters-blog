'use client';
import { useEffect, useState } from 'react';
const shrinkSq = f => new Promise(res => { const i = new Image(); i.onload = () => { const s = Math.min(i.width, i.height), c = document.createElement('canvas'); c.width = c.height = 200; c.getContext('2d').drawImage(i, (i.width - s) / 2, (i.height - s) / 2, s, s, 0, 0, 200, 200); res(c.toDataURL('image/jpeg', .8)); }; i.src = URL.createObjectURL(f); });
export default function Profile() {
  const [u, setU] = useState(undefined), [mode, setMode] = useState('login'), [f, setF] = useState({ username: '', password: '' }), [err, setErr] = useState(''), [bio, setBio] = useState(''), [saved, setSaved] = useState(false);
  const load = () => fetch('/api/auth').then(r => r.json()).then(j => { setU(j.user); setBio(j.user?.bio || ''); });
  useEffect(() => { load(); }, []);
  const post = b => fetch('/api/auth', { method: 'POST', body: JSON.stringify(b) });
  async function submit() { const r = await post({ action: mode, ...f }); if (!r.ok) return setErr((await r.json()).error); location.href = '/'; }
  if (u === undefined) return null;
  if (u) return (<div className="card"><h2>@{u.username}</h2><p className="meta">Member since {new Date(u.created).toLocaleDateString()}</p>
    <label>Bio</label><textarea rows={3} maxLength={300} value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }} />
    <div className="row"><button className="btn" onClick={async () => { await post({ action: 'bio', bio }); setSaved(true); }}>{saved ? 'Saved ✓' : 'Save bio'}</button>
      <button className="btn ghost" onClick={async () => { await post({ action: 'logout' }); location.href = '/'; }}>Log out</button></div></div>);
  return (<div className="card"><h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
    <label>Username</label><input value={f.username} onChange={e => setF({ ...f, username: e.target.value })} />
    <label>Password</label><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
    {err && <p className="err">{err}</p>}
    <div className="row"><button className="btn" onClick={submit}>{mode === 'login' ? 'Log in' : 'Sign up'}</button>
      <button className="btn ghost" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'New here? Sign up' : 'Have an account? Log in'}</button></div></div>);
}
