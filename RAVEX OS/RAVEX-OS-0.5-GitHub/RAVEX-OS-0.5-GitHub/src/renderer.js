const $ = id => document.getElementById(id);
let activeApp = null;
let maximized = false;
let savedGeometry = null;

const demoFiles = [
  {name:"Documentos", type:"folder", icon:"📁"},
  {name:"Imágenes", type:"folder", icon:"🖼️"},
  {name:"Descargas", type:"folder", icon:"⬇️"},
  {name:"Bienvenido.txt", type:"file", icon:"📄", content:"¡Bienvenido a RAVEX OS 0.5!\n\nEste es tu espacio digital."}
];

function openApp(name) {
  activeApp = name;
  $("appWindow").classList.remove("hidden");
  $("activeApp").textContent = appNames[name] || "Escritorio";
  $("windowTitle").textContent = appNames[name] || "Aplicación";
  renderApp(name);
}
const appNames = {
  launchpad:"Launchpad", explorer:"RAVEX Explorer",
  notes:"Notas", settings:"Ajustes"
};

function renderApp(name) {
  const body = $("windowBody");
  if (name === "launchpad") {
    body.innerHTML = `<h2>Launchpad</h2><p class="muted">Tus aplicaciones RAVEX</p>
      <div class="app-grid">
        ${card("📁","Explorer","Archivos","explorer")}
        <button class="app-card" onclick="window.ravex.openBrowser()"><div class="emoji">🌐</div><strong>RAVEX Browser</strong><small>Chromium</small></button>
        ${card("📝","Notas","Escribe y guarda","notes")}
        ${card("⚙️","Ajustes","Personaliza RAVEX","settings")}
      </div>`;
  }
  if (name === "explorer") {
    body.innerHTML = `<h2>📁 Explorer</h2><p class="muted">Inicio · Archivos de demostración</p>
      <div class="row"><button class="action" onclick="addDemoFolder()">＋ Nueva carpeta</button><button class="action" onclick="resetDemoFiles()">Restablecer</button></div>
      <div class="file-list" id="fileList"></div>`;
    renderDemoFiles();
  }
  if (name === "notes") {
    const saved = localStorage.getItem("ravex.notes") || "";
    body.innerHTML = `<h2>📝 Notas</h2><p class="muted">Tus notas se guardan en este equipo.</p>
      <textarea id="notesText" placeholder="Escribe aquí..."></textarea>
      <button class="action" onclick="saveNotes()">Guardar nota</button><span id="noteStatus" class="muted"></span>`;
    $("notesText").value = saved;
  }
  if (name === "settings") {
    body.innerHTML = `<h2>⚙️ Ajustes</h2>
      <div class="panel row"><div><strong>Apariencia</strong><p class="muted">Cambiar el tema del escritorio</p></div><button class="action" onclick="toggleTheme()">Cambiar tema</button></div>
      <div class="panel"><strong>Acerca de RAVEX</strong><p class="muted">RAVEX OS 0.5 · Chromium mediante Electron</p></div>`;
  }
}
function card(icon,title,desc,app){return `<button class="app-card" onclick="openApp('${app}')"><div class="emoji">${icon}</div><strong>${title}</strong><small>${desc}</small></button>`;}

function getDemoFiles() {
  try { return JSON.parse(localStorage.getItem("ravex.demoFiles")) || demoFiles; }
  catch { return [...demoFiles]; }
}
function renderDemoFiles() {
  const list = $("fileList");
  if (!list) return;
  list.innerHTML = "";
  getDemoFiles().forEach(file => {
    const el = document.createElement("div");
    el.className = "file-item";
    const icon = document.createElement("span");
    icon.textContent = file.icon;
    const label = document.createElement("strong");
    label.textContent = file.name;
    el.append(icon,label);
    el.ondblclick = () => {
      if (file.type === "file") alert(file.content || "Archivo de demostración.");
      else alert("Carpeta de demostración: " + file.name);
    };
    list.append(el);
  });
}
function addDemoFolder() {
  const name = prompt("Nombre de la carpeta:");
  if (!name || !name.trim()) return;
  const items = getDemoFiles();
  if (items.some(x => x.name.toLowerCase() === name.trim().toLowerCase())) {
    alert("Ya existe un elemento con ese nombre."); return;
  }
  items.push({name:name.trim(),type:"folder",icon:"📁"});
  localStorage.setItem("ravex.demoFiles",JSON.stringify(items));
  renderDemoFiles();
}
function resetDemoFiles() {
  localStorage.removeItem("ravex.demoFiles");
  renderDemoFiles();
}
function saveNotes() {
  localStorage.setItem("ravex.notes",$("notesText").value);
  $("noteStatus").textContent = " · Guardado";
}
function toggleTheme() { document.body.classList.toggle("light"); }
function closeApp() { $("appWindow").classList.add("hidden"); activeApp=null; $("activeApp").textContent="Escritorio"; }
function minimizeApp() { closeApp(); }
function maximizeApp() {
  const win=$("appWindow");
  if (!maximized) {
    savedGeometry={top:win.style.top,left:win.style.left,width:win.style.width,height:win.style.height,transform:win.style.transform};
    Object.assign(win.style,{top:"48px",left:"10px",width:"calc(100% - 20px)",height:"calc(100% - 120px)",transform:"none"});
  } else if(savedGeometry) Object.assign(win.style,savedGeometry);
  maximized=!maximized;
}
function updateClock(){ $("clock").textContent=new Date().toLocaleString("es-EC"); }
setInterval(updateClock,1000); updateClock();