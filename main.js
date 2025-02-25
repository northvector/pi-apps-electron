/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, protocol, ipcMain, shell, screen } = require("electron");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const { spawn } = require("child_process");


function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".txt": "text/plain",
        ".json": "application/json",
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
    };
    return mimeTypes[ext] || "application/octet-stream";
}

function createWindow() {

    protocol.handle("local", async (request) => {
        const url = new URL(request.url);
        let relativePath = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
        let filePath = path.join(os.homedir(), "pi-apps", relativePath);

        console.log(`Request URL: ${request.url}`);
        console.log(`Resolved Path: ${filePath}`);

        if (!filePath.startsWith(path.join(os.homedir(), "pi-apps"))) {
            console.log("Blocked: Path Traversal Attempt");
            return new Response("Access Denied", { status: 403 });
        }

        if (!fs.existsSync(filePath)) {
            console.log("Error: File Not Found");
            return new Response("File not found", { status: 404 });
        }

        try {
            const mimeType = getMimeType(filePath);
            if (!mimeType || mimeType.startsWith("text/") || path.extname(filePath) === "") {
                console.log("Serving as Text");
                const textContent = fs.readFileSync(filePath, "utf8");
                return new Response(textContent, { headers: { "Content-Type": mimeType || "text/plain" } });
            }

            console.log("Serving as Binary");
            const fileStream = fs.createReadStream(filePath);
            return new Response(fileStream, { headers: { "Content-Type": mimeType } });
        } catch (err) {
            console.error("Error reading file:", err);
            return new Response("Internal Server Error", { status: 500 });
        }
    });


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
    win.loadURL("http://localhost:3000");
}


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

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        let paths = path.join(os.homedir(), "pi-apps", decodeURIComponent(filePath));
        const data = fs.readFileSync(paths, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
});

ipcMain.on("run-manage-script", (event, command, appName) => {
    const scriptPath = path.join(os.homedir(), "pi-apps", "manage");
    const args = [command, appName];
    const process = spawn(scriptPath, args);

    process.stdout.on("data", (data) => {
        event.sender.send("manage-script-output", data.toString());
    });

    process.stderr.on("data", (data) => {
        event.sender.send("manage-script-error", data.toString());
    });

    process.on("close", (code) => {
        event.sender.send("manage-script-done", `Process exited with code ${code}`);
    });
});