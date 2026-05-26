'use client';

export default function LogoSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      width="100%"
      viewBox="0 0 690 330"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="পাঁচমিশালি"
    >
      <rect width="680" height="320" rx="16" fill="#2a0a14" />

      <g transform="translate(340,160)">
        <ellipse cx="0" cy="0" rx="110" ry="110" fill="none" stroke="#b8860b" strokeWidth="1" opacity="0.35" />
        <ellipse cx="0" cy="0" rx="102" ry="102" fill="none" stroke="#b8860b" strokeWidth="0.5" opacity="0.2" />

        <g>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => (
            <ellipse key={angle} cx="0" cy="-108" rx="5" ry="9" fill="#b8860b" opacity="0.6" transform={`rotate(${angle})`} />
          ))}
        </g>

        <g>
          {[0,45,90,135,180,225,270,315].map(angle => (
            <ellipse key={angle} cx="0" cy="-52" rx="7" ry="14" fill="#c0392b" opacity="0.85" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="14" fill="#b8860b" />
          <circle cx="0" cy="0" r="9" fill="#2a0a14" />
          <circle cx="0" cy="0" r="5" fill="#b8860b" />
        </g>

        <text x="0" y="-10" textAnchor="middle" fontSize="52" fontWeight="700" fill="#e8c84a" fontFamily="serif" letterSpacing="2">পাচমিশালি</text>
        <text x="0" y="24" textAnchor="middle" fontSize="19" fontWeight="400" fill="#f0d080" fontFamily="serif" letterSpacing="8">PACHMISHALI</text>
        <line x1="-90" y1="38" x2="90" y2="38" stroke="#b8860b" strokeWidth="0.8" opacity="0.7" />
        <text x="0" y="58" textAnchor="middle" fontSize="11" fontWeight="400" fill="#c09840" fontFamily="sans-serif" letterSpacing="3">NILPHAMARI · BANGLADESH</text>
      </g>

      <g transform="translate(100,160)">
        {[0,60,120,180,240,300].map(angle => (
          <ellipse key={angle} cx="0" cy="0" rx="7" ry="14" fill="#c0392b" opacity="0.5" transform={`rotate(${angle})`} />
        ))}
        <circle cx="0" cy="0" r="6" fill="#b8860b" opacity="0.7" />
      </g>

      <g transform="translate(580,160)">
        {[0,60,120,180,240,300].map(angle => (
          <ellipse key={angle} cx="0" cy="0" rx="7" ry="14" fill="#c0392b" opacity="0.5" transform={`rotate(${angle})`} />
        ))}
        <circle cx="0" cy="0" r="6" fill="#b8860b" opacity="0.7" />
      </g>

      <line x1="130" y1="160" x2="218" y2="160" stroke="#b8860b" strokeWidth="0.6" opacity="0.4" />
      <line x1="462" y1="160" x2="550" y2="160" stroke="#b8860b" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}
