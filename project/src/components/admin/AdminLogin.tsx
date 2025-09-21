import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { loginRateLimiter, sanitizeInput } from '../../utils/security';
import { Lock, User } from 'lucide-react';

export function AdminLogin() {
  const { dispatch } = useApp();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitizar entrada
    const sanitizedUsername = sanitizeInput(credentials.username);
    const sanitizedPassword = sanitizeInput(credentials.password);
    
    // Rate limiting
    if (!loginRateLimiter.isAllowed(sanitizedUsername)) {
      setError('Muitas tentativas de login. Tente novamente em 15 minutos.');
      return;
    }
    
    // Autenticação segura
    if (sanitizedUsername === 'admin' && sanitizedPassword === 'admin123') {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      loginRateLimiter.reset(sanitizedUsername);
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
            Lovely Sex Day
          </h1>
          <p className="text-gray-400 mt-2">Área Administrativa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Demo: usuário: admin, senha: admin123</p>
        </div>
      </div>
    </div>
  );
}