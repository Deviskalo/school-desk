import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      createUser: (userData: any) => Promise<any>;
      listUsers: () => Promise<any[]>;
      checkSetupNeeded: () => Promise<boolean>;
      updateUserStatus: (data: {
        userId: string;
        status: boolean;
      }) => Promise<any>;
      deleteUser: (userId: string) => Promise<any>;
      sendInvitation: (data: {
        email: string;
        name: string;
        role: string;
      }) => Promise<any>;
      verifyActivation: (data: {
        email: string;
        token: string;
      }) => Promise<any>;
      activateUser: (data: any) => Promise<any>;
    };
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Optional: Handle window.electronAPI exposed by preload script
console.log("Renderer process started");
if (window.electronAPI) {
  window.electronAPI
    .getVersion()
    .then((v: string) => console.log("Electron Version:", v));
}
