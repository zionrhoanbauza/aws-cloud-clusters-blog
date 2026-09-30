'use client';
import { useEffect, useState } from 'react';
export function CloudLoader() {
  const d = s => ({ animationDelay: s + 's' });
  return (<div className="loader" role="status" aria-live="polite">
    <svg viewBox="0 0 160 100" width="170" height="106" aria-hidden="true">
      <rect className="puff" x="30" y="50" width="100" height="30" rx="15" style={d(0)} />
      <circle className="puff" cx="58" cy="54" r="20" style={d(0.15)} />
      <circle className="puff" cx="86" cy="42" r="28" style={d(0.4)} />
      <circle className="puff" cx="114" cy="56" r="20" style={d(0.65)} />
    </svg><p>Forming clouds…</p></div>);
}
export default function GlobalLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const orig = window.fetch; let n = 0, t, h;
    const idle = () => { clearTimeout(h); h = setTimeout(() => n === 0 && setShow(false), 300); };
    window.fetch = async (u, o) => {
      const hd = o?.headers || {};
      if (hd['Next-Router-Prefetch'] || hd['next-router-prefetch']) return orig.call(window, u, o);
      n++; clearTimeout(h); if (n === 1) t = setTimeout(() => setShow(true), 200);
      try { return await orig.call(window, u, o); }
      finally { n--; if (n === 0) { clearTimeout(t); idle(); } }
    };
    idle();
    return () => { window.fetch = orig; clearTimeout(t); clearTimeout(h); };
  }, []);
  return show ? <CloudLoader /> : null;
}
