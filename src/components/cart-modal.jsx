import { useMemo } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

export function CartModal({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onCheckout,
}) {
  const { t } = useLanguage();

  const getPriceValue = item =>
    item.priceValue ||
    parseInt(String(item.price || '').replace(/[^0-9]/g, '')) ||
    0;

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.quantity || 1) * getPriceValue(item),
        0
      ),
    [items]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={t.cart}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md md:max-w-xl bg-background rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted transition"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">{t.cart}</h2>

          {items.length === 0 && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {t.emptyCart}
            </p>
          )}

          {items.length > 0 && (
            <ul className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {items.map(item => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.artist}
                    </div>
                    <div className="text-sm">{item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded border hover:bg-muted"
                      onClick={() => {
                        const next = (item.quantity || 1) - 1;
                        if (next <= 0) {
                          onRemove(item.id);
                        } else {
                          onUpdateQty(item.id, next);
                        }
                      }}
                      aria-label={`${t.quantity} -`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[2ch] text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="p-2 rounded border hover:bg-muted"
                      onClick={() =>
                        onUpdateQty(item.id, (item.quantity || 1) + 1)
                      }
                      aria-label={`${t.quantity} +`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded border hover:bg-destructive text-destructive"
                      onClick={() => onRemove(item.id)}
                      aria-label={t.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                {t.total}: {total.toLocaleString()} ₴
              </div>
              <button
                onClick={() => {
                  onClose();
                  onCheckout?.();
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-accent transition"
              >
                {t.checkout}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartModal;
