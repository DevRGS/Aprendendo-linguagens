// Empacota somente fontes permitidas. Banco, .env e node_modules nunca entram no ZIP.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { zipSync } from 'fflate';

const base = new URL('../content/javascript/projetos/api-estudos/', import.meta.url);
const directories = new Set(['src', 'public', 'etapas', 'test']);
const topFiles = new Set(['README.md', 'package.json', 'package-lock.json', '.env.example', '.gitignore']);
const entries = {};
function collect(dir, relative = '') {
  for (const item of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = relative + item.name;
    if (item.isSymbolicLink()) continue;
    if (!relative && !(item.isDirectory() ? directories.has(item.name) : topFiles.has(item.name))) continue;
    if (item.name === 'node_modules' || item.name === 'data' || item.name === '.env' || /\.sqlite(?:-|$)/.test(item.name)) continue;
    const url = new URL(item.name + (item.isDirectory() ? '/' : ''), dir);
    if (item.isDirectory()) collect(url, path + '/');
    else entries['api-estudos/' + path] = readFileSync(url);
  }
}
collect(base);
writeFileSync(new URL('../content/javascript/projetos/api-estudos.zip', import.meta.url), zipSync(entries, { level: 9, mtime: new Date('2000-01-01T00:00:00Z') }));
console.log(`Projeto empacotado: ${Object.keys(entries).length} arquivos.`);
