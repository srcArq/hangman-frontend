import BoardGame from "./BoardGame";
import LevelSelector from "./LevelSelector";
import { useState } from "react";



const Hangman = () => {
    const [word, setWord] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [maskedWord, setMaskedWord] = useState(null);
    const [level, setLevel] = useState(null);
    // Import the public API URL from environment variables
    const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

    async function selectLevel(level) {
        const response = await fetch(`${PUBLIC_API_URL}/api/selectLevel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ level }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setWord(data.selectedWord);
        setAttempts(data.attempts);
        setMaskedWord(data.maskedWord);
        setLevel(level);

        console.log('Selected level:', data);
    }
    return (
        <>
            {word === null && <LevelSelector onSelectLevel={selectLevel} />}
            {attempts && maskedWord && <BoardGame attemptsOriginal={{ attempts }} maskedWordOriginal={{ maskedWord }} levelOriginal={{ level }} />}
            
            <p>{word}</p>
        </>
    );
};

export default Hangman;