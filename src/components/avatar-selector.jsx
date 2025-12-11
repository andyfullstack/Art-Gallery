import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { updateUserProfile } from '../hooks/use-auth';

const EMOJI_AVATARS = ['😎', '🎨', '🚀', '✨'];

export function AvatarSelector({ user, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleEmojiSelect = async emoji => {
    setIsLoading(true);
    try {
      // Создаем Data URL с эмодзи в виде SVG
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect width="100" height="100" fill="#6366f1"/>
        <text x="50" y="60" font-size="50" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      </svg>`;
      const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

      const result = await updateUserProfile({
        displayName: user?.displayName,
        photoFile: null,
        photoPreview: dataUrl,
        birthDate: user?.customClaims?.birthDate || '',
      });

      if (result.success) {
        onUpdate?.();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error setting emoji avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async e => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Фото не должно превышать 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Файл должен быть изображением');
        return;
      }

      setIsLoading(true);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await updateUserProfile({
            displayName: user?.displayName,
            photoFile: file,
            photoPreview: reader.result,
            birthDate: user?.customClaims?.birthDate || '',
          });

          if (result.success) {
            onUpdate?.();
            setIsOpen(false);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-accent hover:border-primary transition-colors flex items-center justify-center bg-primary text-white font-semibold text-lg"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{(user.displayName || 'U').charAt(0).toUpperCase()}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-3 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Выбрать эмодзи
            </p>
            <div className="flex gap-2">
              {EMOJI_AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  disabled={isLoading}
                  className="w-8 h-8 text-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full text-xs px-2 py-1.5 flex items-center justify-center gap-1 bg-muted hover:bg-muted/70 rounded transition-colors disabled:opacity-50"
            >
              <Upload className="w-3 h-3" />
              Загрузить фото
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
