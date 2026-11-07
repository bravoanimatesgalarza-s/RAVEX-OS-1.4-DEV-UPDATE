const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ravex", {
  openBrowser: () => ipcRenderer.invoke("ravex:open-browser")
});