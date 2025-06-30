import { useState } from "react";
import KeyBoard from "./KeyBoard";
import Modal from "./Modal";
import AttempsImage from "./AttempsImage";

const BoardGame = ({ attemptsOriginal, maskedWordOriginal, levelOriginal }) => {
    const [maskedWord, setMaskedWord] = useState(maskedWordOriginal.maskedWord);
    const [attempts, setAttempts] = useState(attemptsOriginal.attempts);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [resultWord, setResultWord] = useState("");


    async function checkLetter(letter) {
        const response = await fetch('https://hangman-backend-o08j.onrender.com/api/checkLetter', {
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

        console.log('Selected level:', data);
    }
    return (
        <div className="board-game">
            <h1>Board Game Component</h1>
            <p>This is a placeholder for the board game component.</p>
            <div className="game-info">
                <AttempsImage attemptsOriginal={{ attempts }} level={levelOriginal.level} />
                <p>Attempts: {attempts}</p>
                <p>Masked Word: {maskedWord}</p>
                <>{maskedWord && <KeyBoard handleCheckLetter={checkLetter} />}
                </>
            </div>
            {(isGameOver || isWinner) && <Modal
                title={isWinner ? "¡Ganaste!" : "Juego Terminado"}
                message={isWinner ? "¡Felicidades! Has adivinado la palabra." : `Lo siento, has agotado tus intentos. La palabra era '${resultWord}'.`}
                actionLabel={"Jugar de nuevo"}
                onAction={() => {
                    window.location.reload();
                }}

            />
            }
        </div>
    );
}
export default BoardGame;

