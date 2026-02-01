import type { LucideIcon } from 'lucide-react';
import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import BackButton from '../../Components/BackButton';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

interface SupportItem {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  link: string;
  action: 'copy' | 'open';
}

const Support = () => {
  // TODO: from API / web config
  const supportList: SupportItem[] = [
    { title: 'Call us', icon: Phone, link: '+234 800 000 0000', action: 'copy' },
    { title: 'Email us', icon: Mail, link: 'support@terrabyte.com.ng', action: 'copy' },
    { title: 'WhatsApp', icon: MessageCircle, link: 'https://wa.me/2348000000000', action: 'open' },
    { title: 'Our Website', icon: Globe, link: 'https://terrabyte.com.ng', action: 'open' },
    { title: 'Facebook', subtitle: 'Reach us on Facebook', icon: Facebook, link: 'https://facebook.com/terrabyte', action: 'open' },
    { title: 'X (Twitter)', subtitle: 'Reach us on X', icon: Twitter, link: 'https://twitter.com/terrabyte', action: 'open' },
    { title: 'Instagram', icon: Instagram, link: 'https://instagram.com/terrabyte', action: 'open' },
  ];

  const handleItem = (item: SupportItem) => {
    if (item.action === 'copy') {
      navigator.clipboard.writeText(item.link);
      // TODO: toast "Copied to clipboard"
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">
          Contact Support
        </h1>

        <div className="space-y-2">
          {supportList.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleItem(item)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors text-left"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] shrink-0">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <span className="text-[var(--text-muted)] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Support;
