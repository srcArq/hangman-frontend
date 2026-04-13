import { useState, useEffect, useRef } from 'react';

const IMAGES_BY_LEVEL = {
    1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    2: [0, 1, 2, 4, 5, 6, 8, 10],
    3: [0, 1, 2, 4, 5, 10],
};

const AttempsImage = ({ attempts, level }) => {
    const [failCount, setFailCount] = useState(0);
    const prevAttemptsRef = useRef(attempts);
    const images = IMAGES_BY_LEVEL[level] || IMAGES_BY_LEVEL[1];

    useEffect(() => {
        if (attempts !== prevAttemptsRef.current) {
            setFailCount(prev => prev + 1);
            prevAttemptsRef.current = attempts;
        }
    }, [attempts]);

    const imageIndex = images[failCount] ?? images[images.length - 1];

    return (
        <img
            className="attempts-image"
            src={`/assets/images/hangman-${imageIndex}.png`}
            alt={`Estado del ahorcado: ${failCount} fallos de ${images.length - 1}`}
        />
    );
};

export default AttempsImage;
export { IMAGES_BY_LEVEL };