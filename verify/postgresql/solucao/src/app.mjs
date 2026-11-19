import express from 'express';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './database.mjs';
import { ApiError, credentials, taskBody, integer } from './errors.mjs';
import { passwordRecord, verifyPassword, token, tokenHash, cookieToken, equalToken } from './security.mjs';

const SESSION_MS = 8 * 60 * 60 * 1000;
const WINDOW_MS = 5 * 60 * 1000;

export function createApplication({ databaseUrl = process.env.DATABASE_URL, schema, origin, secureCookies = false, clock = () => Date.now(), authLimit = 10 }) {
  const configured = new URL(origin);
  if (configured.origin !== origin || !['http:', 'https:'].includes(configured.protocol)) throw new Error('APP_ORIGIN deve ser uma origem HTTP(S), sem caminho ou barra final.');
  if (secureCookies && configured.protocol !== 'https:') throw new Error('Cookies Secure exigem origem HTTPS.');
  const store = openDatabase(databaseUrl, schema);
  const app = express();
  const attempts = new Map();
  const cookieName = secureCookies ? '__Host-estudos_sessao' : 'estudos_sessao';
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: secureCookies, path: '/' };
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    });
    next();
  });
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== origin) {
      return next(new ApiError(403, 'ORIGEM', 'Origem não permitida.'));
    }
    if (['POST', 'PATCH'].includes(req.method) && !req.is('application/json')) {
      return next(new ApiError(415, 'TIPO', 'Use Content-Type: application/json.'));
    }
    next();
  });
  app.use('/api', express.json({ limit: '16kb', strict: true }));

  function rateLimit(req, res, next) {
    const now = clock();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const key = req.ip;
    if (!attempts.has(key) && attempts.size >= 1000) return next(new ApiError(503, 'OCUPADO', 'Muitas origens de autenticação. Tente depois.'));
    const value = attempts.get(key) ?? { count: 0, until: now + WINDOW_MS };
    value.count += 1;
    attempts.set(key, value);
    if (value.count > authLimit) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((value.until - now) / 1000))));
      return next(new ApiError(429, 'LIMITE', 'Muitas tentativas. Aguarde antes de tentar novamente.'));
    }
    next();
  }
  async function authenticated(req, res, next) {
    const raw = cookieToken(req.get('cookie'), cookieName);
    const session = raw && await store.session(tokenHash(raw), clock());
    if (!session) return next(new ApiError(401, 'SESSAO', 'Entre na sua conta para continuar.'));
    req.session = { ...session, tokenHash: tokenHash(raw) };
    next();
  }
  function csrf(req, res, next) {
    if (!equalToken(req.get('x-csrf-token'), req.session.csrf)) return next(new ApiError(403, 'CSRF', 'Token de proteção inválido. Recarregue a sessão.'));
    next();
  }
  const missing = () => new ApiError(404, 'NAO_ENCONTRADO', 'Recurso não encontrado.');

  app.get('/api/saude', (req, res) => res.json({ ok: true }));
  app.post('/api/usuarios', rateLimit, async (req, res) => {
    const { usuario, senha } = credentials(req.body);
    if (await store.userByName(usuario)) throw new ApiError(409, 'CONFLITO', 'Este nome de usuário já está em uso.');
    const record = await passwordRecord(senha);
    try {
      const user = await store.createUser(usuario, record.sal, record.hash);
      res.status(201).json({ usuario: user });
    } catch (error) {
      if (error.code === '23505') throw new ApiError(409, 'CONFLITO', 'Este nome de usuário já está em uso.');
      throw error;
    }
  });
  app.post('/api/sessao', rateLimit, async (req, res) => {
    const input = credentials(req.body);
    const user = await store.userByName(input.usuario);
    if (!await verifyPassword(input.senha, user)) throw new ApiError(401, 'CREDENCIAIS', 'Usuário ou senha inválidos.');
    const raw = token();
    const csrfValue = token();
    const previous = cookieToken(req.get('cookie'), cookieName);
    await store.rotateSession(previous ? tokenHash(previous) : null, tokenHash(raw), user.id, csrfValue, clock() + SESSION_MS, clock());
    res.cookie(cookieName, raw, { ...cookieOptions, maxAge: SESSION_MS });
    res.json({ usuario: { id: user.id, usuario: user.usuario }, csrf: csrfValue });
  });
  app.get('/api/sessao', authenticated, (req, res) => res.json({ usuario: { id: req.session.id, usuario: req.session.usuario }, csrf: req.session.csrf }));
  app.delete('/api/sessao', authenticated, csrf, async (req, res) => {
    await store.deleteSession(req.session.tokenHash);
    res.clearCookie(cookieName, cookieOptions);
    res.status(204).end();
  });

  app.use('/api/tarefas', authenticated);
  app.get('/api/tarefas', async (req, res) => {
    const limit = integer(req.query.limit, { max: 50, fallback: 20 });
    const offset = integer(req.query.offset, { min: 0, max: 1_000_000, fallback: 0 });
    res.json(await store.tasks(req.session.id, limit, offset));
  });
  app.get('/api/tarefas/:id', async (req, res) => {
    const task = await store.task(req.session.id, integer(req.params.id));
    if (!task) throw missing();
    res.json(task);
  });
  app.post('/api/tarefas', csrf, async (req, res) => {
    const body = taskBody(req.body);
    const task = await store.createTask(req.session.id, body.titulo);
    res.status(201).location(`/api/tarefas/${task.id}`).json(task);
  });
  app.patch('/api/tarefas/:id', csrf, async (req, res) => {
    const id = integer(req.params.id);
    const value = taskBody(req.body, true);
    const task = await store.updateTask(req.session.id, id, value);
    if (!task) throw missing();
    res.json(task);
  });
  app.delete('/api/tarefas/:id', csrf, async (req, res) => {
    if (!await store.deleteTask(req.session.id, integer(req.params.id))) throw missing();
    res.status(204).end();
  });
  app.use('/api', (req, res, next) => next(missing()));
  app.use(express.static(fileURLToPath(new URL('../public/', import.meta.url)), { dotfiles: 'deny', index: 'index.html' }));
  app.use((req, res, next) => next(missing()));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') error = new ApiError(413, 'TAMANHO', 'O corpo deve ter no máximo 16 KiB.');
    else if (error.type === 'entity.parse.failed') error = new ApiError(400, 'JSON', 'JSON inválido.');
    const known = error instanceof ApiError;
    res.status(known ? error.status : 500).json({ erro: { codigo: known ? error.code : 'INTERNO', mensagem: known ? error.message : 'Falha interna. Tente novamente.' } });
  });
  return { app, close: () => store.close() };
}
