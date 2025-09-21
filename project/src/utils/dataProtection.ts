import { encryptData, decryptData } from './security';

// Proteção de dados sensíveis no localStorage
class DataProtection {
  private readonly PROTECTED_KEYS = ['cart', 'config', 'user_preferences'];

  // Salvar dados criptografados
  setProtectedItem(key: string, data: any): void {
    try {
      const jsonString = JSON.stringify(data);
      const encryptedData = encryptData(jsonString);
      localStorage.setItem(`protected_${key}`, encryptedData);
    } catch (error) {
      console.error(`Erro ao salvar dados protegidos para ${key}:`, error);
    }
  }

  // Recuperar dados descriptografados
  getProtectedItem<T>(key: string): T | null {
    try {
      const encryptedData = localStorage.getItem(`protected_${key}`);
      if (!encryptedData) return null;

      const decryptedString = decryptData(encryptedData);
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error(`Erro ao recuperar dados protegidos para ${key}:`, error);
      return null;
    }
  }

  // Remover dados protegidos
  removeProtectedItem(key: string): void {
    localStorage.removeItem(`protected_${key}`);
  }

  // Limpar todos os dados protegidos
  clearAllProtectedData(): void {
    this.PROTECTED_KEYS.forEach(key => {
      this.removeProtectedItem(key);
    });
  }

  // Verificar integridade dos dados
  verifyDataIntegrity(key: string): boolean {
    try {
      const data = this.getProtectedItem(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }
}

export const dataProtection = new DataProtection();