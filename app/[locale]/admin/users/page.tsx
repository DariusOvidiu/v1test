'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  country: string;
  roles: Role[];
  createdAt: string;
}

export default function AdminUsersPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Verifică dacă utilizatorul are rol de admin
    if (!hasRole('admin')) {
      router.push('/');
      return;
    }

    // Încarcă lista de utilizatori
    fetchUsers();
  }, [hasRole, router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('An error occurred while fetching users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoles = async (userId: string, roleIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, roles: roleIds })
      });

      if (!response.ok) {
        throw new Error('Failed to update user roles');
      }

      // Reîncarcă lista de utilizatori
      fetchUsers();
    } catch (error) {
      setError('An error occurred while updating user roles');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-400 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('users.title')}</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Country</th>
                <th className="p-4">Roles</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-white/10 text-white">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.country}</td>
                  <td className="p-4">
                    {user.roles.map(role => role.name).join(', ')}
                  </td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {/* Implementează editarea rolurilor */}}
                      className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Edit Roles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 