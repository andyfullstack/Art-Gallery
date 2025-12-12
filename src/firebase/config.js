import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBslNP5qKeHKEsLqPY3WClqQ3Jd9OENpk4',
  authDomain: 'gallery-94c7a.firebaseapp.com',
  projectId: 'gallery-94c7a',
  storageBucket: 'gallery-94c7a.firebasestorage.app',
  messagingSenderId: '554228724926',
  appId: '1:554228724926:web:24cae1078809a63a31daef',
};

console.log('🔐 Firebase Config:', firebaseConfig);

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.error('Firebase init error:', error);
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
