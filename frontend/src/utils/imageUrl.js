/**
 * Resolves an avatar URL properly for external URLs, client previews,
 * and server-stored uploads (/uploads/avatars/...).
 *
 * @param {string} url - The avatar path or URL.
 * @returns {string} The fully resolved URL.
 */
export const getAvatarUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

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
