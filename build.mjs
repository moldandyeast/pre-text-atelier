// Builds public/index.html from the original piece in src/, verbatim except for three splices:
// js-yaml inlined in place of its CDN <script src>, the credits CSS, and the credits bar.
import { readFileSync, writeFileSync } from 'node:fs';

const read = p => readFileSync(new URL(p, import.meta.url), 'utf8');
let html = read('./src/pre-textile-atelier.html');

const splice = (find, replace) => {
  if (html.split(find).length !== 2) throw new Error(`expected exactly one match for ${find}`);
  html = html.replace(find, () => replace);
};

const yaml = read('./vendor/js-yaml/js-yaml.min.js').trimEnd();
if (yaml.includes('</script')) throw new Error('js-yaml contains </script');
splice('<script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>', `<script>${yaml}</script>`);
splice('</style>\n\n<div id="app">\n', `\n${read('./src/credits.css')}</style>\n\n<div id="app">\n${read('./src/credits.html')}`);

writeFileSync(new URL('./public/index.html', import.meta.url), html);
console.log(`public/index.html ${html.length} chars`);
