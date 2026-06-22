import { useEffect, useRef, useState } from "react";
import KeyBoard from "./KeyBoard";
import Modal from "./Modal";
import AttempsImage from "./AttempsImage";

const STORAGE_KEY = "hangman:game";

const BoardGame = ({
    initialToken,
    initialAttempts,
    initialMaskedWord,
    initialGuessedLetters = [],
    level,
    onPlayAgain,
    onResult,
}) => {
    const [token, setToken] = useState(initialToken);
    const [maskedWord, setMaskedWord] = useState(initialMaskedWord);
    const [attempts, setAttempts] = useState(initialAttempts);
    const [status, setStatus] = useState("IN_PROGRESS");
    const [resultWord, setResultWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState(initialGuessedLetters);
    const [checking, setChecking] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [shake, setShake] = useState(false);

    const checkingRef = useRef(false); // guard sincrónico anti-carreras de token
    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    const isWinner = status === "WON";
    const isGameOver = status === "LOST";
    const finished = isWinner || isGameOver;

    // Persistir la partida para poder reanudarla al recargar; limpiarla al acabar.
    useEffect(() => {
        try {
            if (finished) {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ token, attempts, maskedWord, guessedLetters, level })
                );
            }
        } catch {
            /* localStorage no disponible: ignorar */
        }
    }, [token, attempts, maskedWord, guessedLetters, level, finished]);

    async function checkLetter(letter) {
        if (checkingRef.current) return false; // ya hay una jugada en curso
        checkingRef.current = true;
        const prevAttempts = attempts;
        try {
            setChecking(true);
            setNetworkError(false);
            const response = await fetch(`${PUBLIC_API_URL}/api/checkLetter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, letter }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setToken(data.token);
            setAttempts(data.attempts);
            setMaskedWord(data.maskedWord);
            setStatus(data.status);
            setResultWord(data.resultWord ?? "");
            setGuessedLetters(data.guessedLetters ?? []);

            if (data.attempts < prevAttempts) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
            if (data.status === "WON" || data.status === "LOST") {
                onResult?.(data.status, data.token);
            }
            return true;
        } catch (error) {
            // No penalizar al jugador: avisar y dejar reintentar la misma letra.
            setNetworkError(true);
            return false;
        } finally {
            setChecking(false);
            checkingRef.current = false;
        }
    }

    return (
        <div className="board-game">
            <div className="game-info">
                <div className="column col-left">
                    <div className={`attempts-image-wrap ${shake ? 'shake' : ''}`}>
                        <AttempsImage attempts={attempts} level={level} />
                    </div>
                    <p className="attempts">Intentos: {attempts}</p>
                </div>
                <div className="column col-right">
                    <p className="masked-word">
                        {maskedWord.map((ch, i) => (
                            <span key={`${i}-${ch}`} className={ch === '_' ? 'mw-blank' : 'mw-letter'}>
                                {ch}
                            </span>
                        ))}
                    </p>
                    {maskedWord && (
                        <KeyBoard
                            handleCheckLetter={checkLetter}
                            disabled={checking || finished}
                            usedLetters={guessedLetters}
                            maskedWord={maskedWord}
                        />
                    )}
                    {networkError && (
                        <p className="fontBody network-error" role="alert">
                            Error de red. Pulsa la letra de nuevo.
                        </p>
                    )}
                </div>
            </div>
            {finished && (
                <Modal
                    open={finished}
                    variant={isWinner ? 'win' : 'lose'}
                    title={isWinner ? "¡Ganaste!" : "Juego Terminado"}
                    message={isWinner ? "¡Felicidades! Has adivinado la palabra." : `Lo siento, has agotado tus intentos. La palabra era '${resultWord}'.`}
                    image={isWinner ? "/assets/images/hangman-winner.png" : "/assets/images/hangman-loser.png"}
                    actionLabel="Jugar de nuevo"
                    onAction={onPlayAgain}
                />
            )}
        </div>
    );
};

export default BoardGame;
