import { useEffect, useRef, useState } from "react";
import KeyBoard from "./KeyBoard";
import Modal from "./Modal";
import AttempsImage from "./AttempsImage";
import Hourglass from "./Hourglass";

const STORAGE_KEY = "hangman:game";

// Nivel Extremo (contra reloj). Valores ajustados por simulación.
const EXTREME_LEVEL = 4;
const EXTREME_INITIAL = 30; // segundos iniciales
const EXTREME_BONUS = 4;    // acierto: +4 s
const EXTREME_PENALTY = 6;  // fallo: -6 s
const EXTREME_URGENT = 8;   // ≤8 s -> nervios (rojo + temblor)

const BoardGame = ({
    initialToken,
    initialAttempts,
    initialMaskedWord,
    initialGuessedLetters = [],
    level,
    onPlayAgain,
    onResult,
}) => {
    const isExtreme = level === EXTREME_LEVEL;

    const [token, setToken] = useState(initialToken);
    const [maskedWord, setMaskedWord] = useState(initialMaskedWord);
    const [attempts, setAttempts] = useState(initialAttempts);
    const [status, setStatus] = useState("IN_PROGRESS");
    const [resultWord, setResultWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState(initialGuessedLetters);
    const [checking, setChecking] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [shake, setShake] = useState(false);
    const [timeLeft, setTimeLeft] = useState(isExtreme ? EXTREME_INITIAL : 0);
    const [timedOut, setTimedOut] = useState(false);

    const checkingRef = useRef(false); // guard sincrónico anti-carreras de token
    const endedRef = useRef(false);    // garantiza un único onResult por partida
    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    const isWinner = status === "WON";
    const isGameOver = status === "LOST" || timedOut;
    const finished = isWinner || isGameOver;

    function fireResult(resultStatus, resultToken) {
        if (endedRef.current) return;
        endedRef.current = true;
        onResult?.(resultStatus, resultToken);
    }

    // Persistencia para reanudar (no aplica al modo a tiempo).
    useEffect(() => {
        try {
            if (finished || isExtreme) {
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
    }, [token, attempts, maskedWord, guessedLetters, level, finished, isExtreme]);

    // Cuenta atrás del modo Extremo.
    useEffect(() => {
        if (!isExtreme || finished) return;
        const id = setInterval(() => {
            setTimeLeft((t) => {
                const next = Math.round((t - 0.1) * 10) / 10;
                return next <= 0 ? 0 : next;
            });
        }, 100);
        return () => clearInterval(id);
    }, [isExtreme, finished]);

    // Fin por tiempo agotado.
    useEffect(() => {
        if (isExtreme && !finished && timeLeft <= 0) {
            setTimedOut(true);
            fireResult("LOST", null);
        }
    }, [isExtreme, finished, timeLeft]);

    async function checkLetter(letter) {
        if (checkingRef.current || finished) return false;
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

            const wasWrong = data.attempts < prevAttempts;

            setToken(data.token);
            setAttempts(data.attempts);
            setMaskedWord(data.maskedWord);
            setStatus(data.status);
            setResultWord(data.resultWord ?? "");
            setGuessedLetters(data.guessedLetters ?? []);

            if (wasWrong) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }

            // Modo Extremo: ajustar tiempo (salvo si ya ha ganado).
            if (isExtreme && data.status !== "WON") {
                setTimeLeft((t) => Math.max(0, t + (wasWrong ? -EXTREME_PENALTY : EXTREME_BONUS)));
            }

            if (data.status === "WON" || data.status === "LOST") {
                fireResult(data.status, data.token);
            }
            return true;
        } catch (error) {
            setNetworkError(true);
            return false;
        } finally {
            setChecking(false);
            checkingRef.current = false;
        }
    }

    const urgent = isExtreme && timeLeft <= EXTREME_URGENT;
    const lossMessage = timedOut
        ? "¡Se acabó el tiempo! Sé más rápido la próxima vez."
        : `Lo siento, has agotado tus intentos. La palabra era '${resultWord}'.`;

    return (
        <div className="board-game">
            <div className="game-info">
                <div className="column col-left">
                    {isExtreme ? (
                        <>
                            <div className={`hourglass-wrap ${shake ? 'shake' : ''}`}>
                                <Hourglass ratio={timeLeft / EXTREME_INITIAL} urgent={urgent} />
                            </div>
                            <p className={`extreme-timer ${urgent ? 'urgent' : ''}`}>
                                {Math.ceil(timeLeft)}s
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`attempts-image-wrap ${shake ? 'shake' : ''}`}>
                                <AttempsImage attempts={attempts} level={level} />
                            </div>
                            <p className="attempts">Intentos: {attempts}</p>
                        </>
                    )}
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
                    message={isWinner ? "¡Felicidades! Has adivinado la palabra." : lossMessage}
                    image={isWinner ? "/assets/images/hangman-winner.png" : "/assets/images/hangman-loser.png"}
                    actionLabel="Jugar de nuevo"
                    onAction={onPlayAgain}
                />
            )}
        </div>
    );
};

export default BoardGame;
