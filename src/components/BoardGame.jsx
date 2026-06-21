import { useState } from "react";
import KeyBoard from "./KeyBoard";
import Modal from "./Modal";
import AttempsImage from "./AttempsImage";

const BoardGame = ({ initialToken, initialAttempts, initialMaskedWord, level, onPlayAgain }) => {
    const [token, setToken] = useState(initialToken);
    const [maskedWord, setMaskedWord] = useState(initialMaskedWord);
    const [attempts, setAttempts] = useState(initialAttempts);
    const [status, setStatus] = useState("IN_PROGRESS");
    const [resultWord, setResultWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [checking, setChecking] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    const isWinner = status === "WON";
    const isGameOver = status === "LOST";
    const finished = isWinner || isGameOver;

    async function checkLetter(letter) {
        try {
            setChecking(true);
            setNetworkError(false);
            const response = await fetch(`${PUBLIC_API_URL}/api/checkLetter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
        } catch (error) {
            // No penalizar al jugador: avisar y permitir reintentar la misma letra.
            setNetworkError(true);
        } finally {
            setChecking(false);
        }
    }

    return (
        <div className="board-game">
            <div className="game-info">
                <div className="column col-left">
                    <AttempsImage attempts={attempts} initialAttempts={initialAttempts} level={level} />
                    <p className="attempts">Intentos: {attempts}</p>
                </div>
                <div className="column col-right">
                    <p className="masked-word">{maskedWord}</p>
                    {maskedWord && (
                        <KeyBoard
                            handleCheckLetter={checkLetter}
                            disabled={checking || finished}
                            usedLetters={guessedLetters}
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
