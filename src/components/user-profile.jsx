import { useState } from 'react';
import {
  useAuth,
  updateUserProfile,
  getUserAvatar,
  getUserDisplayName,
} from '../hooks/use-auth';
import { EditProfileModal } from './edit-profile-modal';
import { ShoppingBag, User as UserIcon, Mail, Calendar, X } from 'lucide-react';

export function UserProfile({ isOpen, cart, onClose, onCheckout }) {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !user) return null;

  // Получаем имя и аватар из localStorage
  const displayName =
    getUserDisplayName(user.uid) || user?.displayName || 'Користувач';
  const userAvatar = getUserAvatar(user.uid) || user?.photoURL;

  // Подсчет общей стоимости
  const total = cart.reduce((sum, item) => {
    return sum + (item.priceValue || 0) * (item.quantity || 1);
  }, 0);

  // Форматирование даты регистрации
  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Невідомо';

  const handleSaveProfile = async formData => {
    const result = await updateUserProfile(formData);
    if (result.success) {
      // Профиль успешно обновлен
      console.log('Профиль обновлен');
    } else {
      throw new Error(result.error);
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Close Button */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background rounded-t-2xl">
          <h2 className="text-2xl font-bold">Профіль користувача</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Header профиля */}
          <div className="bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>З нами з {joinDate}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors whitespace-nowrap self-start mt-2"
              >
                Редактировать
              </button>
            </div>
          </div>

          {/* Модальное окно редактирования */}
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveProfile}
          />

          {/* Статистика - компактно */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">У кошику</p>
              <p className="text-lg font-bold text-primary dark:text-accent">
                {cart.length}
              </p>
            </div>

            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Товарів</p>
              <p className="text-lg font-bold text-accent dark:text-primary">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </p>
            </div>

            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Сума</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${total}
              </p>
            </div>
          </div>

          {/* Кнопка оформления заказа */}
          {cart.length > 0 && (
            <button
              onClick={onCheckout}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary hover:shadow-lg text-white rounded-lg transition-all font-medium"
            >
              Оформити замовлення ({cart.length} товарів)
            </button>
          )}

          {/* Список товаров - компактно */}
          {cart.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <h3 className="font-semibold text-sm">Товари в кошику</h3>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center justify-between p-3 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold ml-2 flex-shrink-0">
                      ${item.priceValue * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Кошик порожній</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
