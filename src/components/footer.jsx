import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { ContactForm } from './contact-form';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <ContactForm />

        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="mb-10">Art Gallery</h3>
              <p className="text-gray-400">{t.footerDescription}</p>
            </div>

            <div>
              <h4 className="mb-6">{t.navigation}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#hero"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.home}
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.collection}
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.artists}
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.about}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6">{t.help}</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => {}}
                  >
                    {t.delivery}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => {}}
                  >
                    {t.payment}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => {}}
                  >
                    {t.returns}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => {}}
                  >
                    {t.faq}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6">{t.contactsFooter}</h4>
              <p className="text-gray-400 mb-4">
                {t.addressFull}
                <br />
                +380 (50) 123-45-67
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {}}
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {}}
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Twitter"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {}}
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Mail"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {}}
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>{t.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
