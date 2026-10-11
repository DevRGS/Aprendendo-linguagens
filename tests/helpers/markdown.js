// Nos testes, o Markdown usa as mesmas versões da CDN, instaladas como devDependencies.
import { marked } from 'marked';
import hljs from 'highlight.js';
import { initMarkdown } from '../../js/ui/markdown.js';

export const initTestMarkdown = () => initMarkdown({ marked, hljs });
