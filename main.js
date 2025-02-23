/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, protocol, ipcMain, shell, screen } = require("electron");
const path = require("node:path");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        title: "Pi-Apps Store",
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // win.loadFile(path.join(__dirname, "http://localhost:3000"));
    win.loadURL("http://localhost:3000");}

app.whenReady().then(createWindow);

ipcMain.on("minimize-window", (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.minimize();
});

ipcMain.on("maximize-window", (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.isMaximized() ? window.unmaximize() : window.maximize();
});

ipcMain.on("close-window", (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.close();
});
