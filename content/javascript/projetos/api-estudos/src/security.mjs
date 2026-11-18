import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { ApiError } from './errors.mjs';

const scryptAsync = promisify(scrypt);
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
let active = 0;

async function derive(password, salt) {
  if (active >= 2) throw new ApiError(503, 'OCUPADO', 'Autenticação ocupada. Tente novamente em instantes.');
  active += 1;
  try { return await scryptAsync(password, salt, 64, options); }
  finally { active -= 1; }
}

export async function passwordRecord(password) {
  const sal = randomBytes(16).toString('hex');
  return { sal, hash: (await derive(password, sal)).toString('hex') };
}

export async function verifyPassword(password, user) {
  // O mesmo trabalho de derivação acontece mesmo quando o usuário não existe.
  const actual = await derive(password, user?.sal ?? '0'.repeat(32));
  const expected = Buffer.from(user?.hash ?? '0'.repeat(128), 'hex');
  return expected.length === actual.length && timingSafeEqual(actual, expected) && Boolean(user);
}

export const token = () => randomBytes(32).toString('hex');
export const tokenHash = (value) => createHash('sha256').update(value).digest('hex');

export function cookieToken(header, name) {
  const part = String(header ?? '').split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  const value = part?.slice(name.length + 1);
  return /^[a-f0-9]{64}$/.test(value ?? '') ? value : null;
}

export function equalToken(actual, expected) {
  if (typeof actual !== 'string' || !/^[a-f0-9]{64}$/.test(actual)) return false;
  return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
