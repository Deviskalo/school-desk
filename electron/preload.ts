import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => ipcRenderer.invoke("get-version"),
  triggerSync: () => ipcRenderer.send("trigger-sync"),
  createUser: (userData: any) => ipcRenderer.invoke("create-user", userData),
  listUsers: () => ipcRenderer.invoke("list-users"),
  checkSetupNeeded: () => ipcRenderer.invoke("check-setup-needed"),
  updateUserStatus: (data: { userId: string; status: boolean }) =>
    ipcRenderer.invoke("update-user-status", data),
  deleteUser: (userId: string) => ipcRenderer.invoke("delete-user", userId),
  // SMTP & Activation
  sendInvitation: (data: { email: string; name: string; role: string }) =>
    ipcRenderer.invoke("send-invitation", data),
  verifyActivation: (data: { email: string; token: string }) =>
    ipcRenderer.invoke("verify-activation", data),
  activateUser: (data: any) => ipcRenderer.invoke("activate-user", data),
});
