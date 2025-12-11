import { useAuth } from '../hooks/use-auth';
import {
  Package,
  ShoppingBag,
  User as UserIcon,
  Mail,
  Calendar,
} from 'lucide-react';

export function UserProfile({ cart, onClose, onCheckout }) {
  const { user } = useAuth();

  if (!user) return null;

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

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header профиля */}
        <div className="bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user.displayName || 'Користувач'}
              </h1>
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
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary dark:text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">У кошику</p>
                <p className="text-2xl font-bold text-primary dark:text-accent">
                  {cart.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 dark:bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-accent dark:text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всього товарів</p>
                <p className="text-2xl font-bold text-accent dark:text-primary">
                  {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Сума замовлення</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Быстрый доступ к форме заказа */}
        <div className="bg-muted/40 border border-border rounded-2xl p-6 shadow-lg mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Форма замовлення
            </p>
            <p className="text-sm text-muted-foreground">
              Тут же відкриється та сама форма, що і в кошику.
            </p>
          </div>
          <button
            onClick={onCheckout}
            className="px-5 py-3 bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Відкрити форму замовлення
          </button>
        </div>

        {/* Список товаров */}
        <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-accent/5 dark:to-primary/5 px-8 py-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary dark:text-accent flex items-center gap-3">
              <ShoppingBag className="w-7 h-7" />
              Ваші покупки
            </h2>
            <p className="text-muted-foreground mt-1">
              Переглянути та керувати вашим замовленням
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Кошик порожній
              </h3>
              <p className="text-muted-foreground mb-6">
                Додайте товари до кошика, щоб побачити їх тут
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary hover:bg-accent dark:bg-accent dark:hover:bg-primary text-white rounded-lg transition-colors"
              >
                Почати покупки
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-6 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex gap-6">
                      {/* Изображение товара */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shadow-md group-hover:shadow-xl transition-shadow">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.artist}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent text-sm font-medium">
                            {item.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Кількість: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Цена */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-bold text-primary dark:text-accent mb-1">
                          ${item.priceValue}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            ${item.priceValue * item.quantity} всього
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Итого */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-accent/5 dark:to-primary/5 px-8 py-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-muted-foreground">
                    Всього товарів:
                  </span>
                  <span className="text-xl font-semibold">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}{' '}
                    шт
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-foreground">
                    Загальна сума:
                  </span>
                  <span className="text-3xl font-bold text-primary dark:text-accent">
                    ${total}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-muted hover:bg-muted/70 text-foreground rounded-xl transition-colors font-medium"
                  >
                    Продовжити покупки
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary hover:shadow-lg text-white rounded-xl transition-all font-medium transform hover:scale-105"
                  >
                    Оформити замовлення
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
