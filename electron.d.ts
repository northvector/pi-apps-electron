export {};

declare global {
  interface Window {
    electronAPI: {
      openExternalURL(arg0: string): unknown;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      send: () => void;
      receive: () => void;
    };
  }
}
