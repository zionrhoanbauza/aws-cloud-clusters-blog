import sanitizeHtml from 'sanitize-html';
const col = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i];
export const clean = html => sanitizeHtml(String(html || ''), {
  allowedTags: ['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'mark', 'span', 'a', 'ul', 'ol', 'li', 'br', 'p', 'div', 'h4', 'blockquote', 'hr'],
  allowedAttributes: { a: ['href', 'target', 'rel'], span: ['style'] },
  allowedStyles: { span: { color: col, 'background-color': col } },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: { a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' }) },
});
