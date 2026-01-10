
export interface User {
  email: string;
  passwordHash: string;
  name: string;
}

export const authService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem('ewe_expert_users');
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = authService.getUsers();
    users.push(user);
    localStorage.setItem('ewe_expert_users', JSON.stringify(users));
  },

  findUser: (email: string) => {
    return authService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createSession: (user: User) => {
    localStorage.setItem('ewe_active_session', JSON.stringify({
      email: user.email,
      name: user.name,
      timestamp: Date.now()
    }));
  },

  getSession: () => {
    const session = localStorage.getItem('ewe_active_session');
    return session ? JSON.parse(session) : null;
  },

  logout: () => {
    localStorage.removeItem('ewe_active_session');
  },

  // Para portabilidade entre dispositivos (Manual Sync)
  exportData: () => {
    const users = localStorage.getItem('ewe_expert_users') || '[]';
    const history = localStorage.getItem('ewe_ai_history') || '[]';
    const blob = new Blob([JSON.stringify({ users: JSON.parse(users), history: JSON.parse(history) })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ewe_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  importData: async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.users) localStorage.setItem('ewe_expert_users', JSON.stringify(data.users));
      if (data.history) localStorage.setItem('ewe_ai_history', JSON.stringify(data.history));
      return true;
    } catch (e) {
      console.error("Erro ao importar", e);
      return false;
    }
  }
};
