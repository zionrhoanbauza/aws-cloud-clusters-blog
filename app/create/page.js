'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const shrink = f => new Promise(res => { const i = new Image(); i.onload = () => { const s = Math.min(1, 800 / i.width), c = document.createElement('canvas'); c.width = i.width * s; c.height = i.height * s; c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .7)); }; i.src = URL.createObjectURL(f); });
export default function Create() {
  const r = useRouter(); const [f, setF] = useState({ title: '', body: '', color: 'lilac', is_private: false }), [img, setImg] = useState(null), [err, setErr] = useState('');
  async function publish() {
    const res = await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ ...f, image: img }) }), j = await res.json();
    if (!res.ok) return setErr(res.status === 401 ? 'Please log in on the Profile page first.' : j.error); r.push('/');
  }
  return (<div className="card"><h2>Create Post</h2>
    <label>Title</label><input placeholder="Give your post a title..." value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
    <label>Description</label><textarea rows={8} placeholder="Write your post here..." value={f.body} onChange={e => setF({ ...f, body: e.target.value })} />
    <label>Cover Image</label><input type="file" accept="image/*" onChange={async e => e.target.files[0] && setImg(await shrink(e.target.files[0]))} />
    {img && <img src={img} alt="" style={{ maxWidth: 240, marginTop: 8, borderRadius: 6 }} />}
    <label>Note color</label><select value={f.color} onChange={e => setF({ ...f, color: e.target.value })}>{['lilac', 'mint', 'sky', 'peach', 'lemon'].map(c => <option key={c}>{c}</option>)}</select>
    <label><input type="checkbox" checked={f.is_private} onChange={e => setF({ ...f, is_private: e.target.checked })} /> Private (only I can see it)</label>
    {err && <p className="err">{err} <Link href="/profile"><u>Log in</u></Link></p>}
    <div className="row"><Link href="/" className="btn ghost">Cancel</Link><button className="btn" onClick={publish}>Publish</button></div></div>);
}
