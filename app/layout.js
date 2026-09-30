import './globals.css';
import Nav from '@/components/Nav';
import Clouds from '@/components/Clouds';
import GlobalLoader from '@/components/GlobalLoader';
export const metadata = { title: 'AWS Cloud Clusters Blog' };
export default function L({ children }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Inter:wght@400;500;600;700&family=Kalam:wght@400;700&display=swap" /></head>
    <body><GlobalLoader /><Clouds /><Nav /><main>{children}</main></body></html>);
}
