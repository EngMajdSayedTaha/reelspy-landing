// Monochrome platform marks (currentColor). The design system requires platform
// logos rendered in neutral monochrome — never recolored with the brand gradient.

type IconProps = { size?: number; className?: string };

export function InstagramMark({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="Instagram" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TikTokMark({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="TikTok" className={className}>
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 4v2.6c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.6 5.8-5.8 5.5-2.6-.2-4.6-2.3-4.7-4.9-.1-3 2.5-5.4 5.5-5v2.7c-.4-.1-.9-.2-1.3-.1-1.2.2-2 1.2-1.9 2.4.1 1.2 1.1 2.1 2.3 2 1.2 0 2.1-1 2.1-2.3V3h3.4Z" />
    </svg>
  );
}

export function YouTubeMark({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="YouTube" className={className}>
      <rect x="2" y="5.5" width="20" height="13" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.2 9.3v5.4l4.6-2.7-4.6-2.7Z" fill="currentColor" />
    </svg>
  );
}

export function FacebookMark({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="Facebook" className={className}>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M13.4 21.5v-6.7h2.2l.4-2.6h-2.6v-1.7c0-.75.35-1.45 1.5-1.45h1.2V6.9s-1.05-.18-2.05-.18c-2.1 0-3.4 1.25-3.4 3.5v1.98H8.2v2.6h2.45v6.7"
        fill="currentColor"
      />
    </svg>
  );
}
