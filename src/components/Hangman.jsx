import { useState } from "react";
import BoardGame from "./BoardGame";
import LevelSelector from "./LevelSelector";
import Loader from "./Loader";

const Hangman = () => {
    const [token, setToken] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [maskedWord, setMaskedWord] = useState(null);
    const [level, setLevel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    async function selectLevel(selectedLevel) {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${PUBLIC_API_URL}/api/selectLevel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ level: selectedLevel }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setToken(data.token);
            setAttempts(data.attempts);
            setMaskedWord(data.maskedWord);
            setLevel(selectedLevel);
        } catch (error) {
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    function resetGame() {
        setToken(null);
        setAttempts(null);
        setMaskedWord(null);
        setLevel(null);
        setError(null);
    }

    return (
        <>
            <h1 className={`title ${token ? 'second-step' : ''}`}>AHORCADO</h1>
            {loading && <Loader />}
            {error && (
                <div className="error-message">
                    <p className="fontBody">{error}</p>
                    <button className="gameButton" onClick={() => setError(null)}>Reintentar</button>
                </div>
            )}
            {token === null && !error && <LevelSelector onSelectLevel={selectLevel} />}
            {token && maskedWord && (
                <BoardGame
                    initialToken={token}
                    initialAttempts={attempts}
                    initialMaskedWord={maskedWord}
                    level={level}
                    onPlayAgain={resetGame}
                />
            )}
        </>
    );
};

export default Hangman;
