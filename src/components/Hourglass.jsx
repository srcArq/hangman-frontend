// Reloj de arena en estilo lápiz (líneas negras). La arena de arriba se vacía
// y la de abajo se llena según `ratio` (1 = lleno arriba, 0 = vacío). Cuando
// queda poco tiempo, `urgent` lo pone rojo y tembloroso.
const Hourglass = ({ ratio, urgent }) => {
  const r = Math.max(0, Math.min(1, ratio));

  // Geometría (viewBox 0 0 100 140). Bulbo superior 18..70, inferior 70..122.
  const yTopSurface = 18 + (1 - r) * 52;
  const hwTop = 32 * r;
  const yBotSurface = 122 - (1 - r) * 52;
  const hwBot = 32 * r;

  const sand = urgent ? '#c62828' : '#222';
  const frame = urgent ? '#c62828' : '#111';

  return (
    <svg
      className={`hourglass ${urgent ? 'urgent' : ''}`}
      viewBox="0 0 100 140"
      role="img"
      aria-label="Reloj de arena"
    >
      {/* Arena (debajo del marco) */}
      {r > 0.01 && (
        <polygon points={`${50 - hwTop},${yTopSurface} ${50 + hwTop},${yTopSurface} 50,70`} fill={sand} />
      )}
      {r < 0.99 && (
        <polygon points={`18,122 82,122 ${50 + hwBot},${yBotSurface} ${50 - hwBot},${yBotSurface}`} fill={sand} />
      )}
      {r > 0.01 && r < 0.99 && <rect x="49" y="69" width="2" height="22" fill={sand} />}

      {/* Marco */}
      <g fill="none" stroke={frame} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <line x1="14" y1="16" x2="86" y2="16" />
        <line x1="14" y1="124" x2="86" y2="124" />
        <path d="M18 18 L82 18 L50 70 Z" />
        <path d="M50 70 L82 122 L18 122 Z" />
      </g>
    </svg>
  );
};

export default Hourglass;
