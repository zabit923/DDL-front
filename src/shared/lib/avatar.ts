const DEFAULT_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d7ff55"/>
      <stop offset="100%" stop-color="#b7db25"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="80" fill="url(#bg)"/>
  <circle cx="80" cy="62" r="26" fill="#11140d" opacity="0.88"/>
  <path d="M35 136c6-22 24-34 45-34s39 12 45 34" fill="#11140d" opacity="0.88"/>
</svg>`;

export const defaultAvatarUrl = `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_AVATAR_SVG)}`;

export const resolveAvatarUrl = (avatarUrl?: string) => avatarUrl?.trim() || defaultAvatarUrl;

