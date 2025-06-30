const LevelSelector = ({ onSelectLevel }) => {
  return (
    <div className="level-selector">
      <h2>Selecciona dificultad:</h2>
      <div className="level-buttons">
        <button onClick={() => onSelectLevel(1)}>Fácil</button>
        <button onClick={() => onSelectLevel(2)}>Medio</button>
        <button onClick={() => onSelectLevel(3)}>Difícil</button>
      </div>
    </div>
  );
};

export default LevelSelector;