const { app, BrowserWindow, WebContentsView, ipcMain, shell } = require("electron");
const path = require("node:path");

let desktopWindow;
let browserWindow;
let browserView;

function createDesktop() {
  desktopWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 850,
    minHeight: 560,
    title: "RAVEX OS 0.5",
    backgroundColor: "#101522",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  desktopWindow.loadFile(path.join(__dirname, "index.html"));
}

function normalizeAddress(value) {
  const input = String(value || "").trim();
  if (!input) return "https://www.google.com";

  // Search terms go to Google. Explicit addresses are limited to HTTP(S).
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(input)) {
    if (input.includes(" ") || !input.includes(".")) {
      return "https://www.google.com/search?q=" + encodeURIComponent(input);
    }
    return "https://" + input;
  }

  try {
    const url = new URL(input);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch (_) {}
  return "https://www.google.com/search?q=" + encodeURIComponent(input);
}

function createBrowser() {
  if (browserWindow && !browserWindow.isDestroyed()) {
    browserWindow.show();
    browserWindow.focus();
    return;
  }

  browserWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 700,
    minHeight: 480,
    title: "RAVEX Browser — Chromium",
    backgroundColor: "#151923",
    webPreferences: {
      preload: path.join(__dirname, "browser-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  browserWindow.contentView.addChildView(browserView);
  browserWindow.loadFile(path.join(__dirname, "browser.html"));

  const setBrowserBounds = () => {
    if (!browserWindow || browserWindow.isDestroyed() || !browserView) return;
    const [width, height] = browserWindow.getContentSize();
    browserView.setBounds({
      x: 0,
      y: 58,
      width,
      height: Math.max(100, height - 58)
    });
  };

  browserWindow.on("resize", setBrowserBounds);
  browserWindow.webContents.once("did-finish-load", setBrowserBounds);

  browserView.webContents.loadURL("https://www.google.com");

  browserView.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) browserView.webContents.loadURL(url);
    return { action: "deny" };
  });

  browserView.webContents.on("will-navigate", (_event, url) => {
    if (!/^https?:\/\//i.test(url)) return;
  });

  browserView.webContents.on("page-title-updated", (_event, title) => {
    if (browserWindow && !browserWindow.isDestroyed()) {
      browserWindow.setTitle(`${title} — RAVEX Browser`);
    }
  });

  browserWindow.on("closed", () => {
    browserWindow = null;
    browserView = null;
  });
}

ipcMain.handle("ravex:open-browser", () => createBrowser());

ipcMain.handle("browser:navigate", (_event, address) => {
  if (!browserView || browserView.webContents.isDestroyed()) return;
  return browserView.webContents.loadURL(normalizeAddress(address));
});

ipcMain.handle("browser:back", () => {
  if (browserView?.webContents.canGoBack()) browserView.webContents.goBack();
});

ipcMain.handle("browser:forward", () => {
  if (browserView?.webContents.canGoForward()) browserView.webContents.goForward();
});

ipcMain.handle("browser:reload", () => browserView?.webContents.reload());
ipcMain.handle("browser:home", () => browserView?.webContents.loadURL("https://www.google.com"));

app.whenReady().then(() => {
  createDesktop();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createDesktop();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});