import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Users, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useScrollAnimation } from '../hooks/use-scroll-animation';

export function AboutSection() {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      id="about"
      className="py-8 px-4 bg-amber-50/40 dark:bg-amber-950/15 transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={elementRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-animate ${
            isVisible ? 'visible' : ''
          }`}
        >
          <div>
            <p className="text-sm uppercase tracking-widest text-accent dark:text-primary mb-4">
              {t.aboutUs}
            </p>
            <h2 className="mb-6 text-primary dark:text-[#d4c799]">
              {t.aboutTitle}
            </h2>
            <p className="text-lg text-foreground/80 dark:text-[#a8b5ac] mb-6">
              {t.aboutText1}
            </p>
            <p className="text-lg text-foreground/80 dark:text-[#a8b5ac] mb-8">
              {t.aboutText2}
            </p>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-3 text-accent dark:text-primary" />
                <p className="text-2xl mb-1 text-primary dark:text-[#d4c799]">
                  500+
                </p>
                <p className="text-sm text-muted-foreground">{t.artworks}</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-accent dark:text-primary" />
                <p className="text-2xl mb-1 text-primary dark:text-[#d4c799]">
                  150+
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.artistsCount}
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-accent dark:text-primary" />
                <p className="text-2xl mb-1 text-primary dark:text-[#d4c799]">
                  2000+
                </p>
                <p className="text-sm text-muted-foreground">{t.clients}</p>
              </div>
            </div>
          </div>

          <div className="relative shadow-2xl rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1739300293397-124ebd1422aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjByZWFkaW5nJTIwY29mZmVlJTIwc2hvcHxlbnwxfHx8fDE3NjQ3NzUyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Bookstore Cafe"
              className="w-full h-[500px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent dark:from-[#1a1a1a]/60 dark:to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
