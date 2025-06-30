import { useState, useEffect, useRef } from 'react';

const AttempsImage = ({ attemptsOriginal, level }) => {
    const [attempts, setAttempts] = useState(0);
    const imagesLevelEasy = useRef([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const imagesLevelMedium = useRef([0, 1, 2, 4, 5, 6, 8, 10]);
    const imagesLevelHard = useRef([0, 1, 2, 4, 5, 10]);
    const [currentImages, setCurrentImages] = useState([]);
    const prevAttemptsRef = useRef(attemptsOriginal);

    useEffect(() => {
        switch (level) {
            case 1: // Easy
                if (attemptsOriginal.attempts !== prevAttemptsRef.current.attempts) {
                    setAttempts(prev => prev + 1);
                    prevAttemptsRef.current = attemptsOriginal;
                }
                setCurrentImages(imagesLevelEasy.current);
                break;
            case 2: // Medium
                if (attemptsOriginal.attempts !== prevAttemptsRef.current.attempts) {
                    setAttempts(prev => prev + 1);
                    prevAttemptsRef.current = attemptsOriginal;
                }
                setCurrentImages(imagesLevelMedium.current);
                break;
            case 3: // Hard
                if (attemptsOriginal.attempts !== prevAttemptsRef.current.attempts) {
                    setAttempts(prev => prev + 1);
                    prevAttemptsRef.current = attemptsOriginal;
                }
                setCurrentImages(imagesLevelHard.current);
                break;
            default:
                break;
        }

    }, [attemptsOriginal]);

    return (
        <img className="attempts-image" src={`/assets/images/hangman-${currentImages[attempts]}.png`} alt="hangman" />
    );
};
export default AttempsImage;