import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { dbFunctions } from '../../lib/database';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      const admin = await dbFunctions.authenticateAdmin(username, password);
      if (admin) {
        onLogin(username, password);
      } else {
        setError('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro ao fazer login. Verifique se o banco de dados está configurado corretamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-700 to-red-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2 font-serif">
              Lovely Sex Day
            </h2>
            <p className="text-white/80 text-lg">Painel Administrativo</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Acesso Restrito</h3>
            <p className="text-gray-600 mt-2">Faça login para acessar o painel</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nome de usuário"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Entrar no Painel
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Credenciais padrão:</p>
            <p><strong>Usuário:</strong> admin</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};