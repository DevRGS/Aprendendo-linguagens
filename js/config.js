// Constantes da aplicação. O nome do produto vive só aqui.
export const APP_NAME = 'Central de Linguagens';

export const STORAGE_KEY = 'central-linguagens:state';
export const CORRUPT_KEY_PREFIX = 'central-linguagens:corrupt:';
export const PRE_IMPORT_KEY = 'central-linguagens:pre-import';
export const REMINDER_DISMISS_KEY = 'central-linguagens:reminder-dismissed-until';
export const AUTO_BACKUP_PAUSE_KEY = 'central-linguagens:auto-backup-paused';
export const IDB_NAME = 'central-linguagens';
export const IDB_STORE = 'handles';

export const SAVE_DEBOUNCE_MS = 300;
export const AUTO_BACKUP_DEBOUNCE_MS = 5000;
export const AUTO_BACKUP_FILE_NAME = 'central-linguagens-backup.json';
export const REMINDER_SNOOZE_DAYS = 3;

// Um código Unicode por avatar: sequências com U+200D (como 🧑‍💻) viram dois desenhos no Windows 10.
export const AVATARS = ['💻', '🤖', '☕', '🦊', '🐱', '🐼', '🦉', '🐙', '🚀', '⭐', '🌱', '🎧'];
export const GOAL_OPTIONS = [
  { xp: 20, label: 'Leve', hint: '20 XP por dia' },
  { xp: 50, label: 'Normal', hint: '50 XP por dia' },
  { xp: 100, label: 'Intenso', hint: '100 XP por dia' },
];

export const MARKED_URL = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';
export const HLJS_URL = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/es/highlight.min.js';
