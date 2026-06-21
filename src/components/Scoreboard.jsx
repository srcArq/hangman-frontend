const Scoreboard = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="scoreboard" aria-label="Marcador">
      <span className="stat">
        <span className="stat-label">Ganadas</span>
        <span className="stat-value">{stats.wins}</span>
      </span>
      <span className="stat">
        <span className="stat-label">Perdidas</span>
        <span className="stat-value">{stats.losses}</span>
      </span>
      <span className="stat">
        <span className="stat-label">Racha</span>
        <span className="stat-value">{stats.streak}</span>
      </span>
    </div>
  );
};

export default Scoreboard;
