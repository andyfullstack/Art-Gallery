# 🚀 Быстрый старт: Авторизация через Google

## 📦 Что установлено

✅ Firebase SDK (95.9 kB) ✅ Реальная Google OAuth авторизация ✅ Email/пароль
регистрация и вход ✅ Обработка ошибок на русском языке ✅ Индикатор загрузки ✅
Отображение пользователя в header ✅ Безопасное хранение конфигурации

---

## ⚡ Настройка за 5 минут

### 1️⃣ Создайте проект Firebase

🔗 [console.firebase.google.com](https://console.firebase.google.com/)

1. **"Add project"** → введите название → **"Continue"**
2. Отключите Google Analytics (не нужен) → **"Create project"**
3. Подождите 30 секунд → **"Continue"**

### 2️⃣ Добавьте веб-приложение

1. На главной странице проекта нажмите **`</>`** (Web)
2. App nickname: `Art Gallery` → **НЕ** ставьте галку Firebase Hosting
3. **"Register app"** → скопируйте **ВЕСЬ** блок `firebaseConfig`
4. **"Continue to console"**

### 3️⃣ Включите Google Authentication

1. Левое меню: **"Authentication"** (замок 🔐)
2. **"Get started"**
3. Вкладка **"Sign-in method"**
4. Нажмите на **"Google"**
5. Включите переключатель **"Enable"**
6. **Support email**: выберите ваш email
7. **"Save"**

### 4️⃣ Создайте файл .env.local

В корне проекта создайте файл `.env.local` и вставьте:

```env
# Скопируйте значения из firebaseConfig (шаг 2)
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=art-gallery-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=art-gallery-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=art-gallery-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Где найти значения:**

- Откройте скопированный `firebaseConfig` (из шага 2)
- Замените `YOUR_VALUE` → на значения из конфига

### 5️⃣ Добавьте домен GitHub Pages

1. **Authentication** → **Settings** → **Authorized domains**
2. **"Add domain"**
3. Введите: `andyfullstack.github.io`
4. **"Add"**

### 6️⃣ Запустите приложение

```bash
npm start
```

**Готово! 🎉**

---

## ✅ Проверка работы

1. Откройте http://localhost:3000/goit-react-hw-02-feedback
2. Нажмите на иконку **User** (справа в header)
3. Нажмите **"Увійти через Google"**
4. Выберите Google аккаунт
5. ✅ Вы увидите своё имя в header!

---

## 🎯 Что работает

| Функция                        | Статус |
| ------------------------------ | ------ |
| Google OAuth авторизация       | ✅     |
| Email/пароль регистрация       | ✅     |
| Email/пароль вход              | ✅     |
| Отображение имени пользователя | ✅     |
| Выход из аккаунта              | ✅     |
| Обработка ошибок               | ✅     |
| Индикатор загрузки             | ✅     |
| Закрытие меню при клике вне    | ✅     |
| Мобильная адаптация            | ✅     |

---

## 🐛 Решение проблем

### ❌ "Firebase не налаштовано"

**Причина:** Не создан файл `.env.local` или неправильные значения

**Решение:**

1. Убедитесь, что файл `.env.local` находится в **корне проекта** (рядом с
   `package.json`)
2. Проверьте, что все переменные начинаются с `REACT_APP_`
3. **Перезапустите** `npm start` (переменные окружения загружаются при старте!)

### ❌ "auth/configuration-not-found"

**Причина:** Google провайдер не включен в Firebase

**Решение:**

1. Firebase Console → Authentication → Sign-in method
2. Найдите "Google" → включите переключатель
3. Укажите support email → Save

### ❌ "auth/unauthorized-domain"

**Причина:** Домен не добавлен в Authorized domains

**Решение:**

1. Authentication → Settings → Authorized domains
2. Add domain → введите ваш домен
3. Для GitHub Pages: `<username>.github.io`

### ❌ Не работает на GitHub Pages

**Причина:** Переменные окружения не передаются на GitHub

**Решение:**

1. GitHub репозиторий → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Добавьте каждую переменную:
   - Name: `REACT_APP_FIREBASE_API_KEY`
   - Value: значение из `.env.local`
4. Повторите для всех 6 переменных
5. В `.github/workflows/deploy.yml` добавьте:
   ```yaml
   - name: Build
     run: npm run build
     env:
       REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
       REACT_APP_FIREBASE_AUTH_DOMAIN:
         ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
       REACT_APP_FIREBASE_PROJECT_ID:
         ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
       REACT_APP_FIREBASE_STORAGE_BUCKET:
         ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
       REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
         ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
       REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
   ```

---

## 📱 Как использовать в коде

### Получить текущего пользователя

```jsx
import { useAuth } from '../hooks/use-auth';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Завантаження...</div>;

  if (user) {
    return <div>Привіт, {user.displayName}!</div>;
  }

  return <div>Будь ласка, увійдіть</div>;
}
```

### Выход из аккаунта

```jsx
import { logout } from '../hooks/use-auth';

function LogoutButton() {
  const handleClick = async () => {
    const result = await logout();
    if (result.success) {
      console.log('Вийшов');
    }
  };

  return <button onClick={handleClick}>Вийти</button>;
}
```

---

## 🔒 Безопасность

✅ Файл `.env.local` добавлен в `.gitignore` → секреты не попадают в Git ✅
Firebase API Key можно публиковать (он защищен правилами Firebase) ✅ Все
запросы проходят через защищенный Firebase Auth ✅ GitHub Secrets защищают
переменные на CI/CD

---

## 📚 Дополнительно

- 📖 [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- 🎥
  [Видео: Firebase Auth за 10 минут](https://www.youtube.com/watch?v=rbuSx1yEgV8)
- 💬 Вопросы? Откройте Issue на GitHub

---

**Создано с ❤️ для Art Gallery**
