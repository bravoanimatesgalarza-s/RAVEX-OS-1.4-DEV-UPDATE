const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ravexBrowser", {
  navigate: (address) => ipcRenderer.invoke("browser:navigate", address),
  back: () => ipcRenderer.invoke("browser:back"),
  forward: () => ipcRenderer.invoke("browser:forward"),
  reload: () => ipcRenderer.invoke("browser:reload"),
  home: () => ipcRenderer.invoke("browser:home")
});