import { Palette, Mountain, Shapes, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useScrollAnimation } from '../hooks/use-scroll-animation';

const categories = [
  {
    key: 'category1',
    count: 42,
    icon: Palette,
    desc: 'Сучасне абстрактне мистецтво з яскравими формами та кольорами',
  },
  {
    key: 'category2',
    count: 37,
    icon: Mountain,
    desc: 'Захоплюючі види природи та міських панорам',
  },
  {
    key: 'category3',
    count: 28,
    icon: Shapes,
    desc: 'Чисті лінії та простота в кожному творі',
  },
  {
    key: 'category4',
    count: 31,
    icon: Sparkles,
    desc: 'Актуальні тренди та новаторські підходи',
  },
];

export function CategoriesSection() {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      id="categories"
      className="py-8 px-4 bg-amber-50/40 dark:bg-amber-950/15 transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto" ref={elementRef}>
        <div
          className={`text-center mb-12 scroll-animate ${
            isVisible ? 'visible' : ''
          }`}
        >
          <p className="text-sm uppercase tracking-widest text-accent dark:text-primary mb-2 font-semibold">
            {t.categoriesTitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-[#d4c799]">
            {t.categoriesSubtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.key}
              className="group relative p-8 rounded-2xl bg-card dark:bg-card/80 shadow-md hover:shadow-xl transition-all duration-300 border border-border/60 hover:border-accent/60 dark:hover:border-primary/60 cursor-pointer overflow-hidden text-center"
              style={{
                animation: isVisible
                  ? `fade-in-up 0.5s ease ${idx * 0.1}s both`
                  : 'none',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent dark:from-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/10 dark:bg-primary/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 dark:bg-primary/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-300" />

              <div className="relative z-10 space-y-3 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-foreground/70 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shadow-sm">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="text-lg font-semibold text-foreground dark:text-card-foreground group-hover:text-accent dark:group-hover:text-primary transition-colors duration-300">
                  {t[cat.key]}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.desc}
                </p>
                <div className="text-xs font-medium text-muted-foreground/80">
                  {cat.count} {t.artworks?.toLowerCase?.() || 'artworks'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
