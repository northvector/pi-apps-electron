/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises } from "dns";

export {};

declare global {
  interface Window {
    electronAPI: {
      onManageScriptOutput(arg0: (data: any) => void): unknown;
      onManageScriptError(arg0: (data: any) => void): unknown;
      onManageScriptDone(arg0: (message: any) => void): unknown;
      runManageScript(arg0: string, arg1: string): unknown;
      readFile(filePath: string): promises<string>;
      openExternalURL(arg0: string): unknown;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      send: () => void;
      receive: () => void;
    };
  }
}
