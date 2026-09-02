import React, { useId } from 'react';

/**
 * SigmaLab 브랜드 마크
 * — 라운드 사각 + σ (시그마). 랩/실습 느낌은 이름과 그라데이션으로 전달.
 */
export default function BrandLogo({ size = 28, className = '', title = 'SigmaLab' }) {
  const s = Number(size) || 28;
  const uid = useId().replace(/:/g, '');
  const gid = `slGrad-${uid}`;

  return (
    <svg
      className={className}
      width={s}
      height={s}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${gid})`} />
      <path
        d="M30.2 14.8c2.2 0 3.9 1.1 4.8 2.8.3.5-.1 1.1-.7 1.1h-1.7c-.35 0-.65-.15-.85-.45-.55-.85-1.35-1.3-2.35-1.3-1.85 0-3 1.35-3 3.25 0 1.45.85 2.45 2.55 3.35l2.05 1.05c2.5 1.3 3.95 2.95 3.95 5.55 0 3.55-2.7 5.95-6.55 5.95-2.7 0-4.8-1.25-5.85-3.25-.3-.55.05-1.15.7-1.15h1.8c.35 0 .65.2.85.5.7 1.1 1.8 1.7 3.15 1.7 2.1 0 3.4-1.35 3.4-3.25 0-1.5-.85-2.55-2.65-3.5l-2.15-1.1c-2.5-1.3-3.85-2.95-3.85-5.55 0-3.4 2.5-5.7 6.25-5.7Z"
        fill="#fff"
      />
      <defs>
        <linearGradient id={gid} x1="6" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#FB923C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
