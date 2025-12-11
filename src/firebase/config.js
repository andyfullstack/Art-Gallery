import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Конфигурация Firebase из переменных окружения
// Создайте файл .env.local и заполните значения (см. .env.example)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBslNP5qKeHKEsLqPY3WClqQ3Jd9OENpk4',
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'gallery-94c7a.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'gallery-94c7a',
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'gallery-94c7a.firebasestorage.app',
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '554228724926',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:554228724926:web:24cae1078809a63a31daef',
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
