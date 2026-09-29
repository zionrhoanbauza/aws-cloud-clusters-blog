import './globals.css';
import Nav from '@/components/Nav';
export const metadata = { title: 'AWS Cloud Clusters Blog' };
export default function L({ children }) {
  return (<html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Kalam:wght@400;700&display=swap" /></head>
    <body><Nav /><main>{children}</main></body></html>);
}
