import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import './style.css';

self.MonacoEnvironment = { getWorker(_id, label) {
  if (['json','javascript','typescript'].includes(label)) return new TsWorker();
  if (['css','scss','less'].includes(label)) return new CssWorker();
  if (['html','handlebars','razor'].includes(label)) return new HtmlWorker();
  return new EditorWorker();
}};

const files = {
 'index.html': {language:'html', value:'<main class="welcome">\\n  <h1>Hola, RAVEX!</h1>\\n  <p>Tu espacio para crear.</p>\\n  <button id="hello">Saludar</button>\\n</main>'},
 'style.css': {language:'css', value:'body {\\n  margin: 0;\\n  background: #171a21;\\n  color: #f4f1ff;\\n  font-family: system-ui, sans-serif;\\n}\\n\\n.welcome { padding: 40px; }\\nh1 { color: #b49aff; }'},
 'app.js': {language:'javascript', value:'const button = document.querySelector("#hello");\\nbutton?.addEventListener("click", () => {\\n  alert("¡Hola desde RAVEX!");\\n});'},
 'hello.au': {language:'plaintext', value:'// Aurora language sample\\nspark "Hola, Aurora!"\\nshow("Bienvenido a RAVEX CODE")'}
};
let active='index.html', pending=null, editor;
const $=s=>document.querySelector(s);
$('#app').innerHTML=`
<div class="shell">
<header class="topbar"><div class="brand"><span class="mark">✦</span><b>RAVEX CODE</b><span class="profile">DEVELOPER</span></div><span class="status">● Editor listo</span></header>
<div class="workspace">
<aside class="explorer"><div class="label">EXPLORER</div><div class="project">⌄ &nbsp; ravex-project</div><div id="files"></div><div class="foot">RAVEX SOFTWARE<br><small>CODE · 1.0</small></div></aside>
<main class="editor-area"><div class="tabs"><div id="tab">◇ index.html</div><button id="preview">Vista previa</button></div><div id="monaco"></div><div class="statusbar" id="lang">HTML　 ·　 UTF-8　 ·　 RAVEX CODE</div></main>
<aside class="helper"><div class="helper-head"><span class="mark">✦</span><div><b>Code Helper</b><small>Tu compañero de programación</small></div></div><div class="context">CONTEXTO: <b id="ctx">index.html</b></div><div class="chat" id="chat"><div class="msg assistant"><b>Code Helper</b><br>¡Hola, desarrollador! 👋<br><br>Puedo explicarte el archivo abierto, revisar posibles problemas y preparar propuestas de cambios.</div><div class="quick"><button data-q="Explícame el archivo actual">✦ Explicar código</button><button data-q="Revisa posibles errores">⌕ Revisar errores</button><button data-q="Dame una idea para mejorar este proyecto">✧ Ideas de mejora</button></div></div><div class="composer"><textarea id="prompt" rows="3" placeholder="Pregúntale algo a Code Helper..."></textarea><div><small>Enter para enviar</small><button id="send">Enviar ↑</button></div></div><div class="disclaimer">Modo demostración · IA no conectada</div></aside>
</div>
<div id="proposal" class="proposal hidden"><div><b>✦ Propuesta de Code Helper</b><p id="description"></p></div><div><button id="discard">Descartar</button><button id="apply">Aplicar cambio</button></div></div>
</div>
<div id="modal" class="modal hidden"><div class="preview-window"><header>Vista previa <button id="close">✕</button></header><iframe id="frame" sandbox="allow-scripts"></iframe></div></div>`;
function renderFiles(){ $('#files').innerHTML=Object.keys(files).map(n=>`<button class="file ${n===active?'active':''}" data-file="${n}">◇ ${n}</button>`).join('');document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>openFile(b.dataset.file));}
function save(){if(editor)files[active].value=editor.getValue();}
function openFile(n){save();active=n;editor.setValue(files[n].value);monaco.editor.setModelLanguage(editor.getModel(),files[n].language);$('#tab').textContent='◇ '+n;$('#ctx').textContent=n;$('#lang').textContent=files[n].language.toUpperCase()+'　 ·　 UTF-8　 ·　 RAVEX CODE';renderFiles();}
editor=monaco.editor.create($('#monaco'),{value:files[active].value,language:files[active].language,theme:'vs-dark',automaticLayout:true,minimap:{enabled:false},fontSize:13,lineHeight:22,tabSize:2,scrollBeyondLastLine:false,wordWrap:'on',padding:{top:14}});
renderFiles();
function message(t,role='assistant'){const d=document.createElement('div');d.className='msg '+role;d.textContent=t;$('#chat').append(d);$('#chat').scrollTop=$('#chat').scrollHeight;}
function propose(desc,value){pending=value;$('#description').textContent=desc;$('#proposal').classList.remove('hidden');}
function ask(q){save();message(q,'user');const l=q.toLowerCase(),c=files[active].value;
if(l.includes('explica'))message(active.endsWith('.html')?'Este archivo HTML define la estructura de la página: encabezados, párrafos y botones.':active.endsWith('.css')?'Este archivo CSS controla colores, espacios, tipografía y apariencia.':active.endsWith('.js')?'Este archivo JavaScript contiene lógica e interacciones.':'Este archivo .au muestra texto de ejemplo de Aurora. Para ejecutarlo necesitarías un intérprete.');
else if(l.includes('error')||l.includes('revisa'))message('Revisión orientativa: comprueba que los selectores coincidan con los elementos HTML. Monaco aporta resaltado y diagnósticos del lenguaje, pero esta demo no ejecuta un análisis con IA.');
else if(l.includes('idea')||l.includes('mejor')){message('Puedo preparar una pequeña propuesta para que la revises antes de aplicarla.');propose('Añadir una descripción accesible al botón.',c.includes('<button id="hello">')?c.replace('<button id="hello">','<button id="hello" title="Pulsa para saludar">'):'/* Propuesta de mejora */\\n'+c);}
else message('Esta maqueta tiene respuestas de ejemplo. Para conversar libremente y generar código con IA, falta conectar un servicio de IA.');}
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>ask(b.dataset.q));
$('#send').onclick=()=>{const q=$('#prompt').value.trim();if(q){$('#prompt').value='';ask(q);}};
$('#prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#send').click();}};
$('#apply').onclick=()=>{if(pending!==null){editor.setValue(pending);save();pending=null;$('#proposal').classList.add('hidden');message('Propuesta aplicada. Puedes deshacerla con Ctrl+Z.');editor.focus();}};
$('#discard').onclick=()=>{$('#proposal').classList.add('hidden');pending=null;};
$('#preview').onclick=()=>{save();const doc='<!doctype html><html><head><meta charset="utf-8"><style>'+files['style.css'].value+'</style></head><body>'+files['index.html'].value+'<script>'+files['app.js'].value.replaceAll('</script>','<\\\\/script>')+'<\\\\/script></body></html>';$('#frame').srcdoc=doc;$('#modal').classList.remove('hidden');};
$('#close').onclick=()=>$('#modal').classList.add('hidden');
