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

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    // Check if file exists
    let paths = path.join(os.homedir(), "pi-apps", decodeURIComponent(filePath));
    if (!fs.existsSync(paths)) {
      throw new Error("File does not exist | requested path " + paths);
    }
    const data = fs.readFileSync(paths, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
    return null;
  }
});

// ipcMain.on("run-manage-script", (event, command, appName) => {
//     const scriptPath = path.join(os.homedir(), "pi-apps", "manage");
//     const args = [command, appName];
//     const processInstance = spawn(scriptPath, args);
//     // Listen for data output
//     processInstance.stdout.on("data", (data) => {
//         event.sender.send(`manage-script-output-${command}`, data.toString().trim());
//     });
//     // Listen for errors
//     processInstance.stderr.on("data", (data) => {
//         event.sender.send(`manage-script-error-${command}`, data.toString().trim());
//     });
//     // Listen for process exit
//     processInstance.on("close", (code) => {
//         event.sender.send(`manage-script-done-${command}`, `Process exited with code ${code}`);
//     });
//     // Listen for cancel event
//     event.sender.once("cancel-manage-script", () => {
//         processInstance.kill();
//     });
//     // Listen for user input
//     ipcMain.on(`manage-script-input-${command}`, (event, userInput) => {
//         if (processInstance.stdin) {
//             processInstance.stdin.write(userInput + "\n");
//         }
//     });
// });

ipcMain.on("run-manage-script", (event, command, appName) => {
  const scriptPath = path.join(os.homedir(), "pi-apps", "manage");

  // Spawn process
  const processInstance = spawn(scriptPath, [command, appName], {
    cwd: process.env.HOME,
    env: process.env,
    shell: false, // Avoid nested shells for better signal handling
    stdio: ["pipe", "pipe", "pipe"], // Ensure proper I/O redirection
  });

  event.sender.send(`manage-script-started-${command}`, "Process started");

  processInstance.stdout.on("data", (data) => {
    event.sender.send(`manage-script-output-${command}`, data.toString());
  });

  processInstance.stderr.on("data", (data) => {
    event.sender.send(`manage-script-error-${command}`, data.toString());
  });

  processInstance.on("close", (code) => {
    event.sender.send(`manage-script-done-${command}`, `Process exited with code ${code}`);
  });

  // Handle user input from xterm.js
  ipcMain.on(`manage-script-input-${command}`, (event, userInput) => {
    if (processInstance.stdin) {
      processInstance.stdin.write(userInput + "\n");
    }
  });

  ipcMain.once(`cancel-manage-script-${command}`, () => {
    console.log(`Sending SIGINT to process ${command}...`);
    processInstance.kill("SIGINT"); // Graceful stop

    setTimeout(() => {
      if (!processInstance.killed) {
        console.log(`Process ${command} not responding, force killing...`);
        processInstance.kill("SIGKILL"); // Force kill if SIGINT doesn't work
      }
    }, 2000); // Wait 2s before forcing kill
  });
});

ipcMain.on("run-api-script", (event, command, args1) => {
  const scriptPath = path.join(os.homedir(), "pi-apps", "api");
  const args = [command, args1];
  const processInstance = spawn(scriptPath, args);

  processInstance.stdout.on("data", (data) => {
    event.sender.send(`api-script-output-${command}`, data.toString().trim());
  });

  processInstance.on("close", (code) => {
    event.sender.send(`api-script-done-${command}`, `Process exited with code ${code}`);
  });

  event.sender.once("cancel-api-script", () => {
    processInstance.kill();
  });
});
