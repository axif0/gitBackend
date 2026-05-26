'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function CherryBlossomGlobal() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const branchColor = isDark ? '#4a2d4a' : '#8B7355';
  const petalFill1 = isDark ? '#F4B8C8' : '#fff';
  const petalFill2 = isDark ? '#e8a0b4' : '#FFE4E4';
  const centerFill = isDark ? '#FFD6A0' : '#F9D0A0';
  const scatterFill1 = isDark ? '#F4B8C8' : '#FFB7C5';
  const scatterFill2 = isDark ? '#e8a0b4' : '#fff';

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-60"
      >
        {/* Top branches */}
        <g stroke={branchColor} strokeWidth="2" fill="none" opacity="0.4">
          <path d="M0,60 Q120,100 240,80 Q360,60 480,95 Q600,125 720,100 Q840,80 960,110 Q1080,130 1200,100 Q1320,80 1440,95 Q1520,105 1600,90" />
          <path d="M240,80 Q255,50 265,30" />
          <path d="M480,95 Q495,65 500,40" />
          <path d="M720,100 Q735,70 740,45" />
          <path d="M960,110 Q975,80 980,55" />
          <path d="M1200,100 Q1215,70 1220,45" />
          <path d="M1440,95 Q1455,65 1460,40" />
          <path d="M120,70 Q115,45 110,25" />
          <path d="M600,120 Q615,145 620,165" />
          <path d="M840,85 Q835,110 832,130" />
          <path d="M1080,125 Q1090,150 1095,170" />
          <path d="M1320,85 Q1325,105 1328,125" />
        </g>

        {/* Bottom branches */}
        <g stroke={branchColor} strokeWidth="1.5" fill="none" opacity="0.3">
          <path d="M0,850 Q100,830 200,845 Q300,860 400,840 Q500,820 600,835 Q700,850 800,830 Q900,815 1000,840 Q1100,860 1200,835 Q1300,815 1400,840 Q1500,855 1600,835" />
          <path d="M200,845 Q210,870 215,885" />
          <path d="M500,820 Q510,845 515,860" />
          <path d="M800,830 Q810,855 815,870" />
          <path d="M1100,860 Q1108,878 1112,890" />
          <path d="M1400,840 Q1408,860 1412,875" />
        </g>

        {/* Left side branches */}
        <g stroke={branchColor} strokeWidth="1.5" fill="none" opacity="0.25">
          <path d="M30,0 Q50,100 40,200 Q30,300 55,400 Q75,500 60,600 Q45,700 65,800 Q80,850 70,900" />
          <path d="M40,200 Q20,220 10,230" />
          <path d="M55,400 Q35,420 25,430" />
          <path d="M60,600 Q40,620 30,630" />
        </g>

        {/* Right side branches */}
        <g stroke={branchColor} strokeWidth="1.5" fill="none" opacity="0.25">
          <path d="M1570,0 Q1550,100 1560,200 Q1570,300 1545,400 Q1525,500 1540,600 Q1555,700 1535,800 Q1520,850 1530,900" />
          <path d="M1560,200 Q1580,220 1590,230" />
          <path d="M1545,400 Q1565,420 1575,430" />
          <path d="M1540,600 Q1560,620 1570,630" />
        </g>

        {/* Top blossoms */}
        <g opacity="0.8">
          <g transform="translate(110,25)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0s' }}>
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(0) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(72) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(144) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(216) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(288) translate(0,-12)" />
              <circle r="5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(265,30)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.7s' }}>
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(36) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(108) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(180) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(252) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(324) translate(0,-10)" />
              <circle r="4" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(500,40)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.4s' }}>
              <ellipse rx="11" ry="7" fill={petalFill1} opacity="0.88" transform="rotate(18) translate(0,-13)" />
              <ellipse rx="11" ry="7" fill={petalFill1} opacity="0.88" transform="rotate(90) translate(0,-13)" />
              <ellipse rx="11" ry="7" fill={petalFill1} opacity="0.88" transform="rotate(162) translate(0,-13)" />
              <ellipse rx="11" ry="7" fill={petalFill1} opacity="0.88" transform="rotate(234) translate(0,-13)" />
              <ellipse rx="11" ry="7" fill={petalFill1} opacity="0.88" transform="rotate(306) translate(0,-13)" />
              <circle r="5.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(740,45)">
            <g className="animate-blossom-sway" style={{ animationDelay: '2.1s' }}>
              <ellipse rx="9" ry="5.5" fill={petalFill2} opacity="0.9" transform="rotate(0) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill2} opacity="0.9" transform="rotate(72) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill2} opacity="0.9" transform="rotate(144) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill2} opacity="0.9" transform="rotate(216) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill2} opacity="0.9" transform="rotate(288) translate(0,-11)" />
              <circle r="4.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(980,55)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.5s' }}>
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(36) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(108) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(180) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(252) translate(0,-12)" />
              <ellipse rx="10" ry="6.5" fill={petalFill1} opacity="0.9" transform="rotate(324) translate(0,-12)" />
              <circle r="5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1220,45)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.8s' }}>
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(18) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(90) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(162) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(234) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.92" transform="rotate(306) translate(0,-10)" />
              <circle r="4" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1460,40)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.2s' }}>
              <ellipse rx="9" ry="5.5" fill={petalFill1} opacity="0.88" transform="rotate(0) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill1} opacity="0.88" transform="rotate(72) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill1} opacity="0.88" transform="rotate(144) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill1} opacity="0.88" transform="rotate(216) translate(0,-11)" />
              <ellipse rx="9" ry="5.5" fill={petalFill1} opacity="0.88" transform="rotate(288) translate(0,-11)" />
              <circle r="4.5" fill={centerFill} />
            </g>
          </g>
        </g>

        {/* Side blossoms */}
        <g opacity="0.65">
          <g transform="translate(10,230)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.3s' }}>
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(0) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(72) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(144) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(216) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(288) translate(0,-9)" />
              <circle r="3.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(25,430)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.1s' }}>
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(36) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(108) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(180) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(252) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(324) translate(0,-8)" />
              <circle r="3" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1590,230)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.9s' }}>
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(18) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(90) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(162) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(234) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(306) translate(0,-9)" />
              <circle r="3.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1575,430)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.6s' }}>
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(0) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(72) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(144) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(216) translate(0,-8)" />
              <ellipse rx="6" ry="4" fill={petalFill2} opacity="0.85" transform="rotate(288) translate(0,-8)" />
              <circle r="3" fill={centerFill} />
            </g>
          </g>
        </g>

        {/* Bottom blossoms */}
        <g opacity="0.6">
          <g transform="translate(215,885)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.4s' }}>
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(0) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(72) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(144) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(216) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(288) translate(0,-10)" />
              <circle r="4" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(515,860)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.3s' }}>
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(36) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(108) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(180) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(252) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(324) translate(0,-9)" />
              <circle r="3.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(815,870)">
            <g className="animate-blossom-sway" style={{ animationDelay: '2s' }}>
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(18) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(90) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(162) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(234) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(306) translate(0,-10)" />
              <circle r="4" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1112,890)">
            <g className="animate-blossom-sway" style={{ animationDelay: '0.6s' }}>
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(0) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(72) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(144) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(216) translate(0,-9)" />
              <ellipse rx="7" ry="4.5" fill={petalFill1} opacity="0.85" transform="rotate(288) translate(0,-9)" />
              <circle r="3.5" fill={centerFill} />
            </g>
          </g>

          <g transform="translate(1412,875)">
            <g className="animate-blossom-sway" style={{ animationDelay: '1.5s' }}>
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(36) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(108) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(180) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(252) translate(0,-10)" />
              <ellipse rx="8" ry="5" fill={petalFill2} opacity="0.85" transform="rotate(324) translate(0,-10)" />
              <circle r="4" fill={centerFill} />
            </g>
          </g>
        </g>

        {/* Scattered falling petals */}
        <g>
          <ellipse cx="180" cy="180" rx="5" ry="7" fill={scatterFill1} opacity="0.35" className="animate-petal-drift" style={{ animationDelay: '0s' }} />
          <ellipse cx="400" cy="250" rx="4" ry="5.5" fill={scatterFill2} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '1.5s' }} />
          <ellipse cx="650" cy="200" rx="4.5" ry="6" fill={scatterFill1} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '3s' }} />
          <ellipse cx="900" cy="300" rx="5" ry="7" fill={scatterFill2} opacity="0.35" className="animate-petal-drift" style={{ animationDelay: '0.8s' }} />
          <ellipse cx="1100" cy="220" rx="4" ry="5.5" fill={scatterFill1} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '2.2s' }} />
          <ellipse cx="1350" cy="280" rx="4.5" ry="6" fill={scatterFill2} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '4s' }} />
          <ellipse cx="300" cy="600" rx="4" ry="5.5" fill={scatterFill1} opacity="0.25" className="animate-petal-drift" style={{ animationDelay: '1s' }} />
          <ellipse cx="700" cy="700" rx="5" ry="7" fill={scatterFill2} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '2.5s' }} />
          <ellipse cx="1000" cy="650" rx="4" ry="5.5" fill={scatterFill1} opacity="0.25" className="animate-petal-drift" style={{ animationDelay: '3.5s' }} />
          <ellipse cx="1300" cy="750" rx="4.5" ry="6" fill={scatterFill2} opacity="0.3" className="animate-petal-drift" style={{ animationDelay: '0.5s' }} />
          <ellipse cx="500" cy="450" rx="3.5" ry="5" fill={scatterFill1} opacity="0.2" className="animate-petal-drift" style={{ animationDelay: '4.5s' }} />
          <ellipse cx="1200" cy="500" rx="4" ry="5.5" fill={scatterFill2} opacity="0.25" className="animate-petal-drift" style={{ animationDelay: '2s' }} />
        </g>
      </svg>
    </div>
  );
}
