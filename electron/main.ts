import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import isDev from "electron-is-dev";

import { Client, Users, ID } from "node-appwrite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const adminClient = new Client()
  .setEndpoint(
    process.env.VITE_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1",
  )
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.VITE_APPWRITE_API_KEY || "");

const users = new Users(adminClient);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "SchoolDesk",
    icon: path.join(
      __dirname,
      isDev ? "../renderer/public/favicon.png" : "../renderer/dist/favicon.png",
    ),
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers for secure operations
ipcMain.handle("get-version", () => app.getVersion());

// User Management (Admin Only)
ipcMain.handle("create-user", async (_, userData: any) => {
  if (!process.env.VITE_APPWRITE_API_KEY) {
    throw new Error(
      "Appwrite API Key is missing. Please check your .env file.",
    );
  }
  try {
    const { name, email, password, role } = userData;
    const user = await users.create(
      ID.unique(),
      email,
      undefined,
      password,
      name,
    );
    // Set role in user preferences
    await users.updatePrefs(user.$id, { role });
    return user;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error;
  }
});

ipcMain.handle("list-users", async () => {
  if (!process.env.VITE_APPWRITE_API_KEY) {
    throw new Error("Appwrite API Key is missing.");
  }
  try {
    const response = await users.list();
    return response.users;
  } catch (error: any) {
    console.error("Error listing users:", error);
    throw error;
  }
});

ipcMain.handle("check-setup-needed", async () => {
  if (!process.env.VITE_APPWRITE_API_KEY) {
    // No API key means we can't determine setup status — show setup screen
    return true;
  }
  try {
    const response = await users.list();
    return response.total === 0;
  } catch {
    return true; // On error, assume setup may be needed
  }
});

// Placeholder for background sync
ipcMain.on("trigger-sync", () => {
  console.log("Background sync triggered");
});
