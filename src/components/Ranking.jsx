import { useEffect, useState } from 'react';

const Ranking = ({ apiUrl, onBack }) => {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);
    setEntries(null);
    fetch(`${apiUrl}/api/ranking`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [apiUrl]);

  return (
    <div className="ranking">
      <h2 className="ranking-title">Ranking</h2>
      {error && <p className="ranking-msg">No se pudo cargar el ranking.</p>}
      {!error && entries === null && <p className="ranking-msg">Cargando…</p>}
      {!error && entries && entries.length === 0 && (
        <p className="ranking-msg">Aún no hay jugadores. ¡Sé el primero!</p>
      )}
      {!error && entries && entries.length > 0 && (
        <ol className="ranking-list">
          {entries.map((entry, i) => (
            <li key={`${entry.name}-${i}`} className="ranking-row">
              <span className="r-pos">{i + 1}</span>
              <span className="r-name">{entry.name}</span>
              <span className="r-wins">{entry.wins}</span>
            </li>
          ))}
        </ol>
      )}
      <button className="gameButton" type="button" onClick={onBack}>
        Volver
      </button>
    </div>
  );
};

export default Ranking;
