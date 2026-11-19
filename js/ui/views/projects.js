import { h, mount } from '../dom.js';

// Só incluir projetos com roteiro publicado e material que possa ser baixado.
const projects = [
  { id: 'javascript', title: 'API de estudos', needs: 'JavaScript, Node.js e CRUD com SQLite',
    builds: 'Uma API com contas de usuário, sessões e tarefas privadas.', moduleId: 'backend-projeto', kit: 'projetos/api-estudos.zip' },
  { id: 'python', title: 'Relatório de viagens', needs: 'Python, pandas e separação de dados',
    builds: 'Uma auditoria de viagens com métricas e dados preparados para modelagem.', moduleId: 'projeto', kit: 'kits/projeto.zip' },
  { id: 'git', title: 'Guia de projeto versionado', needs: 'Terminal e fundamentos de Git',
    builds: 'Um guia revisado em uma branch e reproduzido a partir de uma versão marcada.' },
  { id: 'machine-learning', title: 'Previsão de duração de viagens', needs: 'Python, regressão e avaliação temporal',
    builds: 'Uma comparação documentada entre seu modelo e uma previsão de referência.' },
  { id: 'html-css', title: 'Catálogo de estudos acessível', needs: 'HTML semântico e CSS responsivo',
    builds: 'Um catálogo estático que o leitor consegue navegar por teclado e no celular.' },
  { id: 'typescript', title: 'API de estudos tipada', needs: 'JavaScript, HTTP e contratos em TypeScript',
    builds: 'Uma parte da API migrada para TypeScript, com validação de entrada e testes HTTP.' },
  { id: 'postgresql', title: 'CRUD de estudos com PostgreSQL', needs: 'SQL, transações e a API JavaScript',
    builds: 'Uma API conectada a um banco servidor, com operações atômicas e dados separados por usuário.' },
];

export function renderProjects(container, app) {
  const cards = projects.flatMap((p) => {
    const lang = app.getLanguage(p.id);
    if (!lang) return [];
    const module = p.moduleId ? lang.modules.find((m) => m.id === p.moduleId) : lang.modules.at(-1);
    if (!module?.lessons.length) return [];
    return h('article', { class: 'panel project-card', style: { '--accent': lang.color } },
      h('p', { class: 'eyebrow', text: `${lang.icon} ${lang.name}` }),
      h('h2', { text: p.title }), h('p', { text: p.builds }),
      h('p', { class: 'small muted' }, h('strong', { text: 'Antes de começar' }), ` · ${p.needs}.`),
      h('div', { class: 'actions' },
        h('a', { class: 'btn btn-primary', href: `#/${lang.id}/${module.id}/${module.lessons[0].id}`, text: 'Abrir roteiro' }),
        h('a', { class: 'link', href: `content/${lang.dir}/${p.kit ?? 'projetos/projeto.zip'}`, download: true,
          'aria-label': `Baixar material de ${p.title} (ZIP)`, text: 'Baixar ZIP' })));
  });
  mount(container, h('h1', { text: 'Projetos práticos' }), h('div', { class: 'project-gallery' }, cards));
}
