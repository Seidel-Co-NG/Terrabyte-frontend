/**
 * Returns the image path for a service type (telco, electricity, TV, exam, etc.).
 * Matches Flutter get_service_image logic; uses /img/ assets where available.
 */
const SERVICE_ICON_MAP: Record<string, string> = {
  mtn: '/img/mtn.png',
  glo: '/img/glo.png',
  airtel: '/img/airtel.png',
  '9mobile': '/img/9mobile.png',
  etisalat: '/img/9mobile.png',
  dstv: '/img/dstv.png',
  gotv: '/img/gotv.png',
  startimes: '/img/startimes.png',
  showmax: '/img/showmax.png',
  jamb: '/img/jamb.png',
  waec: '/img/waec.png',
  neco: '/img/neco.png',
  nabteb: '/img/nabteb.png',
  smile: '/img/smile.jpg',
  spectranet: '/img/spectranet.jpg',
  kirani: '/img/kirani.png',
  ratel: '/img/ratel.jpg',
  sms: '/img/smile.jpg', // fallback for bulk sms
  credit: '/img/mtn.png', // generic credit
};

export function getServiceIcon(service: string): string | null {
  if (!service || typeof service !== 'string') return null;
  const s = service.toLowerCase().replace(/\s+/g, ' ');
  for (const [key, path] of Object.entries(SERVICE_ICON_MAP)) {
    if (s.includes(key)) return path;
  }
  return null;
}
