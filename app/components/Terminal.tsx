"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

// get action (install/uninstall) from parent component
const TerminalComponent = ({ action }: { action: "install" | "uninstall" }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
        fontSize: 14, 
        fontFamily: "monospace",
        theme: {
          background: "#212121",
          foreground: "#fff",
          cursor: "#fff",
        },
        convertEol: true,
        scrollback: 1000,
        cursorStyle: "underline"
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    setTimeout(() => {
        fit.fit();
      }, 50);
    termInstance.current = term;
    fitAddon.current = fit;

    window.electronAPI.onManageScriptOutput(action, (data) => {
      term.write(data);
    });

    window.electronAPI.onManageScriptError(action, (data) => {
      term.write(`\x1b[31m${data}\x1b[0m`);
    });

    window.electronAPI.onManageScriptDone(action, (message) => {
      term.write(`\n\x1b[32m${message}\x1b[0m\n`);
    });

    term.onData((input) => {
      window.electronAPI.sendManageScriptInput(action, input);
    });

    // on ctrl c cancel the script
    term.onKey((e) => {
      if (e.domEvent.ctrlKey && e.domEvent.key === "c") {
        term.write("\n");
        term.write("\x1b[31mCancelled by user\x1b[0m\n");
        window.electronAPI.sendManageScriptInput(action, "\x03");
        window.electronAPI.cancelManageScript(action);
      }
    });

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="rounded-2xl" style={{ width: "100%", height: "300px" }} />;
};

export default TerminalComponent;
