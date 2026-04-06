import { useState, useCallback } from "react";
import { logActivity } from "../utils/auditLogger";

export interface UserAccount {
  $id: string;
  name: string;
  email: string;
  prefs: {
    role?: string;
  };
  registration: string;
  status: boolean;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userList = await window.electronAPI.listUsers();
      setUsers(userList as UserAccount[]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await window.electronAPI.createUser(userData);
      await logActivity({
        type: "security",
        title: `User Created: ${userData.role}`,
        subtitle: `${userData.name} (${userData.email})`,
        targetId: newUser.userId,
      });
      await fetchUsers(); // Refresh list
      return newUser;
    } catch (err: any) {
      setError(err.message || "Failed to create user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await window.electronAPI.updateUserStatus({
        userId,
        status: !currentStatus,
      });
      const user = users.find((u) => u.$id === userId);
      await logActivity({
        type: "security",
        title: currentStatus ? "Account Locked" : "Account Unlocked",
        subtitle: user ? `${user.name} (${user.email})` : userId,
        targetId: userId,
      });
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    const user = users.find((u) => u.$id === userId);
    if (
      !window.confirm(
        `Are you sure you want to delete ${user?.name || "this user"}? This action cannot be undone.`,
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      await window.electronAPI.deleteUser(userId);
      await logActivity({
        type: "security",
        title: "User Deleted",
        subtitle: user ? `${user.name} (${user.email})` : userId,
        targetId: userId,
      });
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    toggleUserStatus,
    deleteUser,
  };
};
