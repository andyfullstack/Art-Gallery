import { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, User as UserIcon, Mail } from 'lucide-react';
import {
  useAuth,
  getUserAvatar,
  getUserBirthDate,
  getUserGender,
  getUserDisplayName,
} from '../hooks/use-auth';
import { PhotoCropper } from './photo-cropper';

const EMOJI_AVATARS = [
  '🎨',
  '🖌️',
  '🎭',
  '🖼️',
  '🌈',
  '✨',
  '🧑‍🎨',
  '🖍️',
  '✏️',
  '🎪',
  '🌟',
  '🔮',
];

export function EditProfileModal({ isOpen, onClose, onSave }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    birthDate: user?.customClaims?.birthDate || '',
    gender: user?.customClaims?.gender || '',
    photoFile: null,
    photoPreview: user?.photoURL || null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCropper, setShowCropper] = useState(false);

  // Обновляем formData когда открывается модалка или меняется user
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        displayName: getUserDisplayName(user.uid) || user?.displayName || '',
        birthDate: getUserBirthDate(user.uid) || '',
        gender: getUserGender(user.uid) || '',
        photoFile: null,
        photoPreview: getUserAvatar(user.uid) || user?.photoURL || null,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEmojiSelect = async emoji => {
    console.log('🎯 Выбран эмодзи:', emoji);

    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#6366f1"/>
      <text x="50" y="60" font-size="50" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
    // Используем encodeURIComponent вместо btoa() для поддержки Unicode (эмодзи)
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;

    console.log('📸 Data URL создан:', dataUrl.substring(0, 50));

    // Обновляем превью сразу
    setFormData(prev => {
      const newFormData = {
        ...prev,
        photoFile: null,
        photoPreview: dataUrl,
      };
      console.log('📝 FormData обновлен с photoPreview');
      return newFormData;
    });

    // Сохраняем автоматически
    try {
      setIsLoading(true);
      console.log('💾 Отправляем на сохранение...');
      const result = await onSave({
        displayName: formData.displayName || user?.displayName || '',
        birthDate: formData.birthDate,
        gender: formData.gender,
        photoFile: null,
        photoPreview: dataUrl,
      });
      console.log('✅ Результат сохранения:', result);
    } catch (err) {
      console.error('❌ Ошибка при сохранении эмодзи:', err);
      setError('Ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка размера (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Фото не должно превышать 5MB');
        return;
      }

      // Проверка типа
      if (!file.type.startsWith('image/')) {
        setError('Файл должен быть изображением');
        return;
      }

      // Превью
      const reader = new FileReader();
      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          photoFile: file,
          photoPreview: e.target?.result,
        }));
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleCropComplete = croppedImage => {
    setFormData(prev => ({
      ...prev,
      photoPreview: croppedImage,
    }));
    setShowCropper(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleResetPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photoFile: null,
      photoPreview: null,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Если у пользователя уже есть имя, не требуем заполнение
    if (!user?.displayName && !formData.displayName.trim()) {
      setError('Имя не должно быть пустым');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* User Info Header */}
        <div className="bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary text-white p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-2 border-white/30">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-10 h-10" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold truncate">
                {user?.displayName || 'Користувач'}
              </h2>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Закрыти"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-semibold mb-2">
              Фото профиля
            </label>

            {/* Preview */}
            <div className="flex justify-center mb-2">
              <button
                type="button"
                onClick={handlePhotoClick}
                className="relative group"
                title="Клик для смены фотографии"
              >
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden transition-all ${
                    formData.photoPreview
                      ? 'border-2 border-border'
                      : 'border-2 border-border hover:border-primary dark:hover:border-accent'
                  }`}
                >
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                {formData.photoPreview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold">
                      Изменить
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Emoji Options */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-muted-foreground text-center flex-1">
                  Аватар (художники)
                </p>
                {formData.photoPreview && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                    title="Убрать фото"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {EMOJI_AVATARS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      handleEmojiSelect(emoji);
                    }}
                    className="w-12 h-12 text-2xl hover:scale-125 active:scale-95 transition-transform bg-muted rounded-lg hover:bg-primary/20 dark:hover:bg-accent/20 cursor-pointer border border-border hover:border-primary dark:hover:border-accent flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={handlePhotoClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Фото (JPG, PNG, макс 5MB)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-semibold mb-1.5"
            >
              Імя
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Ваше імя"
              className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
              maxLength="50"
            />
          </div>

          {/* Gender Input */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Стать</label>
            <div className="flex gap-2">
              <label
                className="flex items-center gap-1.5 flex-1 px-2 py-1.5 text-sm border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                style={{
                  background:
                    formData.gender === 'female'
                      ? 'var(--color-primary)'
                      : 'transparent',
                  color: formData.gender === 'female' ? 'white' : 'inherit',
                }}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="w-3 h-3"
                />
                <span className="font-medium">👩 Ж</span>
              </label>
              <label
                className="flex items-center gap-1.5 flex-1 px-2 py-1.5 text-sm border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                style={{
                  background:
                    formData.gender === 'male'
                      ? 'var(--color-primary)'
                      : 'transparent',
                  color: formData.gender === 'male' ? 'white' : 'inherit',
                }}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="w-3 h-3"
                />
                <span className="font-medium">👨 М</span>
              </label>
            </div>
          </div>

          {/* Birth Date Input */}
          <div>
            <label
              htmlFor="birthDate"
              className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              День рождения
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
            />
            {formData.birthDate && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Вік: {calculateAge(formData.birthDate)} років
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 text-sm bg-primary dark:bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>

      {/* Photo Cropper Modal */}
      {showCropper && formData.photoPreview && (
        <PhotoCropper
          photoPreview={formData.photoPreview}
          onCrop={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

// Вспомогательная функция для расчета возраста
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
