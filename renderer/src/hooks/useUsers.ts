import { useState, useCallback } from "react";

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
      await fetchUsers(); // Refresh list
      return newUser;
    } catch (err: any) {
      setError(err.message || "Failed to create user");
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
  };
};
