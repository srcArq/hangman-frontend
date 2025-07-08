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
    // Import the public API URL from environment variables
    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;



    async function checkLetter(letter) {
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

        console.log('Selected level:', data);
    }
    console.log({ isGameOver, isWinner, open: isGameOver || isWinner });

    return (
        <div className="board-game">
            <div className="game-info">
                <div className="column col-left">

                    <AttempsImage attemptsOriginal={{ attempts }} level={levelOriginal.level} />
                    <p className="attempts">Intentos: {attempts}</p>
                </div>
                <div className="column col-right">
                    <p className="masked-word">{maskedWord}</p>
                    <>{maskedWord && <KeyBoard handleCheckLetter={checkLetter} />}
                    </>
                </div>
            </div>
            {(isGameOver || isWinner) &&<Modal
                open={isGameOver || isWinner}
                title={isWinner ? "¡Ganaste!" : "Juego Terminado"}
                message={isWinner ? "¡Felicidades! Has adivinado la palabra." : `Lo siento, has agotado tus intentos. La palabra era '${resultWord}'.`}
                image={isWinner ? "/assets/images/hangman-winner.png" : "/assets/images/hangman-loser.png"}
                actionLabel="Jugar de nuevo"
                onAction={() => window.location.reload()}
            />
}


        </div>

    );
}
export default BoardGame;

