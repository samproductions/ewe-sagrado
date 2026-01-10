
import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isRegistering]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Por favor, preencha todos os fundamentos do cadastro.');
      return;
    }

    if (authService.findUser(email)) {
      setError('Este e-mail já possui axé em nosso sistema. Faça login.');
      return;
    }

    const newUser: User = { email, passwordHash: password, name };
    authService.saveUser(newUser);
    
    setSuccess('Cadastro firmado com sucesso! Agora, entre no portal.');
    setIsRegistering(false);
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authService.findUser(email);

    if (user && user.passwordHash === password) {
      authService.createSession(user);
      onLogin();
    } else {
      setError('Credenciais não encontradas. Verifique se o e-mail está correto ou crie uma nova conta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061a11] px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 p-10 bg-[#04120b]/90 border border-emerald-900/40 rounded-[3rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 relative z-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <span className="text-5xl drop-shadow-lg">🌿</span>
          </div>
          <h2 className="text-4xl font-bold text-white font-serif mb-2 tracking-tight">Ewe Expert</h2>
          <p className="text-emerald-500 font-bold text-[10px] tracking-[0.3em] uppercase opacity-80">
            {isRegistering ? 'Iniciação no Sistema' : 'Portal de Identificação Sagrada'}
          </p>
        </div>

        <form className="mt-10 space-y-4" onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="animate-in slide-in-from-top-2">
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border border-emerald-900/50 bg-[#061a11]/60 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                placeholder="Seu Nome de Axé ou Civil"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <input
            type="email"
            required
            className="w-full px-5 py-4 rounded-2xl border border-emerald-900/50 bg-[#061a11]/60 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
            placeholder="E-mail de acesso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            className="w-full px-5 py-4 rounded-2xl border border-emerald-900/50 bg-[#061a11]/60 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
            placeholder="Sua Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl animate-shake">
              <p className="text-red-400 text-xs text-center font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl animate-in fade-in">
              <p className="text-emerald-400 text-xs text-center font-bold">{success}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#061a11] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 active:scale-95 mt-4"
          >
            {isRegistering ? 'Confirmar Cadastro' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="text-center pt-6 space-y-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-500 hover:text-emerald-300 text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            {isRegistering ? 'Já possui cadastro? Clique aqui' : 'Novo por aqui? Crie sua conta'}
          </button>
          
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent"></div>
          
          <p className="text-[10px] text-slate-600 font-medium leading-relaxed max-w-[200px] mx-auto italic">
            "Para acessar em outros aparelhos, use a função de Exportar no menu após entrar."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
