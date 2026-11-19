import pg from 'pg';
import { readFileSync } from 'node:fs';

export function openDatabase(databaseUrl, schema = 'central_api') {
  if (!databaseUrl || !['/central_lab', '/central_lab_test'].includes(new URL(databaseUrl).pathname)) {
    throw new Error('Configure DATABASE_URL para a base dedicada central_lab ou central_lab_test.');
  }
  if (!/^central_(api|teste_[0-9a-f]+)$/.test(schema)) throw new Error('Esquema inválido.');
  const pool = new pg.Pool({ connectionString: databaseUrl, options: `-c search_path=${schema}` });
  async function transacao(acao) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const valor = await acao(client);
      await client.query('COMMIT');
      return valor;
    } catch (erro) {
      await client.query('ROLLBACK');
      throw erro;
    } finally {
      client.release();
    }
  }
  async function primeira(sql, valores) {
    const { rows } = await pool.query(sql, valores);
    return rows[0] ?? null;
  }
  return {
    async migrar() {
      const sql = readFileSync(new URL('../sql/001-inicial.sql', import.meta.url), 'utf8');
      await transacao(async client => {
        await client.query('SELECT pg_advisory_xact_lock(89014273)');
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
        await client.query(sql);
      });
    },
    userByName: nome => primeira('SELECT id, usuario, sal, hash FROM usuarios WHERE usuario = $1', [nome]),
    createUser: (nome, sal, hash) => primeira('INSERT INTO usuarios(usuario, sal, hash) VALUES ($1, $2, $3) RETURNING id, usuario', [nome, sal, hash]),
    session: (hash, agora) => primeira(`SELECT u.id, u.usuario, s.csrf FROM sessoes s JOIN usuarios u ON u.id=s.usuario_id
      WHERE s.token_hash=$1 AND s.expira_em>$2`, [hash, agora]),
    async rotateSession(anterior, hash, usuarioId, csrf, expira, agora) {
      // Todos os comandos usam a mesma conexão até confirmar ou desfazer a troca.
      await transacao(async client => {
        await client.query('DELETE FROM sessoes WHERE expira_em <= $1 OR token_hash = $2', [agora, anterior]);
        await client.query('INSERT INTO sessoes(token_hash, usuario_id, csrf, expira_em) VALUES ($1,$2,$3,$4)', [hash, usuarioId, csrf, expira]);
      });
    },
    deleteSession: hash => pool.query('DELETE FROM sessoes WHERE token_hash=$1', [hash]),
    async tasks(usuarioId, limit, offset) {
      const { total } = await primeira('SELECT count(*)::integer AS total FROM tarefas WHERE usuario_id=$1', [usuarioId]);
      const { rows: itens } = await pool.query('SELECT id,titulo,concluida FROM tarefas WHERE usuario_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3', [usuarioId, limit, offset]);
      return { itens, total, limit, offset };
    },
    task: (usuarioId, id) => primeira('SELECT id,titulo,concluida FROM tarefas WHERE usuario_id=$1 AND id=$2::bigint', [usuarioId, id]),
    createTask: (usuarioId, titulo) => primeira('INSERT INTO tarefas(usuario_id,titulo) VALUES ($1,$2) RETURNING id,titulo,concluida', [usuarioId, titulo]),
    updateTask: (usuarioId, id, valor) => primeira(`UPDATE tarefas SET titulo=coalesce($3,titulo), concluida=coalesce($4,concluida)
      WHERE usuario_id=$1 AND id=$2::bigint RETURNING id,titulo,concluida`, [usuarioId, id, valor.titulo, valor.concluida]),
    async deleteTask(usuarioId, id) {
      const { rowCount } = await pool.query('DELETE FROM tarefas WHERE usuario_id=$1 AND id=$2::bigint', [usuarioId, id]);
      return rowCount === 1;
    },
    close: () => pool.end(),
  };
}
