import { useEffect, useState, useMemo } from 'react';
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
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { userApi } from '../../../core/api/user.api';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

interface SupportItem {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  link: string;
  action: 'copy' | 'open';
}

interface WebsiteConfig {
  admin_email?: string | null;
  admin_phone?: string | null;
  whatsapp_group?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
}

const WEBSITE_URL = 'https://terrabyte.com.ng';

function toWaLink(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

const Support = () => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getConfigurations()
      .then((res) => {
        const data = res?.data as Record<string, unknown> | undefined;
        const wc = data?.website_configurations as WebsiteConfig | undefined;
        setConfig(wc ?? null);
      })
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, []);

  const supportList: SupportItem[] = useMemo(() => {
    const c = config;
    const phone = c?.admin_phone ?? '';
    const items: SupportItem[] = [];
    if (phone) {
      items.push({ title: 'Call us', icon: Phone, link: phone, action: 'copy' });
    }
    if (c?.admin_email) {
      items.push({ title: 'Email us', icon: Mail, link: c.admin_email, action: 'copy' });
    }
    if (phone) {
      const wa = toWaLink(phone);
      if (wa) items.push({ title: 'WhatsApp', icon: MessageCircle, link: wa, action: 'open' });
    }
    if (c?.whatsapp_group) {
      items.push({ title: 'WhatsApp Group', icon: MessageCircle, link: c.whatsapp_group, action: 'open' });
    }
    if (c?.facebook) {
      items.push({ title: 'Facebook', subtitle: 'Reach us on Facebook', icon: Facebook, link: c.facebook, action: 'open' });
    }
    if (c?.twitter) {
      items.push({ title: 'X (Twitter)', subtitle: 'Reach us on X', icon: Twitter, link: c.twitter, action: 'open' });
    }
    if (c?.instagram) {
      items.push({ title: 'Instagram', icon: Instagram, link: c.instagram, action: 'open' });
    }
    items.push({ title: 'Our Website', icon: Globe, link: WEBSITE_URL, action: 'open' });
    return items;
  }, [config]);

  const handleItem = (item: SupportItem) => {
    if (item.action === 'copy') {
      navigator.clipboard.writeText(item.link).then(
        () => toast.success(`${item.link} copied to clipboard`),
        () => toast.error('Failed to copy')
      );
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

        {loading ? (
          <p className="text-[var(--text-muted)]">Loading support options...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Support;
