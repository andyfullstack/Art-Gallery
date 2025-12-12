import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Default (safe) fallback config.
// NOTE: CRA env vars (REACT_APP_*) are baked at build time.
const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyBslNP5qKeHKEsLqPY3WClqQ3Jd9OENpk4',
  authDomain: 'gallery-94c7a.firebaseapp.com',
  projectId: 'gallery-94c7a',
  storageBucket: 'gallery-94c7a.firebasestorage.app',
  messagingSenderId: '554228724926',
  appId: '1:554228724926:web:24cae1078809a63a31daef',
};

// Firebase config from environment (optional).
// Create .env.local for local dev and/or set these in GitHub Actions for production builds.
const envFirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Merge: env overrides fallback when provided.
const firebaseConfig = {
  ...fallbackFirebaseConfig,
  ...Object.fromEntries(Object.entries(envFirebaseConfig).filter(([, value]) => value)),
};

// DEBUG: Log env availability (not secrets).
if (typeof window !== 'undefined') {
  console.log('🔐 Firebase Env:', {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ SET' : '✗ NOT SET (using fallback)',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      ? '✓ SET'
      : '✗ NOT SET (using fallback)',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ SET' : '✗ NOT SET (using fallback)',
  });
}

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

if (!isConfigured) {
  console.warn(
    '⚠️ Firebase не настроен!\n' +
      'Проверьте REACT_APP_FIREBASE_* переменные или fallback в src/firebase/config.js\n' +
      'Инструкция: QUICKSTART_AUTH.md'
  );
}

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '✓ SET' : '✗ NOT SET',
});

let app;
let auth;
let googleProvider;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);

  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  console.log('Firebase initialized. Auth domain:', auth.app.options.authDomain);
} catch (error) {
  console.error('Firebase init error:', error);
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider, isConfigured };

