import './globals.css';
import Nav from '@/components/Nav';
export const metadata = { title: 'AWS Cloud Clusters Blog' };
export default function L({ children }) {
  return (<html lang="en"><head><link rel="stylesheet" href="family=Kalam:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" /></head>
    <body><Nav /><main>{children}</main></body></html>);
}
