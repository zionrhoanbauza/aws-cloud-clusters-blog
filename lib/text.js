// only call this on text that already went through clean() on the server.
const TAGS = /<(p|div|br|b|i|u|s|strong|em|ul|ol|li|a|h4|mark|blockquote|span|strike|hr)[\s>/]/i;
export const toHtml = s => { s = s || ''; return TAGS.test(s) ? s : s.replace(/\n/g, '<br>'); }; 
