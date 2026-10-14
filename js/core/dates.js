// Datas como "dia local" no formato YYYY-MM-DD (nunca UTC).
const pad = (n) => String(n).padStart(2, '0');

export function toDayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toUtcMs(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(key, n) {
  const dt = new Date(toUtcMs(key) + n * 86400000);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function diffDays(from, to) {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / 86400000);
}

export function isDayKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
