import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { Button, Input, Label, Spinner } from '../ui/primitives';
import { Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';

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
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (token) return <Navigate to="/dashboard" replace />;

  const onRegister = async (e: FormEvent) => {
    e.preventDefault();

    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let valid = true;

    if (!name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!registerEmail.trim()) {
      errors.email = "Email is required";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)
    ) {
      errors.email = "Enter a valid email";
      valid = false;
    }

    if (!registerPassword) {
      errors.password = "Password is required";
      valid = false;
    } else if (registerPassword.length < 6) {
      errors.password =
        "Password must be at least 6 characters";
      valid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword =
        "Confirm password is required";
      valid = false;
    } else if (
      registerPassword !== confirmPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match";
      valid = false;
    }

    setRegisterErrors(errors);

    if (!valid) return;

    const ok = await register(
      name,
      registerEmail,
      registerPassword
    );

    if (ok) {
      toast.success("Registration successful 🎉");
      navigate("/dashboard");
    } else {
      toast.error(error || "Registration failed");
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = {
      email: "",
      password: "",
    };

    let valid = true;

    if (!email.trim()) {
      errors.email = "Email is required";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email";
      valid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      errors.password =
        "Password must be at least 6 characters";
      valid = false;
    }

    setLoginErrors(errors);

    if (!valid) return;

    const ok = await login(email, password);

    if (ok) {
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } else {
      toast.error(error || "Invalid email or password");
    }
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Employee Management System</h1>
          {/* <p className="mt-2 text-slate-500 dark:text-slate-400">
            Securely manage employees, departments and organization hierarchy.
          </p> */}
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to access your dashboard</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {isRegister ? (
            <form
              onSubmit={onRegister}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                id="name"
                type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setRegisterErrors((p) => ({
                      ...p,
                      name: "",
                    }));
                  }}
                  placeholder="Full name"
                />
              </div>
              {registerErrors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {registerErrors.name}
                </p>
              )}
              <div>
                <Label htmlFor="regEmail">Email</Label><Input required
                id="regEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => {
                    setName(e.target.value);
                    setRegisterErrors((p) => ({
                      ...p,
                      name: "",
                    }));
                  }}
                  placeholder="email@example.com"
                />
              </div>
              {registerErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {registerErrors.email}
                </p>
              )}
              <div>
                <Label htmlFor="regPassword">Password</Label>

                <Input
                 id="regPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setRegisterErrors((p) => ({
                      ...p,
                      password: "",
                    }));
                  }}
                  placeholder="Password"
                />
              </div>
              {registerErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {registerErrors.password}
                </p>
              )}
              <div>
                <Label htmlFor="conPassword">Confirm Password</Label>
                <Input
                id="conPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setRegisterErrors((p) => ({
                      ...p,
                      confirmPassword: "",
                    }));
                  }}
                  placeholder="Confirm password"
                />
              </div>
              {registerErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {registerErrors.confirmPassword}
                </p>
              )}
              <Button
              id="cButton"
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
              id="lButton"
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
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="email" id="email" value={email} onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginErrors((p) => ({
                      ...p,
                      email: "",
                    }));
                  }} placeholder="you@company.com" className="pl-10" />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginErrors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={show ? "text" : "password"}
                    id="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginErrors((p) => ({
                        ...p,
                        password: "",
                      }));
                    }}
                  />
                  <button id="button" type="button" aria-label="Show password" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginErrors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                id="sButton"
                disabled={loading}
                className="w-full h-11"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              <button
                type="button"
                id="rButton"
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
                <button  id="dButton" key={a.label} onClick={() => fill(a)} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-sky-500/10">
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
