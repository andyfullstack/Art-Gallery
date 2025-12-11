import { useState } from 'react';
import { useLanguage } from '../contexts/language-context';
import { useScrollAnimation } from '../hooks/use-scroll-animation';

export function ContactForm() {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setName('');
    setEmail('');
    setMessage('');
    alert(t?.messageSent || 'Message sent');
  };

  return (
    <form
      ref={elementRef}
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 scroll-animate ${
        isVisible ? 'visible' : ''
      }`}
      style={{
        animation: isVisible ? 'fade-in-up 0.6s ease 0.1s both' : 'none',
      }}
      aria-label={t?.contactForm || 'Contact form'}
    >
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t?.yourName || 'Your name'}
        className="p-3 rounded bg-card border"
        aria-label={t?.yourName || 'Your name'}
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t?.email || 'Email'}
        className="p-3 rounded bg-card border"
        aria-label={t?.email || 'Email'}
      />
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t?.messagePlaceholder || 'Message'}
        className="p-3 rounded bg-card border md:col-span-2"
        aria-label={t?.messagePlaceholder || 'Message'}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded md:col-span-2"
      >
        {t?.send || 'Send'}
      </button>
    </form>
  );
}

export default ContactForm;
