/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    electronAPI: {
      sendManageScriptInput(arg0: string, input: string): unknown;
      onManageScriptError(arg0: string, arg1: (data: any) => void): unknown;
      cancelManageScript(command: string): void;
      removeManageScriptDoneListener(command: string, callback: (message: string) => void): void;
      removeManageScriptOutputListener(command: string, callback: (data: string) => void): void;
      onManageScriptDone(command: string, callback: (message: string) => void): void;
      onManageScriptOutput(command: string, callback: (data: string) => void): void;
      runManageScript(command: string, appName: string): void;
      removeApiScriptOutputListener(command: string, callback: (data: unknown) => void): void;
      onApiScriptOutput(command: string, callback: (data: unknown) => void): void;
      runApiScript(command: string, args1: string): void;
      readFile(filePath: string): Promise<string>;
      openExternalURL(url: string): void;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      send: (channel: string, data?: any) => void;
      receive: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}
