export default function SakuraDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8 px-4">
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-sakura-200" />
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Center blossom */}
        <g transform="translate(20,12)" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-8 C2.5,-5.5 4,-2 0,0 C-4,-2 -2.5,-5.5 0,-8 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-8 C2.5,-5.5 4,-2 0,0 C-4,-2 -2.5,-5.5 0,-8 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-8 C2.5,-5.5 4,-2 0,0 C-4,-2 -2.5,-5.5 0,-8 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-8 C2.5,-5.5 4,-2 0,0 C-4,-2 -2.5,-5.5 0,-8 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-8 C2.5,-5.5 4,-2 0,0 C-4,-2 -2.5,-5.5 0,-8 Z" /></g>
          <circle r="2" fill="#B8860B" opacity="0.4" />
        </g>
        {/* Left leaf */}
        <path d="M8,14 Q12,8 16,12" stroke="#A0384F" strokeWidth="0.8" fill="none" opacity="0.3" />
        {/* Right leaf */}
        <path d="M32,14 Q28,8 24,12" stroke="#A0384F" strokeWidth="0.8" fill="none" opacity="0.3" />
      </svg>
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-sakura-200" />
    </div>
  );
}
