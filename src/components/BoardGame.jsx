import { useState } from "react";
import KeyBoard from "./KeyBoard";
import Modal from "./Modal";
import AttempsImage from "./AttempsImage";

const BoardGame = ({ attempts: initialAttempts, maskedWord: initialMaskedWord, level, onPlayAgain }) => {
    const [maskedWord, setMaskedWord] = useState(initialMaskedWord);
    const [attempts, setAttempts] = useState(initialAttempts);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [resultWord, setResultWord] = useState("");
    const [checking, setChecking] = useState(false);

    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    async function checkLetter(letter) {
        try {
            setChecking(true);
            const response = await fetch(`${PUBLIC_API_URL}/api/checkLetter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ letter }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setAttempts(data.attempts);
            setMaskedWord(data.maskedWord);
            setIsGameOver(data.isGameOver);
            setIsWinner(data.isWinner);
            setResultWord(data.resultWord);
        } catch (error) {
            // Si falla la petición, no penalizar al jugador
        } finally {
            setChecking(false);
        }
    }

    return (
        <div className="board-game">
            <div className="game-info">
                <div className="column col-left">
                    <AttempsImage attempts={attempts} level={level} />
                    <p className="attempts">Intentos: {attempts}</p>
                </div>
                <div className="column col-right">
                    <p className="masked-word">{maskedWord}</p>
                    {maskedWord && <KeyBoard handleCheckLetter={checkLetter} disabled={checking} />}
                </div>
            </div>
            {(isGameOver || isWinner) && (
                <Modal
                    open={isGameOver || isWinner}
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

