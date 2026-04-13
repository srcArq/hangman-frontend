const LevelSelector = ({ onSelectLevel }) => {
  return (
    <div className="level-selector">
      <h2 className="fontBody">¿ Dificultad ?</h2>
      <div className="level-buttons">
        <button className="gameButton" onClick={() => onSelectLevel(1)}>Fácil</button>
        <button className="gameButton" onClick={() => onSelectLevel(2)}>Medio</button>
        <button className="gameButton" onClick={() => onSelectLevel(3)}>Difícil</button>
      </div>
    </div>
  );
};

export default LevelSelector;