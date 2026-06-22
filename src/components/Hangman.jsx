import { useEffect, useState } from "react";
import BoardGame from "./BoardGame";
import LevelSelector from "./LevelSelector";
import LanguageSelector from "./LanguageSelector";
import Ranking from "./Ranking";
import Loader from "./Loader";
import Scoreboard from "./Scoreboard";

const GAME_KEY = "hangman:game";
const STATS_KEY = "hangman:stats";
const NAME_KEY = "hangman:name";
const LANG_KEY = "hangman:lang";
const EMPTY_STATS = { wins: 0, losses: 0, streak: 0 };

function loadStats() {
    try {
        const raw = localStorage.getItem(STATS_KEY);
        if (raw) return { ...EMPTY_STATS, ...JSON.parse(raw) };
    } catch {
        /* ignorar */
    }
    return EMPTY_STATS;
}

const Hangman = () => {
    const [token, setToken] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [maskedWord, setMaskedWord] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [level, setLevel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(EMPTY_STATS);
    const [name, setName] = useState("");
    const [language, setLanguage] = useState("ES");
    const [view, setView] = useState("home"); // home | ranking

    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    // Solo en cliente: cargar nombre/idioma/marcador y reanudar partida guardada.
    useEffect(() => {
        setStats(loadStats());
        try {
            const savedName = localStorage.getItem(NAME_KEY);
            setName(savedName || `Jugador${Math.floor(1000 + Math.random() * 9000)}`);
            const savedLang = localStorage.getItem(LANG_KEY);
            if (savedLang) setLanguage(savedLang);

            const raw = localStorage.getItem(GAME_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved && saved.token && saved.maskedWord) {
                    setToken(saved.token);
                    setAttempts(saved.attempts);
                    setMaskedWord(saved.maskedWord);
                    setGuessedLetters(saved.guessedLetters ?? []);
                    setLevel(saved.level);
                }
            }
        } catch {
            /* ignorar */
        }
    }, []);

    function updateName(value) {
        setName(value);
        try {
            localStorage.setItem(NAME_KEY, value);
        } catch {
            /* ignorar */
        }
    }

    function updateLanguage(code) {
        setLanguage(code);
        try {
            localStorage.setItem(LANG_KEY, code);
        } catch {
            /* ignorar */
        }
    }

    async function selectLevel(selectedLevel) {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${PUBLIC_API_URL}/api/selectLevel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ level: selectedLevel, language }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setToken(data.token);
            setAttempts(data.attempts);
            setMaskedWord(data.maskedWord);
            setGuessedLetters([]);
            setLevel(selectedLevel);
        } catch (error) {
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    function resetGame() {
        try {
            localStorage.removeItem(GAME_KEY);
        } catch {
            /* ignorar */
        }
        setToken(null);
        setAttempts(null);
        setMaskedWord(null);
        setGuessedLetters([]);
        setLevel(null);
        setError(null);
    }

    function handleResult(status, token) {
        setStats((prev) => {
            const next = status === "WON"
                ? { wins: prev.wins + 1, losses: prev.losses, streak: prev.streak + 1 }
                : { wins: prev.wins, losses: prev.losses + 1, streak: 0 };
            try {
                localStorage.setItem(STATS_KEY, JSON.stringify(next));
            } catch {
                /* ignorar */
            }
            return next;
        });

        // Registrar la victoria en el ranking global (fire-and-forget). Se envía
        // el token ganador para que el servidor verifique que la partida es real.
        if (status === "WON" && name.trim() && token) {
            fetch(`${PUBLIC_API_URL}/api/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), token }),
            }).catch(() => { /* si falla, el ranking simplemente no se actualiza */ });
        }
    }

    const inGame = token && maskedWord;

    return (
        <>
            <h1 className={`title ${inGame ? 'second-step' : ''}`}>AHORCADO</h1>
            {loading && <Loader />}
            {error && (
                <div className="error-message">
                    <p className="fontBody">{error}</p>
                    <button className="gameButton" onClick={() => setError(null)}>Reintentar</button>
                </div>
            )}

            {!inGame && !error && view === "ranking" && (
                <Ranking apiUrl={PUBLIC_API_URL} onBack={() => setView("home")} />
            )}

            {!inGame && !error && view === "home" && (
                <div className="home">
                    <label className="name-field">
                        <span>Tu nombre</span>
                        <input
                            className="name-input"
                            type="text"
                            maxLength={20}
                            value={name}
                            onChange={(e) => updateName(e.target.value)}
                            aria-label="Tu nombre"
                        />
                    </label>
                    <LanguageSelector language={language} onChange={updateLanguage} />
                    <LevelSelector onSelectLevel={selectLevel} />
                    <button className="gameButton ranking-link" onClick={() => setView("ranking")}>
                        Ver ranking
                    </button>
                    <Scoreboard stats={stats} />
                </div>
            )}

            {inGame && (
                <BoardGame
                    initialToken={token}
                    initialAttempts={attempts}
                    initialMaskedWord={maskedWord}
                    initialGuessedLetters={guessedLetters}
                    level={level}
                    onPlayAgain={resetGame}
                    onResult={handleResult}
                />
            )}
        </>
    );
};

export default Hangman;
