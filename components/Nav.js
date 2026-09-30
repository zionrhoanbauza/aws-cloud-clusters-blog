'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CLOUD } from '@/components/Clouds';
export default function Nav() {
  const path = usePathname(); const [u, setU] = useState(null);
  useEffect(() => { fetch('/api/auth').then(r => r.json()).then(j => setU(j.user)); }, [path]);
  const L = ([h, t]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{t}</Link>;
  return (<nav><Link href="/" className="logo"><svg className="ico" viewBox="0 0 100 70" aria-hidden="true"><path d={CLOUD} /></svg><b>AWS</b> Cloud Clusters Blog</Link>
    {[['/', 'Home'], ['/bloggers', 'Bloggers'], ['/about', 'About']].map(L)}
    <Link href="/profile">{u ? u.username : 'Log in'}<span className="av" style={u?.avatar ? { backgroundImage: `url(${u.avatar})` } : undefined} /></Link></nav>);
}
