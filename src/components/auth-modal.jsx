import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/language-context';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export function AuthModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!auth) {
      setError('Firebase не налаштовано. Перегляньте QUICKSTART_AUTH.md');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError(t.passwordMismatch || 'Паролі не співпадають');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        if (formData.fullName) {
          await updateProfile(userCredential.user, {
            displayName: formData.fullName,
          });
        }

        setSuccess(t.registerSuccess || 'Реєстрація успішна!');
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        setSuccess(t.loginSuccess || 'Успішний вхід!');
      }
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
      });

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error('Auth error:', err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email вже використовується');
          break;
        case 'auth/weak-password':
          setError('Пароль занадто слабкий (мінімум 6 символів)');
          break;
        case 'auth/invalid-email':
          setError('Невірний формат email');
          break;
        case 'auth/user-not-found':
          setError('Користувача не знайдено');
          break;
        case 'auth/wrong-password':
          setError('Невірний пароль');
          break;
        default:
          setError(err.message || 'Помилка авторизації');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!auth || !googleProvider) {
      setError(
        'Firebase не налаштовано. Створіть файл .env.local (див. QUICKSTART_AUTH.md)'
      );
      setLoading(false);
      return;
    }

    try {
      // Popup-only auth (works on localhost and GitHub Pages)
      console.log('🔐 Starting Google Popup Auth...');
      console.log('Auth instance:', auth);
      console.log('Auth app name:', auth.app.name);
      console.log('Auth config:', auth.app.options);

      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google auth success:', result.user);
      setSuccess(
        `${t.loginSuccess || 'Успішний вхід!'} ${t.welcome || 'Вітаємо'}, ${
          result.user.displayName || result.user.email
        }!`
      );

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error('Google auth error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Вікно авторизації було закрито');
      } else if (err.code === 'auth/configuration-not-found') {
        setError(
          'Firebase не налаштовано. Перегляньте FIREBASE_SETUP.md для інструкцій'
        );
      } else if (
        err.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        setError(
          'Редирект авторизація не підтримується. Спробуйте Email/Password'
        );
      } else {
        setError(err.message || 'Помилка авторизації через Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-background w-full max-w-md rounded-lg shadow-2xl my-auto max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="mb-6 text-center text-primary dark:text-[#d4c799]">
            {mode === 'login' ? t.login || 'Вхід' : t.register || 'Реєстрація'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full mb-6 px-6 py-3 bg-white dark:bg-gray-800 border border-border hover:bg-muted transition-colors rounded-lg flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{t.googleAuth || 'Увійти через Google'}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                {t.or || 'або'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block mb-2 dark:text-primary">
                  {t.fullName || 'ПІБ'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 dark:text-primary">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-2 dark:text-primary">
                {t.password || 'Пароль'}
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block mb-2 dark:text-primary">
                  {t.confirmPassword || 'Підтвердіть пароль'}
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-primary text-primary-foreground hover:bg-accent dark:bg-accent dark:text-accent-foreground dark:hover:bg-primary transition-colors duration-300 shadow-md hover:shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {mode === 'login'
                ? t.login || 'Увійти'
                : t.register || 'Зареєструватися'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-accent dark:text-primary hover:underline"
            >
              {mode === 'login'
                ? t.noAccount || 'Немає акаунту? Зареєструватися'
                : t.haveAccount || 'Вже є акаунт? Увійти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
