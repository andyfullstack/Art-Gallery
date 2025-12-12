import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Конфигурация Firebase - всегда используем хардкодные значения
const fallbackConfig = {
  apiKey: 'AIzaSyBslNP5qKeHKEsLqPY3WClqQ3Jd9OENpk4',
  authDomain: 'gallery-94c7a.firebaseapp.com',
  projectId: 'gallery-94c7a',
  storageBucket: 'gallery-94c7a.firebasestorage.app',
  messagingSenderId: '554228724926',
  appId: '1:554228724926:web:24cae1078809a63a31daef',
};

const firebaseConfig = {
  apiKey: (process.env.REACT_APP_FIREBASE_API_KEY && process.env.REACT_APP_FIREBASE_API_KEY.trim()) || fallbackConfig.apiKey,
  authDomain: (process.env.REACT_APP_FIREBASE_AUTH_DOMAIN && process.env.REACT_APP_FIREBASE_AUTH_DOMAIN.trim()) || fallbackConfig.authDomain,
  projectId: (process.env.REACT_APP_FIREBASE_PROJECT_ID && process.env.REACT_APP_FIREBASE_PROJECT_ID.trim()) || fallbackConfig.projectId,
  storageBucket: (process.env.REACT_APP_FIREBASE_STORAGE_BUCKET && process.env.REACT_APP_FIREBASE_STORAGE_BUCKET.trim()) || fallbackConfig.storageBucket,
  messagingSenderId: (process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID && process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID.trim()) || fallbackConfig.messagingSenderId,
  appId: (process.env.REACT_APP_FIREBASE_APP_ID && process.env.REACT_APP_FIREBASE_APP_ID.trim()) || fallbackConfig.appId,
};

// DEBUG: Логирование для проверки
if (typeof window !== 'undefined') {
  console.log('🔐 Firebase Config:', {
    apiKey: firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key' ? '✓ SET' : '✗ NOT SET',
    authDomain: firebaseConfig.authDomain && firebaseConfig.authDomain !== 'demo' ? '✓ SET' : '✗ NOT SET',
    projectId: firebaseConfig.projectId && firebaseConfig.projectId !== 'demo-project' ? '✓ SET' : '✗ NOT SET',
    actualAuthDomain: firebaseConfig.authDomain,
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
