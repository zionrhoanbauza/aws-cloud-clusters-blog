'use client';
import { useRef } from 'react';
const COLORS = [['#6a1aa8', 'Purple'], ['#3f74a8', 'Blue'], ['#2f7a51', 'Green'], ['#b3261e', 'Red']];
export default function Editor({ onChange, labelledBy }) {
  const ref = useRef(null);
  const run = (c, v) => {
    ref.current.focus();
    document.execCommand('styleWithCSS', false, c === 'hiliteColor' || c === 'foreColor');
    document.execCommand(c, false, v);
    onChange(ref.current.innerHTML);
  };
  const block = t => run('formatBlock', (document.queryCommandValue('formatBlock') || '').toLowerCase() === t ? 'div' : t);
  function link() {
    const sel = getSelection();
    if (!sel || sel.isCollapsed || !ref.current.contains(sel.anchorNode)) return alert('Highlight some text first, then click Link.');
    const r = sel.getRangeAt(0).cloneRange();
    let url = prompt('Link address (https://...)'); if (!url) return;
    if (!/^(https?:|mailto:)/i.test(url)) url = 'https://' + url;
    sel.removeAllRanges(); sel.addRange(r); run('createLink', url);
  }
  const B = (label, title, fn, style) => (<button type="button" key={title} title={title} aria-label={title} style={style} onMouseDown={e => e.preventDefault()} onClick={fn}>{label}</button>);
  return (<div>
    <div className="tb" role="toolbar" aria-label="Text formatting">
      {B('B', 'Bold', () => run('bold'), { fontWeight: 700 })}
      {B('I', 'Italic', () => run('italic'), { fontStyle: 'italic' })}
      {B('U', 'Underline', () => run('underline'), { textDecoration: 'underline' })}
      {B('S', 'Strikethrough', () => run('strikeThrough'), { textDecoration: 'line-through' })}
      {B('🖍', 'Highlight', () => run('hiliteColor', '#fff176'))}
      {B('H', 'Heading', () => block('h4'), { fontWeight: 700 })}
      {B('• List', 'Bullet list', () => run('insertUnorderedList'))}
      {B('1. List', 'Numbered list', () => run('insertOrderedList'))}
      {B('❝', 'Quote', () => block('blockquote'))}
      {B('🔗', 'Link', link)}
      {B('―', 'Divider line', () => run('insertHorizontalRule'))}
      {COLORS.map(([c, n]) => B('A', 'Text color ' + n, () => run('foreColor', c), { color: c, fontWeight: 700 }))}
      {B('Clear', 'Clear formatting', () => run('removeFormat'))}
    </div>
    <div ref={ref} className="ed rt" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-labelledby={labelledBy}
      data-ph="Write your post here... highlight text to format it" onInput={e => onChange(e.currentTarget.innerHTML)}
      onPaste={e => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }} />
  </div>);
}
