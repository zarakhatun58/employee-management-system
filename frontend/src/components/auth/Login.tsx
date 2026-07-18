import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { Button, Input, Label, Spinner } from '../ui/primitives';
import { Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

interface DemoAccount {
  label: string;
  email: string;
  password: string;
}
const demoAccounts = [
  { label: 'Super Admin', email: 'admin@ems.com', password: 'Admin@123' },
  { label: 'HR Manager', email: 'hr@ems.com', password: 'Hr@12345' },
  { label: 'Employee', email: 'alice@ems.com', password: 'Alice@123' },
];

export default function Login() {
  const { login, loading, error, clearError, token, register, } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;
  const onRegister = async (e: FormEvent) => { e.preventDefault(); if (registerPassword !== confirmPassword) { return; } const ok = await register(name, registerEmail, registerPassword); if (ok) { navigate('/dashboard'); } };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  const fill = (a: DemoAccount) => {
    setEmail(a.email);
    setPassword(a.password);
    clearError();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 shadow-lg shadow-sky-600/30">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employee Management System</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to access your dashboard</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          {isRegister ? (
            <form
              onSubmit={onRegister}
              className="space-y-4"
            >
              <div>
                <Label>Name</Label>
                <Input
                  required
                  value={name}
                  onChange={
                    e => setName(e.target.value)
                  }
                  placeholder="Full name"
                />
              </div> <div>
                <Label>Email</Label><Input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={
                    e => setRegisterEmail(e.target.value)
                  }
                  placeholder="email@example.com"
                />
              </div><div>
                <Label>Password</Label>

                <Input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={
                    e => setRegisterPassword(e.target.value)
                  }
                  placeholder="Password"
                />
              </div> <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={
                    e => setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm password"
                />
              </div> <Button
                className="w-full"
                disabled={loading}
              >
                {
                  loading
                    ?
                    <Spinner className="h-4 w-4" />
                    :
                    'Create Account'
                }

              </Button><button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  clearError();
                }}
                className="w-full text-sm text-sky-600"
              >
                Already have account? Login
              </button>
            </form>

          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" />
                  <button type="button" aria-label="Show password" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Spinner className="h-4 w-4" /> : 'Sign In'}
              </Button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="w-full text-sm text-sky-600 hover:underline"
              >
                Don't have an account? Register
              </button>


            </form>
          )}
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-400">Demo Accounts</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {demoAccounts.map((a) => (
                <button key={a.label} onClick={() => fill(a)} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-sky-500/10">
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
