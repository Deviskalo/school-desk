import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => ipcRenderer.invoke("get-version"),
  triggerSync: () => ipcRenderer.send("trigger-sync"),
  createUser: (userData: any) => ipcRenderer.invoke("create-user", userData),
  listUsers: () => ipcRenderer.invoke("list-users"),
  checkSetupNeeded: () => ipcRenderer.invoke("check-setup-needed"),
});
