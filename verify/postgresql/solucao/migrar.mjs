import { existsSync } from 'node:fs';
import { openDatabase } from './src/database.mjs';
if (existsSync('.env')) process.loadEnvFile('.env');
const db = openDatabase(process.env.DATABASE_URL);
try {
  await db.migrar();
  console.log('Esquema central_api pronto.');
} finally {
  await db.close();
}
