import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import LanguageSelector from '@/components/LanguageSelector';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, name);
        toast.success(t('auth.registerSuccess'));
        setIsRegister(false);
        setPassword('');
      } else {
        await login(email, password);
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1766802981880-64b6bf946163?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjZXJhbWljJTIwdmFzZSUyMGhvbWUlMjBkZWNvciUyMG1pbmltYWxpc3R8ZW58MHx8fHwxNzcwMzc1OTM3fDA&ixlib=rb-4.1.0&q=85"
          alt="Home Decor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFDFD]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{t('app.title')}</h1>
            <p className="text-stone-600">{t('app.subtitle')}</p>
            <div className="mt-4 flex justify-center">
              <LanguageSelector />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            {isRegister && (
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  data-testid="name-input"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                data-testid="email-input"
              />
            </div>

            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-primary hover:bg-black"
              disabled={loading}
              data-testid="submit-button"
            >
              {loading ? t('pos.pleaseWait') : isRegister ? t('auth.register') : t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-stone-600 hover:text-primary transition-colors"
              data-testid="toggle-mode-button"
            >
              {isRegister ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </button>
          </div>

          <div className="mt-8 p-4 bg-stone-100 rounded-lg">
            <p className="text-xs text-stone-600 mb-2">{t('auth.demoCredentials')}:</p>
            <p className="text-xs font-mono text-stone-700">Admin: admin@gallery.com / admin123</p>
            <p className="text-xs font-mono text-stone-700">Staff: staff@gallery.com / staff123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
