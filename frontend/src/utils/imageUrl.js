/**
 * Curated high-resolution professional trade portraits for workers.
 * These ensure every worker profile has an appealing, authentic image
 * matching their craft even before they upload their own custom photo.
 */
export const TRADE_AVATARS = {
  electrician: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
  painter: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  plumber: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  carpenter: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  cleaner: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  gardener: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  technician: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  welder: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  general: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
};

/**
 * Returns a deterministic or trade-based portrait URL.
 *
 * @param {string} serviceType
 * @param {string} name
 * @returns {string}
 */
export const getDefaultWorkerAvatar = (serviceType = '', name = '') => {
  const normType = (serviceType || '').toLowerCase().trim();
  for (const [key, url] of Object.entries(TRADE_AVATARS)) {
    if (key !== 'general' && normType.includes(key)) {
      return url;
    }
  }

  // Consistent assignment by worker name
  const keys = Object.keys(TRADE_AVATARS).filter((k) => k !== 'general');
  if (name && typeof name === 'string' && name.trim().length > 0) {
    const cleanName = name.trim();
    let charSum = 0;
    for (let i = 0; i < cleanName.length; i++) {
      charSum += cleanName.charCodeAt(i);
    }
    const idx = charSum % keys.length;
    return TRADE_AVATARS[keys[idx]];
  }

  return TRADE_AVATARS.general;
};

/**
 * Inline SVG avatar data URI fallback that never fails to load anywhere.
 *
 * @param {string} name
 * @returns {string}
 */
export const getFallbackSvgAvatar = (name = 'Worker') => {
  const initial = (typeof name === 'string' && name.trim().charAt(0) ? name.trim().charAt(0) : 'W').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#16191E" />
        <stop offset="100%" stop-color="#0c0e11" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="58" fill="url(#bgG)" stroke="#FDB813" stroke-width="4"/>
    <circle cx="60" cy="46" r="20" fill="#2A303C"/>
    <path d="M26 100 C26 76, 44 68, 60 68 C76 68, 94 76, 94 100 Z" fill="#2A303C"/>
    <circle cx="60" cy="46" r="16" fill="#F4F4F0" opacity="0.95"/>
    <text x="60" y="53" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="900" fill="#16191E" text-anchor="middle">${initial}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Resolves an avatar URL properly for external URLs, client previews,
 * and server-stored uploads (/uploads/avatars/...).
 * If no url is provided, automatically returns a trade-appropriate default avatar.
 *
 * @param {string} url - The avatar path or URL.
 * @param {string} serviceType - Optional trade name to pick accurate trade fallback.
 * @param {string} name - Optional user name to pick deterministic fallback.
 * @returns {string} The fully resolved URL.
 */
export const getAvatarUrl = (url, serviceType = '', name = '') => {
  if (url && typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed) {
      // Return full URLs, data URLs, and blob preview URLs as-is
      if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
      ) {
        return trimmed;
      }

      // If running against an explicit backend host (e.g. Vercel -> Render)
      const apiBase = import.meta.env?.VITE_API_URL || '';
      if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
        const backendRoot = apiBase.replace(/\/api\/?$/, '');
        return `${backendRoot}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
      }

      // Default to relative path (handled by Vite dev server proxy or same-origin backend)
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
  }

  // If no avatar is uploaded yet, return the trade portrait fallback
  return getDefaultWorkerAvatar(serviceType, name);
};

/**
 * Returns initials from a full name (e.g. "Karim Sheikh" -> "KS", "John" -> "J").
 *
 * @param {string} name
 * @param {number} maxChars
 * @returns {string}
 */
export const getInitials = (name, maxChars = 2) => {
  if (!name || typeof name !== 'string') return 'W';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'W';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase().slice(0, maxChars);
};
