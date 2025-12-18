
import { User, License } from '../types';

const USERS_KEY = 'cv_master_users';
const LICENSES_KEY = 'cv_master_licenses';
const CURRENT_USER_KEY = 'cv_master_current_user';

// Lista de administradores para garantir acesso
const ADMINS_CONFIG = [
  { email: 'admin@cvmaster.com', name: 'Administrador', defaultPwd: 'admin123' },
  { email: 'lucasvignoli79@gmail.com', name: 'Lucas Vignoli', defaultPwd: 'Lc170705@' },
  { email: 'caiovenceoi@gmail.com', name: 'Caio', defaultPwd: 'admin123' }
];

const ADMIN_EMAILS = ADMINS_CONFIG.map(a => a.email);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  // Initialize Default Data (Run on App Start)
  init: () => {
    const existingUsersStr = localStorage.getItem(USERS_KEY);
    let users: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    let hasChanges = false;

    // Fix: provide default credits to any user that doesn't have it (backwards compatibility)
    users = users.map(u => {
      if (u.credits === undefined) {
        hasChanges = true;
        return { ...u, credits: u.role === 'admin' ? 999 : 5 };
      }
      return u;
    });

    ADMINS_CONFIG.forEach(admin => {
        const normalizedEmail = admin.email.toLowerCase().trim();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);
        
        if (userIndex === -1) {
            users.push({
                id: `admin-${normalizedEmail.split('@')[0]}`,
                name: admin.name,
                email: normalizedEmail,
                role: 'admin',
                createdAt: new Date().toISOString(),
                licenseCode: 'ADMIN-ACCESS',
                // Added initial credits for new admins
                credits: 999
            });
            hasChanges = true;
        } else {
            const u = users[userIndex];
            if (u.role !== 'admin' || u.credits === undefined) {
                u.role = 'admin';
                // Ensure admins always have high credit balance
                u.credits = 999;
                users[userIndex] = u;
                hasChanges = true;
            }
        }

        const pwdKey = `cv_master_pwd_${normalizedEmail}`;
        if (!localStorage.getItem(pwdKey)) {
            localStorage.setItem(pwdKey, admin.defaultPwd);
        }
    });

    if (hasChanges) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    if (!localStorage.getItem(LICENSES_KEY)) {
      localStorage.setItem(LICENSES_KEY, JSON.stringify([]));
    }
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as User;
    // Fix: provide default credits if missing from session (backwards compatibility)
    if (user.credits === undefined) {
      user.credits = user.role === 'admin' ? 999 : 5;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const normalizedEmail = email.toLowerCase().trim();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === normalizedEmail);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }
    
    const storedPwd = localStorage.getItem(`cv_master_pwd_${normalizedEmail}`);
    if (storedPwd !== password) {
        throw new Error("Senha incorreta.");
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  register: async (name: string, email: string, password: string, licenseCode: string): Promise<User> => {
    await delay(1000);
    const normalizedEmail = email.toLowerCase().trim();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const licenses = JSON.parse(localStorage.getItem(LICENSES_KEY) || '[]');

    if (users.find((u: User) => u.email === normalizedEmail)) {
      throw new Error("Este email já está cadastrado.");
    }

    const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
    
    if (!isAdminEmail) {
        if (!licenseCode || licenseCode.trim() === '') {
            throw new Error("Código de licença é obrigatório.");
        }
        const licenseIndex = licenses.findIndex((l: License) => l.code === licenseCode);
        if (licenseIndex === -1) throw new Error("Código de licença inválido.");
        if (licenses[licenseIndex].status === 'used') throw new Error("Licença já utilizada.");

        licenses[licenseIndex].status = 'used';
        licenses[licenseIndex].usedBy = normalizedEmail;
        licenses[licenseIndex].usedAt = new Date().toISOString();
        localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: normalizedEmail,
      role: isAdminEmail ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      licenseCode: isAdminEmail ? 'ADMIN-ACCESS' : licenseCode,
      // Added initial credits upon registration
      credits: isAdminEmail ? 999 : 5
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(`cv_master_pwd_${normalizedEmail}`, password);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  resetPassword: async (email: string, licenseCode: string, newPassword: string): Promise<void> => {
    await delay(1000);
    const normalizedEmail = email.toLowerCase().trim();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === normalizedEmail);

    if (!user) throw new Error("Email não encontrado.");
    localStorage.setItem(`cv_master_pwd_${normalizedEmail}`, newPassword);
  },

  generateLicense: async (adminEmail: string): Promise<License> => {
    await delay(500);
    const code = 'CV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const newLicense: License = {
      code,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: adminEmail
    };
    const licenses = JSON.parse(localStorage.getItem(LICENSES_KEY) || '[]');
    licenses.unshift(newLicense);
    localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
    return newLicense;
  },

  getLicenses: async (): Promise<License[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(LICENSES_KEY) || '[]');
  },

  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  // Added updateUserCredits to persist credit changes and fix App.tsx errors
  updateUserCredits: async (userId: string, credits: number): Promise<void> => {
    await delay(300);
    const usersStr = localStorage.getItem(USERS_KEY);
    if (!usersStr) return;
    
    const users = JSON.parse(usersStr) as User[];
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].credits = credits;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update session if the current user is the one being updated
      const currentStored = localStorage.getItem(CURRENT_USER_KEY);
      if (currentStored) {
        const currentUser = JSON.parse(currentStored) as User;
        if (currentUser.id === userId) {
          currentUser.credits = credits;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        }
      }
    }
  }
};
