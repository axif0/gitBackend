export default function SakuraBackground() {
  return (
    <div className="sakura-bg" aria-hidden="true">
      {/* Glow orbs */}
      <div className="sakura-orb" style={{ top: '-80px', left: '-80px', width: '350px', height: '350px', background: '#F2C4D8' }} />
      <div className="sakura-orb" style={{ top: '-40px', right: '-60px', width: '280px', height: '280px', background: '#F5ECD4' }} />
      <div className="sakura-orb" style={{ top: '40%', right: '-40px', width: '320px', height: '320px', background: '#FAE8F1' }} />
      <div className="sakura-orb" style={{ bottom: '-60px', left: '10%', width: '250px', height: '250px', background: '#F2C4D8' }} />

      {/* SVG pattern layer */}
      <svg className="sakura-pattern-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="sakura-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Large blossom - 5 petals */}
            <g transform="translate(100,100)" opacity="0.07" fill="#D4748D">
              <g transform="rotate(0)"><path d="M0,-28 C8,-20 14,-8 0,0 C-14,-8 -8,-20 0,-28 Z" /></g>
              <g transform="rotate(72)"><path d="M0,-28 C8,-20 14,-8 0,0 C-14,-8 -8,-20 0,-28 Z" /></g>
              <g transform="rotate(144)"><path d="M0,-28 C8,-20 14,-8 0,0 C-14,-8 -8,-20 0,-28 Z" /></g>
              <g transform="rotate(216)"><path d="M0,-28 C8,-20 14,-8 0,0 C-14,-8 -8,-20 0,-28 Z" /></g>
              <g transform="rotate(288)"><path d="M0,-28 C8,-20 14,-8 0,0 C-14,-8 -8,-20 0,-28 Z" /></g>
              <circle r="4" fill="#B8860B" opacity="0.15" />
            </g>

            {/* Small scattered petal 1 */}
            <g transform="translate(40,30) rotate(25)" opacity="0.05" fill="#D4748D">
              <path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" />
            </g>

            {/* Small scattered petal 2 */}
            <g transform="translate(160,160) rotate(-15)" opacity="0.05" fill="#D4748D">
              <path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" />
            </g>

            {/* Tiny falling teardrop 1 */}
            <g transform="translate(30,140) rotate(40)" opacity="0.04" fill="#D4748D">
              <path d="M0,-8 C3,-5 4,-1 0,2 C-4,-1 -3,-5 0,-8 Z" />
            </g>

            {/* Tiny falling teardrop 2 */}
            <g transform="translate(170,50) rotate(-30)" opacity="0.04" fill="#D4748D">
              <path d="M0,-8 C3,-5 4,-1 0,2 C-4,-1 -3,-5 0,-8 Z" />
            </g>

            {/* Tiny falling teardrop 3 */}
            <g transform="translate(120,180) rotate(60)" opacity="0.04" fill="#D4748D">
              <path d="M0,-8 C3,-5 4,-1 0,2 C-4,-1 -3,-5 0,-8 Z" />
            </g>

            {/* Thin branch strokes */}
            <path d="M20,80 Q60,70 100,90" stroke="#A0384F" strokeWidth="0.5" fill="none" opacity="0.04" />
            <path d="M140,20 Q160,60 180,40" stroke="#A0384F" strokeWidth="0.5" fill="none" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sakura-pattern)" />
      </svg>

      {/* Corner decorative branches */}
      <svg className="sakura-corner sakura-corner-tl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,200 Q40,160 80,140 Q120,120 160,80 Q180,50 200,0" stroke="#A0384F" strokeWidth="1.5" opacity="0.06" />
        <g transform="translate(60,145)" opacity="0.08" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <circle r="3" fill="#B8860B" opacity="0.2" />
        </g>
        <g transform="translate(130,90)" opacity="0.06" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-12 C4,-8 7,-3 0,0 C-7,-3 -4,-8 0,-12 Z" /></g>
        </g>
      </svg>

      <svg className="sakura-corner sakura-corner-tr" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M200,200 Q160,160 120,140 Q80,120 40,80 Q20,50 0,0" stroke="#A0384F" strokeWidth="1.5" opacity="0.06" />
        <g transform="translate(140,145)" opacity="0.08" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
          <circle r="3" fill="#B8860B" opacity="0.2" />
        </g>
      </svg>

      <svg className="sakura-corner sakura-corner-bl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 Q40,40 80,60 Q120,80 160,120 Q180,150 200,200" stroke="#A0384F" strokeWidth="1.5" opacity="0.06" />
        <g transform="translate(80,60)" opacity="0.06" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
        </g>
      </svg>

      <svg className="sakura-corner sakura-corner-br" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M200,0 Q160,40 120,60 Q80,80 40,120 Q20,150 0,200" stroke="#A0384F" strokeWidth="1.5" opacity="0.06" />
        <g transform="translate(120,60)" opacity="0.06" fill="#D4748D">
          <g transform="rotate(0)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(72)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(144)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(216)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
          <g transform="rotate(288)"><path d="M0,-14 C4,-10 8,-4 0,0 C-8,-4 -4,-10 0,-14 Z" /></g>
        </g>
      </svg>
    </div>
  );
}
