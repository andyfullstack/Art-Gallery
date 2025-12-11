# Настройка Firebase для Google Authentication

## Шаг 1: Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Add project" (Создать проект)
3. Введите название проекта (например, "art-gallery")
4. Следуйте инструкциям до завершения создания проекта

## Шаг 2: Регистрация веб-приложения

1. В консоли Firebase выберите ваш проект
2. Нажмите на иконку веб-приложения `</>`
3. Введите название приложения
4. Скопируйте конфигурацию `firebaseConfig`

## Шаг 3: Включение Google Authentication

1. В боковом меню выберите **Authentication** → **Get Started**
2. Перейдите на вкладку **Sign-in method**
3. Найдите **Google** в списке провайдеров
4. Нажмите на **Google** и включите его (переключатель Enable)
5. Введите **Support email** (email поддержки)
6. Нажмите **Save**

## Шаг 4: Настройка авторизованных доменов

1. В **Authentication** → **Settings** → **Authorized domains**
2. Убедитесь, что добавлены:
   - `localhost` (для разработки)
   - Ваш домен GitHub Pages (например, `andyfullstack.github.io`)

## Шаг 5: Обновление конфигурации в коде

Откройте файл `src/firebase/config.js` и замените значения:

\`\`\`javascript const firebaseConfig = { apiKey: "AIza...", // Ваш API Key
authDomain: "your-project.firebaseapp.com", projectId: "your-project",
storageBucket: "your-project.appspot.com", messagingSenderId: "123456789",
appId: "1:123456789:web:abc123" }; \`\`\`

## Шаг 6: Переменные окружения (опционально, рекомендуется)

Создайте файл `.env.local` в корне проекта:

\`\`\`env REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id \`\`\`

Затем обновите `src/firebase/config.js`:

\`\`\`javascript const firebaseConfig = { apiKey:
process.env.REACT_APP_FIREBASE_API_KEY, authDomain:
process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, projectId:
process.env.REACT_APP_FIREBASE_PROJECT_ID, storageBucket:
process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, messagingSenderId:
process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, appId:
process.env.REACT_APP_FIREBASE_APP_ID, }; \`\`\`

**ВАЖНО:** Добавьте `.env.local` в `.gitignore`, чтобы не загружать секреты в
репозиторий!

## Готово!

После выполнения всех шагов, авторизация через Google будет работать.
