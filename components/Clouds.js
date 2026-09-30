export const CLOUD = 'M20 60a14 14 0 0 1 2-28a20 20 0 0 1 37-6a16 16 0 0 1 25 12a12 12 0 0 1-2 22z';
// [top %, resting left %, width px, drift seconds, head start seconds]
const C = [[6, 8, 260, 150, 20], [20, 70, 180, 190, 110], [38, 30, 320, 240, 60], [52, 85, 220, 170, 30], [68, 12, 280, 210, 150], [84, 55, 200, 180, 90]];
export default function Clouds() {
  return (<div className="sky" aria-hidden="true">{C.map(([t, x, w, d, s], i) => (
    <svg key={i} className="cloud" viewBox="0 0 100 70" style={{ top: t + '%', width: w, '--x': x + '%', animationDuration: d + 's', animationDelay: '-' + s + 's' }}><path d={CLOUD} /></svg>))}</div>);
}
