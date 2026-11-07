
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ravex", {
  openBrowser: () => ipcRenderer.invoke(
    "ravex:open-url",
    "https://www.google.com"
  ),

  onAction: (callback) => {
    ipcRenderer.on("ravex:action", (_event, data) => {
      callback(data);
    });
  }
});

