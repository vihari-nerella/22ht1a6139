import { getLinks } from './storage';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateShortcode = (length = 6) => {
  const links = getLinks();
  const exists = (code) => links.some(l => l.shortcode === code);
  let code = '';
  do {
    code = Array.from({ length })
      .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
      .join('');
  } while (exists(code));
  return code;
};

export const isValidCustomShortcode = (s) => {
  if (!s) return false;
  return /^[A-Za-z0-9]{4,12}$/.test(s);
};