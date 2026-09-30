'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PostModal from '@/components/PostModal';
import { toHtml } from '@/lib/text';
export default function Home() {
  const [me, setMe] = useState(null), [scope, setScope] = useState('all'), [arch, setArch] = useState(false), [page, setPage] = useState(1);
  const [d, setD] = useState({ posts: [], pages: 1 }), [open, setOpen] = useState(null);
  const load = useCallback(async () => { const r = await fetch(`/api/posts?scope=${scope}&archived=${arch ? 1 : 0}&page=${page}`); setD(await r.json()); }, [scope, arch, page]);
  useEffect(() => { fetch('/api/auth').then(r => r.json()).then(j => setMe(j.user)); }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!open) return; const k = e => e.key === 'Escape' && setOpen(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [open]);
  const pick = s => { if (s === 'mine' && !me) return (location.href = '/profile'); setScope(s); setPage(1); setArch(false); };
  async function patch(p, b) {
    await fetch('/api/posts/' + p.id, { method: 'PATCH', body: JSON.stringify(b) });
    const { pinned, ...rest } = b;
    setOpen(o => (b.archived ? null : { ...o, ...rest, ...(pinned !== undefined && { is_pinned: pinned }) })); load();
  }
  async function del(p) { if (!confirm('Delete this post permanently?')) return; await fetch('/api/posts/' + p.id, { method: 'DELETE' }); setOpen(null); load(); }
  const nums = d.pages <= 5 ? [...Array(d.pages)].map((_, i) => i + 1) : [1, 2, 3, '…', d.pages];
  return (<>
    <div className="bar">
      <div className="pg">
        <button aria-label="Previous page" onClick={() => setPage(p => Math.max(1, p - 1))}>◀</button>
        {nums.map((n, i) => n === '…' ? <span key={i}>…</span> : <button key={i} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} className={n === page ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>)}
        <button aria-label="Next page" onClick={() => setPage(p => Math.min(d.pages, p + 1))}>▶</button>
      </div>
      <div className="seg"><button aria-pressed={scope === 'all'} className={scope === 'all' ? 'on' : ''} onClick={() => pick('all')}>All</button>
        <button aria-pressed={scope === 'mine'} className={scope === 'mine' ? 'on' : ''} onClick={() => pick('mine')}>My Blogs</button></div>
      {scope === 'mine' && <button className="btn ghost sm" onClick={() => { setArch(!arch); setPage(1); }}>{arch ? '← Active posts' : 'Archived'}</button>}
      <Link href="/create" className="btn">＋ Create Post</Link>
    </div>
    {!d.posts.length && <p>{scope === 'mine' ? (arch ? 'No archived posts.' : 'You have no posts yet — create one!') : 'No posts yet. Be the first!'}</p>}
    <div className="grid">{d.posts.map(p => (
      <div key={p.id} className={`note${p.is_pinned ? ' pinned' : ''}`} data-c={p.color} role="button" tabIndex={0}
        onClick={() => setOpen(p)} onKeyDown={e => e.key === 'Enter' && setOpen(p)}>
        <h3>{p.title}</h3>{p.is_pinned && <span className="pin">Pinned</span>}
        {p.has_image ? <img loading="lazy" src={`/api/posts/${p.id}/image`} alt={`Cover image for ${p.title}`} /> : <div className="b rt" dangerouslySetInnerHTML={{ __html: toHtml(p.body) }} />}
        {p.ccount > 0 && <span className="cc" aria-label={`${p.ccount} comments`}>💬 {p.ccount}</span>}
      </div>))}</div>
    {open && <PostModal post={open} me={me} onClose={() => setOpen(null)} patch={patch} del={del} onCount={load} />}
  </>);
}
