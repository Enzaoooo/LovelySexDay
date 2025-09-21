import { encryptSession, decryptSession } from './security';

interface SessionData {
  isAuthenticated: boolean;
  userId?: string;
  loginTime: number;
  lastActivity: number;
}

class SessionManager {
  private readonly SESSION_KEY = 'lsd_session';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas

  saveSession(data: Omit<SessionData, 'loginTime' | 'lastActivity'>): void {
    const sessionData: SessionData = {
      ...data,
      loginTime: Date.now(),
      lastActivity: Date.now()
    };

    try {
      const encryptedSession = encryptSession(sessionData);
      localStorage.setItem(this.SESSION_KEY, encryptedSession);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }

  getSession(): SessionData | null {
    try {
      const encryptedSession = localStorage.getItem(this.SESSION_KEY);
      if (!encryptedSession) return null;

      const sessionData = decryptSession(encryptedSession) as SessionData;
      
      // Verificar se a sessão expirou
      if (Date.now() - sessionData.lastActivity > this.SESSION_TIMEOUT) {
        this.clearSession();
        return null;
      }

      // Atualizar última atividade
      sessionData.lastActivity = Date.now();
      this.saveSession(sessionData);

      return sessionData;
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error);
      this.clearSession();
      return null;
    }
  }

  updateActivity(): void {
    const session = this.getSession();
    if (session) {
      this.saveSession(session);
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isSessionValid(): boolean {
    const session = this.getSession();
    return session?.isAuthenticated === true;
  }
}

export const sessionManager = new SessionManager();