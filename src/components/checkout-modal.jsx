import { useEffect, useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { useLanguage } from '../contexts/language-context';

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderComplete,
  onUpdateQty,
  onRemove,
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: форма, 2: подтверждение, 3: успех
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Україна',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    notes: '',
  });

  // Синхронизация данных пользователя при открытии (без сброса шага)
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        fullName: user?.displayName || prev.fullName || '',
        email: user?.email || prev.email || '',
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const items = cart || [];
  if (items.length === 0) return null;

  // Подсчет общей стоимости
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.priceValue || 0) * (item.quantity || 1);
  }, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.1; // 10% налог
  const total = subtotal + shipping + tax;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setStep(2); // Переход к подтверждению
  };

  const handleConfirmOrder = () => {
    setStep(3); // Заказ оформлен
    setTimeout(() => {
      onOrderComplete();
      setStep(1);
      setFormData({
        fullName: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        country: 'Україна',
        paymentMethod: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        notes: '',
      });
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-background w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-[70vw] rounded-xl sm:rounded-2xl shadow-2xl my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-border sticky top-0 bg-background z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors font-semibold"
          >
            ← {t.backHome}
          </a>
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors font-semibold"
          >
            <X className="w-4 h-4" /> {t.close}
          </button>
        </div>

        {/* Шаг 1: Форма оформления */}
        {step === 1 && (
          <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-accent mb-2">
              {t.orderTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              {t.orderSubtitle}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Левая колонка - Форма */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Контактная информация */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center text-sm">
                        1
                      </span>
                      {t.contactInfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.fullNameLabel}
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.namePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.emailLabel}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          {t.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.phonePlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Адрес доставки */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center text-sm">
                        2
                      </span>
                      {t.deliveryAddressTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          {t.addressLabel}
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.addressPlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.cityLabel}
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.cityPlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.zipLabel}
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          placeholder={t.zipPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Способ оплаты */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center text-sm">
                        3
                      </span>
                      {t.paymentMethod}
                    </h3>
                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="w-5 h-5"
                        />
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">{t.cardOption}</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="w-5 h-5"
                        />
                        <Truck className="w-5 h-5" />
                        <span className="font-medium">{t.cashOption}</span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            {t.cardNumberLabel}
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            required={formData.paymentMethod === 'card'}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t.cardExpiryLabel}
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            required={formData.paymentMethod === 'card'}
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t.cardCVVLabel}
                          </label>
                          <input
                            type="text"
                            name="cardCVV"
                            required={formData.paymentMethod === 'card'}
                            value={formData.cardCVV}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Примечания */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.notesLabel}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                      placeholder={t.notesPlaceholder}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="sm:w-1/3 w-full py-4 border-2 border-border rounded-xl font-semibold hover:bg-muted transition-colors"
                    >
                      {t.continueShopping}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      {t.continueCheckout}
                    </button>
                  </div>
                </form>
              </div>

              {/* Правая колонка - Сводка заказа */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-muted/30 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    {t.orderSummaryTitle}
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex gap-3 pb-3 border-b border-border last:border-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.artist}
                          </p>
                          <p className="text-sm font-semibold text-primary dark:text-accent">
                            ${item.priceValue} × {item.quantity}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                const next = (item.quantity || 1) - 1;
                                if (next <= 0) {
                                  onRemove?.(item.id);
                                } else {
                                  onUpdateQty?.(item.id, next);
                                }
                              }}
                              className="p-1 rounded-full border border-border hover:bg-muted"
                              aria-label="Уменьшить количество"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="min-w-[2ch] text-center text-xs">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQty?.(item.id, (item.quantity || 1) + 1)
                              }
                              className="p-1 rounded-full border border-border hover:bg-muted"
                              aria-label="Увеличить количество"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              className="text-xs text-destructive flex items-center gap-1 ml-auto"
                              onClick={() => onRemove?.(item.id)}
                              aria-label="Удалить товар"
                            >
                              <Trash2 className="w-3 h-3" /> {t.remove}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t-2 border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.subtotalLabel}
                      </span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.shippingLabel}
                      </span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">
                            {t.freeShipping}
                          </span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.taxLabel}
                      </span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-border">
                      <span>{t.totalLabel}</span>
                      <span className="text-primary dark:text-accent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {subtotal < 500 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
                      <p className="text-blue-600 dark:text-blue-400">
                        💡{' '}
                        {t.freeShippingHint.replace(
                          '{amount}',
                          (500 - subtotal).toFixed(2)
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Подтверждение */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-primary dark:text-accent mb-2">
              {t.confirmStepTitle}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t.confirmStepSubtitle}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Данные клиента */}
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">{t.clientInfoTitle}</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">
                        {t.fullNameLabel.replace(' *', '')}:
                      </span>{' '}
                      {formData.fullName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t.emailLabel.replace(' *', '')}:
                      </span>{' '}
                      {formData.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t.phoneLabel.replace(' *', '')}:
                      </span>{' '}
                      {formData.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">{t.deliveryInfoTitle}</h3>
                  <div className="space-y-1 text-sm">
                    <p>{formData.address}</p>
                    <p>
                      {formData.city}, {formData.zipCode}
                    </p>
                    <p>{formData.country}</p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">{t.paymentInfoTitle}</h3>
                  <p className="text-sm">
                    {formData.paymentMethod === 'card'
                      ? `${t.cardOption} •••• ${formData.cardNumber.slice(-4)}`
                      : t.cashOnDelivery}
                  </p>
                </div>
              </div>

              {/* Товары */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-semibold mb-4">{`${t.itemsTitle} (${items.length})`}</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-3 pb-3 border-b border-border last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-40 h-40 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.artist}
                        </p>
                        <p className="text-sm font-semibold text-primary dark:text-accent mt-1">
                          ${item.priceValue} × {item.quantity} = $
                          {(item.priceValue * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const next = (item.quantity || 1) - 1;
                              if (next <= 0) {
                                onRemove?.(item.id);
                              } else {
                                onUpdateQty?.(item.id, next);
                              }
                            }}
                            className="p-1 rounded-full border border-border hover:bg-muted"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="min-w-[2ch] text-center text-sm">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQty?.(item.id, (item.quantity || 1) + 1)
                            }
                            className="p-1 rounded-full border border-border hover:bg-muted"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          className="text-xs text-destructive flex items-center gap-1"
                          onClick={() => onRemove?.(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" /> {t.remove}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t-2 border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t.subtotalLabel}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t.shippingLabel}
                    </span>
                    <span>
                      {shipping === 0
                        ? t.freeShipping
                        : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.taxLabel}</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-border">
                    <span>{t.totalLabel}</span>
                    <span className="text-primary dark:text-accent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="flex-1 py-4 border-2 border-border rounded-xl font-semibold hover:bg-muted transition-colors"
              >
                {t.backButton}
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-4 bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                {t.confirmOrder}
              </button>
            </div>
          </div>
        )}

        {/* Шаг 3: Успех */}
        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-primary dark:text-accent mb-2">
              {t.orderPlacedTitle}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t.orderPlacedSubtitle} №{Math.floor(Math.random() * 10000)}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {t.emailLabel.replace(' *', '')}: {formData.email}
            </p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-accent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
