// Carrega o conteúdo sob demanda e guarda em memória. "no-cache" revalida no servidor a cada visita.
const cache = new Map();

function get(path, as) {
  const key = `${as}:${path}`;
  if (!cache.has(key)) {
    const promise = fetch(path, { cache: 'no-cache' }).then((res) => {
      if (!res.ok) throw new Error(`Não foi possível carregar ${path} (HTTP ${res.status})`);
      return as === 'json' ? res.json() : res.text();
    });
    cache.set(key, promise);
    promise.catch(() => cache.delete(key));
  }
  return cache.get(key);
}

export async function loadLanguages() {
  const catalog = await get('content/catalog.json', 'json');
  return Promise.all(catalog.languages.map(async ({ id, dir }) => {
    const lang = await get(`content/${dir}/language.json`, 'json');
    return { ...lang, id, dir, modules: lang.modules.map((m) => ({ ...m, key: `${id}.${m.id}` })) };
  }));
}

export async function loadModuleBank(language, module) {
  const base = `content/${language.dir}/${module.dir}`;
  const [q, c] = await Promise.all([get(`${base}/questions.json`, 'json'), get(`${base}/flashcards.json`, 'json')]);
  const tag = (item) => ({ ...item, lang: language.id, module: module.key });
  return { questions: q.questions.map(tag), cards: c.cards.map(tag) };
}

export async function loadBanks(languages, moduleKeys = null) {
  const wanted = moduleKeys ? new Set(moduleKeys) : null;
  const jobs = [];
  for (const language of languages) {
    for (const module of language.modules) {
      if (!wanted || wanted.has(module.key)) jobs.push(loadModuleBank(language, module));
    }
  }
  const banks = await Promise.all(jobs);
  return { questions: banks.flatMap((b) => b.questions), cards: banks.flatMap((b) => b.cards) };
}

export const loadLesson = (language, module, lesson) => get(`content/${language.dir}/${module.dir}/${lesson.file}`, 'text');
export const loadReference = (language) => get(`content/${language.dir}/${language.reference}`, 'text');
export const loadAchievementTexts = () => get('content/achievements.json', 'json');

// Desafios "Experimente" do fim das aulas. Só existem em linguagens com banco (engine).
export async function loadChallenges(language, module) {
  if (!language.engine) return [];
  const data = await get(`content/${language.dir}/${module.dir}/challenges.json`, 'json');
  return data.challenges.map((item) => ({ ...item, lang: language.id, module: module.key }));
}

// Um conjunto de tabelas: o esquema, os dados visíveis e os ocultos (textos SQL).
export async function loadDataset(language, id) {
  const base = `content/${language.dir}/datasets/${id}`;
  const [schema, data, hidden] = await Promise.all(
    ['schema.sql', 'data.sql', 'hidden-data.sql'].map((file) => get(`${base}/${file}`, 'text')),
  );
  return { schema, data, hidden };
}
