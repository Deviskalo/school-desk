import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { Client, Users, ID, Databases, Query } from "node-appwrite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const adminClient = new Client()
  .setEndpoint(
    process.env.VITE_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1",
  )
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.VITE_APPWRITE_API_KEY || "");

const users = new Users(adminClient);
const databases = new Databases(adminClient);
const APPWRITE_DATABASE_ID =
  process.env.VITE_APPWRITE_DATABASE_ID || "schooldesk";

// SMTP Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC Handlers
ipcMain.handle("get-version", () => app.getVersion());

ipcMain.handle("list-users", async () => {
  if (!process.env.VITE_APPWRITE_API_KEY) throw new Error("API Key missing.");
  try {
    const response = await users.list();
    return response.users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
});

ipcMain.handle("send-invitation", async (_, { email, name, role }) => {
  const token = Math.random().toString(36).substring(2, 15);
  const activationLink = `http://localhost:5173/activate?token=${token}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: `"SchoolDesk" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Welcome to SchoolDesk - Invitation for ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">SchoolDesk</h1>
        </div>
        <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #475569; line-height: 1.6;">You have been invited to join the SchoolDesk management system as a <strong>${role}</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">Your Activation Code:</p>
          <div style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 2px;">${token}</div>
        </div>

        <p style="color: #475569; line-height: 1.6;">Please click the button below to activate your account. <strong>Note:</strong> You may need to copy the link and open it inside the SchoolDesk application if the button doesn't respond.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Activate My Account</a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">Or go to <strong>Settings > Activate Account</strong> in the app and enter your code.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This invitation was sent by your school administrator.<br>© 2026 SchoolDesk - Modern School Management System</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("SMTP Error:", error);
    throw error;
  }
});

ipcMain.handle("verify-activation", async (_, { email, token }) => {
  console.log(`[Verify] Starting verification for ${email} (token: ${token})`);
  try {
    const collections = ["students", "teachers"];
    for (const col of collections) {
      console.log(`[Verify] Checking collection: ${col}`);
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        col,
        [Query.equal("email", email), Query.equal("status", "invited")],
      );

      console.log(`[Verify] Found ${response.total} documents in ${col}`);
      if (response.total > 0) {
        const doc = response.documents[0];
        return {
          success: true,
          role: col === "students" ? "student" : "teacher",
          data: {
            id: doc.$id,
            name: doc.name,
            email: doc.email,
            status: doc.status,
          },
        };
      }
    }
    console.log(`[Verify] No matching invitation found for ${email}`);
    return {
      success: false,
      message: "Invitation not found or already activated.",
    };
  } catch (error) {
    console.error("Verification Error:", error);
    throw error;
  }
});

ipcMain.handle("activate-user", async (_, data) => {
  return await handleActivateUser(data);
});

ipcMain.handle("create-user", async (_, data) => {
  return await handleActivateUser(data);
});

async function handleActivateUser({ email, password, name, role, id }: any) {
  try {
    const user = await users.create(
      ID.unique(),
      email,
      undefined,
      password,
      name,
    );
    await users.updatePrefs(user.$id, { role });

    const collection = role === "student" ? "students" : "teachers";
    await databases.updateDocument(APPWRITE_DATABASE_ID, collection, id, {
      status: "active",
      appwriteId: user.$id,
      updatedAt: Date.now(),
    });

    return { success: true, userId: user.$id };
  } catch (error: any) {
    console.error("Activation Error:", error);
    throw error;
  }
}

ipcMain.handle("check-setup-needed", async () => {
  if (!process.env.VITE_APPWRITE_API_KEY) return true;
  try {
    const response = await users.list();
    return response.total === 0;
  } catch {
    return true;
  }
});

ipcMain.on("trigger-sync", () => {
  console.log("Background sync triggered");
});
