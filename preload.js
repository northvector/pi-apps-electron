/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  openExternalURL: (url) => ipcRenderer.send("open-external-url", url),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  runManageScript: (command, appName) => ipcRenderer.send("run-manage-script", command, appName),
  cancelManageScript: (command) => ipcRenderer.send(`cancel-manage-script-${command}`),
  sendManageScriptInput: (command, userInput) => ipcRenderer.send(`manage-script-input-${command}`, userInput),
  onManageScriptOutput: (command, callback) => {
    const eventName = `manage-script-output-${command}`;
    ipcRenderer.on(eventName, (_, data) => callback(data));
  },
  onManageScriptError: (command, callback) => {
    ipcRenderer.on(`manage-script-error-${command}`, (_, data) => callback(data));
  },
  onManageScriptDone: (command, callback) => {
    const eventName = `manage-script-done-${command}`;
    ipcRenderer.on(eventName, (_, data) => callback(data));
  },
  removeManageScriptOutputListener: (command, callback) => {
    const eventName = `manage-script-output-${command}`;
    ipcRenderer.removeListener(eventName, callback);
  },

  removeManageScriptDoneListener: (command, callback) => {
    const eventName = `manage-script-done-${command}`;
    ipcRenderer.removeListener(eventName, callback);
  },
  runApiScript: (command, args1) => ipcRenderer.send("run-api-script", command, args1),
  onApiScriptOutput: (command, callback) => {
    const eventName = `api-script-output-${command}`;
    ipcRenderer.on(eventName, (_, data) => callback(data));
  },
  removeApiScriptOutputListener: (command, callback) => {
    const eventName = `api-script-output-${command}`;
    ipcRenderer.removeListener(eventName, callback);
  },
});
