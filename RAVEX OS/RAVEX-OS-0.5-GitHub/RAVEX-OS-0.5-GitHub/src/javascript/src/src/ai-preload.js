
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ravexAI", {
  sendCommand: (command) =>
    ipcRenderer.invoke("ravex-ai:command", command)
});
