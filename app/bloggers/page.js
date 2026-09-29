'use client';
import { useEffect, useState } from 'react';
export default function Bloggers() {
  const [b, setB] = useState([]);
  useEffect(() => { fetch('/api/bloggers').then(r => r.json()).then(j => setB(j.bloggers)); }, []);
  return (<><h2>Bloggers</h2><div className="grid">{b.map(x => (
    <div key={x.username} className="note" data-c="sky" style={{ cursor: 'default' }}>
      <h3>@{x.username}</h3><div className="b">{x.bio || 'No bio yet.'}<br /><small>{x.n} public post{x.n === 1 ? '' : 's'}</small></div></div>))}</div></>);
}
