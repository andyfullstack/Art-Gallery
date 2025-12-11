import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

/**
 * Хук для отслеживания состояния авторизации
 * Возвращает текущего пользователя или null
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если Firebase не настроен, возвращаем null пользователя
    if (!auth) {
      setLoading(false);
      return;
    }

    // Подписка на изменения состояния авторизации
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        console.log('Користувач увійшов:', currentUser.email);
      } else {
        console.log('Користувач вийшов');
      }
    });

    // Отписка при размонтировании
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

/**
 * Функция выхода из аккаунта
 */
export async function logout() {
  if (!auth) {
    return { success: false, error: 'Firebase не настроен' };
  }

  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}
