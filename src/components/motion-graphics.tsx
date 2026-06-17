// Lightweight SVG/CSS motion graphics for LoveTech Agrofinance.
// Pure CSS animations (no JS), respects prefers-reduced-motion.

export function FloatingLeaves({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={`pointer-events-none absolute ${className}`}
    >
      <defs>
        <linearGradient id="lt-leaf-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--vetiver)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lt-leaf-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ochre)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--vetiver)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* leaf 1 */}
      <g className="lt-float" style={{ animationDuration: "8s" }}>
        <path
          d="M70 180 C 90 110, 170 90, 220 140 C 180 200, 110 220, 70 180 Z"
          fill="url(#lt-leaf-a)"
        />
        <path d="M80 175 C 130 160, 180 150, 215 145" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
      </g>
      {/* leaf 2 */}
      <g className="lt-float" style={{ animationDuration: "11s", animationDelay: "-2s", transformOrigin: "280px 260px" }}>
        <path
          d="M240 300 C 250 230, 320 210, 360 250 C 340 310, 280 330, 240 300 Z"
          fill="url(#lt-leaf-b)"
        />
        <path d="M250 295 C 290 275, 330 260, 358 252" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
      </g>
      {/* sprout dots */}
      <g className="lt-drift">
        <circle cx="180" cy="80" r="4" fill="var(--ochre)" opacity="0.7" />
        <circle cx="320" cy="160" r="3" fill="var(--teal)" opacity="0.7" />
        <circle cx="120" cy="320" r="5" fill="var(--vetiver)" opacity="0.55" />
      </g>
    </svg>
  );
}

export function GrowthChart({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 200"
      className={`pointer-events-none ${className}`}
    >
      {/* baseline grid */}
      <g stroke="currentColor" strokeOpacity="0.12">
        <line x1="0" y1="50" x2="320" y2="50" />
        <line x1="0" y1="100" x2="320" y2="100" />
        <line x1="0" y1="150" x2="320" y2="150" />
      </g>
      {/* animated growth bars */}
      <g>
        {[30, 70, 110, 150, 190, 230, 270].map((x, i) => {
          const h = 30 + i * 18;
          return (
            <rect
              key={x}
              x={x}
              y={190 - h}
              width="22"
              height={h}
              rx="3"
              fill="var(--vetiver)"
              opacity={0.25 + i * 0.08}
              className="lt-grow"
              style={{ animationDelay: `${i * 0.25}s`, transformBox: "fill-box", transformOrigin: "bottom" }}
            />
          );
        })}
      </g>
      {/* trend line drawing on */}
      <g className="lt-dash" fill="none" stroke="var(--ochre)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 160 L60 140 L110 120 L160 95 L210 78 L260 55 L310 30" />
      </g>
      {/* head dot */}
      <circle cx="310" cy="30" r="6" fill="var(--ochre)" className="lt-pulse" style={{ transformOrigin: "310px 30px" }} />
    </svg>
  );
}

export function OrbitingNodes({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      className={`pointer-events-none ${className}`}
    >
      <circle cx="120" cy="120" r="90" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 6" />
      <circle cx="120" cy="120" r="60" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="2 6" />
      <g className="lt-orbit" style={{ transformOrigin: "120px 120px" }}>
        <circle cx="210" cy="120" r="6" fill="var(--ochre)" />
        <circle cx="30" cy="120" r="4" fill="var(--teal)" />
      </g>
      <g className="lt-orbit" style={{ transformOrigin: "120px 120px", animationDuration: "18s", animationDirection: "reverse" }}>
        <circle cx="120" cy="60" r="5" fill="var(--vetiver)" />
        <circle cx="120" cy="180" r="3" fill="var(--ochre)" />
      </g>
      <circle cx="120" cy="120" r="10" fill="var(--vetiver)" className="lt-pulse" style={{ transformOrigin: "120px 120px" }} />
    </svg>
  );
}

export function SproutMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={className}>
      <g className="lt-float" style={{ transformOrigin: "40px 60px" }}>
        <path d="M40 70 C 40 50, 22 42, 18 28 C 30 30, 40 40, 40 55" fill="var(--vetiver)" />
        <path d="M40 70 C 40 50, 58 42, 62 28 C 50 30, 40 40, 40 55" fill="var(--teal)" opacity="0.85" />
        <circle cx="40" cy="70" r="3" fill="var(--ochre)" />
      </g>
    </svg>
  );
}
