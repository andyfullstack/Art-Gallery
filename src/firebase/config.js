import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Конфигурация Firebase из переменных окружения
// Создайте файл .env.local и заполните значения (см. .env.example)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-api-key',
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// DEBUG: Логирование для проверки
if (typeof window !== 'undefined') {
  console.log('🔐 Firebase Config:', {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ SET' : '✗ NOT SET',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✓ SET' : '✗ NOT SET',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ SET' : '✗ NOT SET',
  });
}

// Проверка конфигурации
const isConfigured =
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_API_KEY !== 'demo-api-key';

if (!isConfigured) {
  console.warn(
    '⚠️ Firebase не настроен!\n' +
      'Создайте файл .env.local с вашими Firebase ключами.\n' +
      'Инструкция: QUICKSTART_AUTH.md'
  );
}

// Инициализация Firebase
let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Опционально: настройка провайдера
  googleProvider.setCustomParameters({
    prompt: 'select_account', // Всегда показывать выбор аккаунта
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Создаем пустые mock объекты для предотвращения ошибок
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider, isConfigured };
