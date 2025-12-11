import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

/**
 * Получить фото профиля пользователя из localStorage
 */
export function getUserAvatar(uid) {
  if (!uid) return null;
  return localStorage.getItem(`userAvatar_${uid}`);
}

/**
 * Получить имя пользователя из localStorage
 */
export function getUserDisplayName(uid) {
  if (!uid) return null;
  return localStorage.getItem(`userDisplayName_${uid}`);
}

/**
 * Получить дату рождения из localStorage
 */
export function getUserBirthDate(uid) {
  if (!uid) return null;
  return localStorage.getItem(`userBirthDate_${uid}`);
}

/**
 * Получить пол из localStorage
 */
export function getUserGender(uid) {
  if (!uid) return null;
  return localStorage.getItem(`userGender_${uid}`);
}

/**
 * Получить все данные профиля пользователя
 */
export function getUserProfile(uid) {
  if (!uid) return null;
  return {
    displayName: localStorage.getItem(`userDisplayName_${uid}`),
    avatar: localStorage.getItem(`userAvatar_${uid}`),
    birthDate: localStorage.getItem(`userBirthDate_${uid}`),
    gender: localStorage.getItem(`userGender_${uid}`),
  };
}

/**
 * Хук для отслеживания состояния авторизации
 * Возвращает текущего пользователя, его данные профиля из localStorage и статус загрузки
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Если Firebase не настроен, возвращаем null пользователя
    if (!auth) {
      setLoading(false);
      return;
    }

    // Подписка на изменения состояния авторизации
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);

      // Загружаем все данные профиля из localStorage если пользователь логин
      if (currentUser) {
        const profile = getUserProfile(currentUser.uid);
        setUserProfile(profile);
        console.log('Користувач увійшов:', currentUser.email);
      } else {
        setUserProfile(null);
        console.log('Користувач вийшов');
      }

      setLoading(false);
    });

    // Отписка при размонтировании
    return () => unsubscribe();
  }, []);

  return { user, loading, userProfile };
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

/**
 * Функция обновления профиля пользователя (только localStorage)
 */
export async function updateUserProfile(formData) {
  if (!auth?.currentUser) {
    return { success: false, error: 'Пользователь не авторизован' };
  }

  try {
    const currentUser = auth.currentUser;

    // Сохраняем имя в localStorage (если есть)
    if (formData.displayName && formData.displayName.trim()) {
      localStorage.setItem(
        `userDisplayName_${currentUser.uid}`,
        formData.displayName.trim()
      );
    }

    // Сохраняем фото если загружено файлом или это Data URL
    if (formData.photoFile) {
      // Здесь можно добавить загрузку на Firebase Storage
      // Пока используем Data URL и сохраняем в localStorage
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(formData.photoFile);
      });

      // Сохраняем Data URL в localStorage
      localStorage.setItem(`userAvatar_${currentUser.uid}`, dataUrl);
      console.log('✅ Фото файл сохранено в localStorage');
    } else if (
      formData.photoPreview &&
      formData.photoPreview.startsWith('data:')
    ) {
      // Если это эмодзи или обрезанное фото - сохраняем в localStorage
      localStorage.setItem(
        `userAvatar_${currentUser.uid}`,
        formData.photoPreview
      );
      console.log('✅ Эмодзи/фото сохранено в localStorage');
      console.log(
        '📸 Сохраненное значение:',
        formData.photoPreview.substring(0, 100)
      );
    } else {
      console.warn('⚠️ Фото не найдено для сохранения');
    }

    // Сохраняем дату рождения в localStorage (если есть)
    if (formData.birthDate && formData.birthDate.trim()) {
      localStorage.setItem(
        `userBirthDate_${currentUser.uid}`,
        formData.birthDate
      );
    }

    // Сохраняем пол в localStorage (если есть)
    if (formData.gender && formData.gender.trim()) {
      localStorage.setItem(`userGender_${currentUser.uid}`, formData.gender);
    }

    console.log('Профиль обновлен для пользователя:', currentUser.uid);
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
}
