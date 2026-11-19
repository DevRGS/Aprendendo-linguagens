import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { unzipSync } from 'fflate';
import { parseRoute } from '../js/router.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const json = path => JSON.parse(read(path));
const ids = ['git', 'machine-learning', 'html-css', 'typescript', 'postgresql'];

test('trilhas da expansão ligam currículo, prática, links internos e kit publicado', () => {
  const catalog = json('content/catalog.json').languages;
  const languages = new Map(catalog.map(({ id, dir }) => [id, json(`content/${dir}/language.json`)]));
  for (const id of ids) {
    const base = `content/${id}`;
    const lang = languages.get(id);
    assert.ok(lang, id);
    assert.equal(lang.modules.length, 5, id);
    const sources = [`${base}/${lang.reference}`];
    for (const mod of lang.modules) {
      assert.equal(mod.lessons.length, 4, mod.id);
      const dir = `${base}/${mod.dir}`;
      const { questions } = json(`${dir}/questions.json`);
      const { cards } = json(`${dir}/flashcards.json`);
      for (const lesson of mod.lessons) {
        assert.equal(questions.filter(q => q.lesson === lesson.id).length, 4, lesson.id);
        assert.equal(cards.filter(c => c.lesson === lesson.id).length, 2, lesson.id);
        sources.push(`${dir}/${lesson.file}`);
      }
    }
    for (const file of sources) {
      const markdown = read(file).replace(/```[^\n]*\n[\s\S]*?```/g, '');
      for (const [, href] of markdown.matchAll(/\]\(((?:#\/|content\/)[^\s)]+)\)/g)) {
        const message = `${file} → ${href}`;
        if (!href.startsWith('#')) {
          assert.ok(existsSync(new URL(href, root)), message);
          continue;
        }
        const { name, params } = parseRoute(href);
        assert.notEqual(name, 'notFound', message);
        if (!params.lang) continue;
        const target = languages.get(params.lang);
        assert.ok(target, message);
        if (!params.module) continue;
        const mod = target.modules.find(m => m.id === params.module);
        assert.ok(mod, message);
        if (params.lesson) assert.ok(mod.lessons.some(l => l.id === params.lesson), message);
      }
    }
    const kit = unzipSync(readFileSync(new URL(`${base}/projetos/projeto.zip`, root)));
    assert.ok(Object.keys(kit).some(path => /readme\.md$/i.test(path)), id);
  }
});
