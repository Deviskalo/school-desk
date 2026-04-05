import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => ipcRenderer.invoke("get-version"),
  triggerSync: () => ipcRenderer.send("trigger-sync"),
  createUser: (userData: any) => ipcRenderer.invoke("create-user", userData),
  listUsers: () => ipcRenderer.invoke("list-users"),
  checkSetupNeeded: () => ipcRenderer.invoke("check-setup-needed"),
  // SMTP & Activation
  sendInvitation: (data: { email: string; name: string; role: string }) =>
    ipcRenderer.invoke("send-invitation", data),
  verifyActivation: (data: { email: string; token: string }) =>
    ipcRenderer.invoke("verify-activation", data),
  activateUser: (data: any) => ipcRenderer.invoke("activate-user", data),
});
