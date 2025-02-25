// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  openExternalURL: (url) => ipcRenderer.send("open-external-url", url),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  runManageScript: (command, appName) => ipcRenderer.send("run-manage-script", command, appName),
  onManageScriptOutput: (callback) => ipcRenderer.on("manage-script-output", (_, data) => callback(data)),
  onManageScriptError: (callback) => ipcRenderer.on("manage-script-error", (_, data) => callback(data)),
  onManageScriptDone: (callback) => ipcRenderer.on("manage-script-done", (_, message) => callback(message)),

});
