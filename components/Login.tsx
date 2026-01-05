
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@ewe.com' && password === 'ogum123') {
      onLogin();
    } else {
      setError('E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061a11] px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#04120b] border border-emerald-900/40 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(5,150,105,0.4)]">
            <span className="text-4xl">🌿</span>
          </div>
          <h2 className="text-4xl font-bold text-white font-serif mb-2">Ewe Expert</h2>
          <p className="text-emerald-500 font-medium text-sm tracking-widest uppercase">Portal de Axé</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">E-mail</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-emerald-900/50 bg-[#061a11]/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm transition-all"
                placeholder="admin@ewe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" title="ogum123" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-emerald-900/50 bg-[#061a11]/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center font-bold animate-pulse">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-[#061a11] bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Entrar no Portal
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-tighter italic">
            "Nada se faz sem o conhecimento das folhas"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
