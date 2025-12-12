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

// Important: avoid mixing partial env config with fallback.
// If env config is incomplete (e.g. apiKey set but authDomain missing), using a hybrid config
// can lead to confusing auth issues. In that case we use fallback config entirely.
const hasCompleteEnvConfig = Boolean(
  envFirebaseConfig.apiKey &&
    envFirebaseConfig.authDomain &&
    envFirebaseConfig.projectId &&
    envFirebaseConfig.appId
);

const firebaseConfig = hasCompleteEnvConfig
  ? {
      ...fallbackFirebaseConfig,
      ...Object.fromEntries(Object.entries(envFirebaseConfig).filter(([, value]) => value)),
    }
  : fallbackFirebaseConfig;

// Use a named Firebase app to avoid accidentally reusing a pre-existing [DEFAULT]
// app that might have been initialized elsewhere with a wrong config.
const FIREBASE_APP_NAME = 'art-gallery';

// DEBUG: Log env availability (not secrets).
if (typeof window !== 'undefined') {
  console.log('🔐 Firebase Env:', {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ SET' : '✗ NOT SET (using fallback)',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      ? '✓ SET'
      : '✗ NOT SET (using fallback)',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ SET' : '✗ NOT SET (using fallback)',
  });

  console.log('🔐 Firebase Config source:', hasCompleteEnvConfig ? 'env' : 'fallback');
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

console.log('Firebase Config (effective):', {
  apiKey: firebaseConfig.apiKey ? '✓ SET' : '✗ NOT SET',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId ? '✓ SET' : '✗ NOT SET',
});

let app;
let auth;
let googleProvider;

try {
  const hasNamedApp = getApps().some(existingApp => existingApp.name === FIREBASE_APP_NAME);
  app = hasNamedApp
    ? getApp(FIREBASE_APP_NAME)
    : initializeApp(firebaseConfig, FIREBASE_APP_NAME);
  auth = getAuth(app);

  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  console.log('Firebase initialized:', {
    appName: app.name,
    authDomain: auth.app.options.authDomain,
  });
} catch (error) {
  console.error('Firebase init error:', error);
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider, isConfigured };

