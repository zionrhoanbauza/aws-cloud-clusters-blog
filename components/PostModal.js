'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toHtml } from '@/lib/text';
const COLORS = ['lilac', 'mint', 'sky', 'peach', 'lemon'];
export default function PostModal({ post: p, me, onClose, patch, del, onCount }) {
  const [cm, setCm] = useState(null), [txt, setTxt] = useState(''), [err, setErr] = useState('');
  const api = `/api/posts/${p.id}/comments`, mine = me?.id === p.user_id;
  const load = () => fetch(api).then(r => r.json()).then(j => setCm(j.comments || []));
  useEffect(() => { setCm(null); load(); }, [p.id]);
  async function add() {
    if (!txt.trim()) return;
    const r = await fetch(api, { method: 'POST', body: JSON.stringify({ body: txt }) });
    if (!r.ok) return setErr((await r.json()).error);
    setTxt(''); setErr(''); load(); onCount();
  }
  async function rm(c) { if (!confirm('Delete this comment?')) return; await fetch(`${api}?cid=${c.id}`, { method: 'DELETE' }); load(); onCount(); }
  return (<div className="modal" onClick={onClose}><div className="sheet" role="dialog" aria-modal="true" aria-label={p.title} onClick={e => e.stopPropagation()}>
    <h2>{p.title}</h2><div className="meta">by {p.username} · {new Date(p.created).toLocaleDateString()}{p.is_private && ' · Private'}</div>
    {p.has_image && <img src={`/api/posts/${p.id}/image`} alt={`Cover image for ${p.title}`} />}
    {p.body && <div className="rt" dangerouslySetInnerHTML={{ __html: toHtml(p.body) }} />}
    {me && <div className="set">
      <label><input type="checkbox" checked={!!p.is_pinned} onChange={e => patch(p, { pinned: e.target.checked })} /> Pin for me</label>
      {mine && <>
        <label><input type="checkbox" checked={p.is_private} onChange={e => patch(p, { is_private: e.target.checked })} /> Private</label>
        {COLORS.map(c => <button key={c} data-c={c} className="sw" aria-label={`Color ${c}`} style={{ background: 'var(--h)' }} onClick={() => patch(p, { color: c })} />)}
        <button className="btn ghost sm" onClick={() => patch(p, { archived: !p.archived })}>{p.archived ? 'Restore' : 'Archive'}</button></>}
      {(mine || me.head) && <button className="btn danger sm" onClick={() => del(p)}>{mine ? 'Delete' : 'Delete (head)'}</button>}
    </div>}
    <section className="cmts" aria-label="Comments">
      <h3 style={{ margin: 0 }}>Comments{cm ? ` (${cm.length})` : ''}</h3>
      {cm === null && <p className="meta">Loading comments…</p>}
      {cm?.length === 0 && <p className="meta">No comments yet.</p>}
      <ul>{cm?.map(c => (<li key={c.id}>
        <div className="meta"><b>@{c.username}</b> · {new Date(c.created).toLocaleString()}
          {me && (me.id === c.user_id || mine || me.head) && <button className="lnk" onClick={() => rm(c)}>Delete</button>}</div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{c.body}</div></li>))}</ul>
      {me ? <><label htmlFor="cmt">Add a comment</label>
        <textarea id="cmt" rows={2} maxLength={500} value={txt} onChange={e => setTxt(e.target.value)} />
        {err && <p className="err">{err}</p>}
        <div className="row"><button className="btn sm" onClick={add}>Comment</button></div></>
        : <p><Link href="/profile"><u>Log in</u></Link> to join the conversation.</p>}
    </section>
    <div className="set"><button className="btn ghost sm" onClick={onClose}>Close</button></div>
  </div></div>);
}
