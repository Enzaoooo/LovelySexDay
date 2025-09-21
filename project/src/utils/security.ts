import CryptoJS from 'crypto-js';

// Configurações de segurança
const SECRET_KEY = 'LSD_SECRET_2025_ULTRA_SECURE_KEY_' + Date.now();
const ENCRYPTION_KEY = 'LSD_ENCRYPT_KEY_2025_ADVANCED_SECURITY';

// 1. Hash de senhas simples (para demo - em produção usar backend)
export const hashPassword = (password: string): string => {
  try {
    return CryptoJS.SHA256(password + SECRET_KEY).toString();
  } catch (error) {
    throw new Error('Erro ao criptografar senha');
  }
};

export const verifyPassword = (password: string, hash: string): boolean => {
  try {
    const hashedInput = hashPassword(password);
    return secureCompare(hashedInput, hash);
  } catch (error) {
    return false;
  }
};

// 2. Criptografia AES para dados sensíveis
export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    throw new Error('Erro ao criptografar dados');
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Erro ao descriptografar dados');
  }
};

// 3. Token simples para autenticação (para demo)
export const generateToken = (payload: object): string => {
  try {
    const data = JSON.stringify({
      ...payload,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    });
    return encryptData(data);
  } catch (error) {
    throw new Error('Erro ao gerar token');
  }
};

export const verifyToken = (token: string): any => {
  try {
    const decryptedData = decryptData(token);
    const payload = JSON.parse(decryptedData);
    
    if (Date.now() > payload.expires) {
      throw new Error('Token expirado');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// 4. Sanitização de dados
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// 5. Validação de entrada
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// 6. Geração de IDs seguros
export const generateSecureId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const hash = CryptoJS.SHA256(timestamp + random).toString();
  return hash.substring(0, 16);
};

// 7. Rate limiting (controle de tentativas)
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 tentativas em 15 minutos
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    record.lastAttempt = now;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter();

// 8. Validação de força de senha
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Senha deve ter pelo menos 8 caracteres');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Inclua pelo menos uma letra minúscula');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Inclua pelo menos uma letra maiúscula');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Inclua pelo menos um número');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Inclua pelo menos um caractere especial');

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// 9. Criptografia de sessão
export const encryptSession = (sessionData: object): string => {
  const jsonString = JSON.stringify(sessionData);
  return encryptData(jsonString);
};

export const decryptSession = (encryptedSession: string): object => {
  const decryptedString = decryptData(encryptedSession);
  return JSON.parse(decryptedString);
};

// 10. Proteção contra ataques de timing
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};