import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTERNAL_BANNER_ROUTES } from '../../core/constants/bannerPlacements';
import { useBannersStore } from '../../core/stores/banners.store';
import type { AppBanner } from '../../core/api/banners.api';

interface AppPlacementBannerProps {
  placement: string;
  className?: string;
}

const AUTO_SLIDE_MS = 5000;

function handleBannerClick(banner: AppBanner, navigate: (path: string) => void) {
  if (banner.link_type === 'none' || !banner.link_target) return;

  if (banner.link_type === 'external') {
    window.open(banner.link_target, '_blank', 'noopener,noreferrer');
    return;
  }

  const route = INTERNAL_BANNER_ROUTES[banner.link_target];
  if (route) {
    navigate(route);
  }
}

function BannerSlide({
  banner,
  onNavigate,
}: {
  banner: AppBanner;
  onNavigate: (path: string) => void;
}) {
  const clickable =
    banner.link_type !== 'none' && Boolean(banner.link_target?.trim());

  const content = (
    <img
      src={banner.image_url}
      alt={banner.title || 'Promotional banner'}
      className="w-full h-full rounded-xl object-cover"
      loading="lazy"
      draggable={false}
    />
  );

  if (!clickable) {
    return <div className="w-full h-full shrink-0">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => handleBannerClick(banner, onNavigate)}
      className="block w-full h-full shrink-0 p-0 border-0 bg-transparent cursor-pointer rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
    >
      {content}
    </button>
  );
}

const AppPlacementBanner = ({ placement, className = '' }: AppPlacementBannerProps) => {
  const navigate = useNavigate();
  const fetchBanners = useBannersStore((s) => s.fetchBanners);
  const banners = useBannersStore((s) => s.getForPlacement(placement));
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    fetchBanners().catch(() => {});
  }, [fetchBanners]);

  useEffect(() => {
    setActiveIndex(0);
  }, [placement, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (banners.length === 0) return null;

  if (banners.length === 1) {
    return (
      <div className={`aspect-[3.4/1] ${className}`.trim()}>
        <BannerSlide banner={banners[0]} onNavigate={navigate} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="relative aspect-[3.4/1] overflow-hidden rounded-xl touch-pan-y"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? 0;
        }}
        onTouchEnd={(e) => {
          const endX = e.changedTouches[0]?.clientX ?? 0;
          const diff = touchStartX.current - endX;
          if (Math.abs(diff) < 40) return;
          if (diff > 0) {
            setActiveIndex((prev) => (prev + 1) % banners.length);
          } else {
            setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
          }
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full shrink-0">
              <BannerSlide banner={banner} onNavigate={navigate} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Go to banner ${index + 1}`}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-4 bg-[var(--accent-primary)]'
                : 'w-1.5 bg-[var(--accent-primary)]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AppPlacementBanner;
