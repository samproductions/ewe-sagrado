import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: () => void;
}

interface User {
  email: string;
  passwordHash: string;
  name: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Limpa mensagens ao trocar de modo
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isRegistering]);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('ewe_expert_users');
    return users ? JSON.parse(users) : [];
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = { email, passwordHash: password, name };
    localStorage.setItem('ewe_expert_users', JSON.stringify([...users, newUser]));
    
    setSuccess('Cadastro realizado com sucesso! Agora você pode entrar.');
    setIsRegistering(false);
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === password);

    if (user) {
      localStorage.setItem('ewe_active_session', JSON.stringify({ email: user.email, name: user.name }));
      onLogin();
    } else {
      setError('E-mail ou senha incorretos. Por favor, cadastre-se se ainda não tiver uma conta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061a11] px-4 py-12">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#04120b] border border-emerald-900/40 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(5,150,105,0.4)]">
            <span className="text-4xl">🌿</span>
          </div>
          <h2 className="text-4xl font-bold text-white font-serif mb-2">Ewe Expert</h2>
          <p className="text-emerald-500 font-medium text-sm tracking-widest uppercase">
            {isRegistering ? 'Criar Novo Cadastro' : 'Portal de Axé'}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="animate-in slide-in-from-top-2">
              <label className="sr-only">Seu Nome</label>
              <input
                type="text"
                required
                className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-emerald-900/50 bg-[#061a11]/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                placeholder="Seu Nome Completo ou Vulgo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="sr-only">E-mail</label>
            <input
              type="email"
              required
              className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-emerald-900/50 bg-[#061a11]/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="sr-only">Senha</label>
            <input
              type="password"
              required
              className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-emerald-900/50 bg-[#061a11]/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
              placeholder="Sua Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs text-center font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
              <p className="text-emerald-400 text-xs text-center font-bold">{success}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-[#061a11] bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
            >
              {isRegistering ? 'Confirmar Cadastro' : 'Entrar no Portal'}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 flex flex-col gap-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-500 hover:text-emerald-400 text-xs font-bold underline transition-colors"
          >
            {isRegistering ? 'Já tenho conta? Fazer Login' : 'Não tem conta? Cadastre-se aqui'}
          </button>
          
          <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-tighter italic">
            "O saber é como um jardim: se não for cultivado, não pode ser colhido."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;