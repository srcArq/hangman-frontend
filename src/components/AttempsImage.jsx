const IMAGES_BY_LEVEL = {
    1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    2: [0, 1, 2, 4, 5, 6, 8, 10],
    3: [0, 1, 2, 4, 5, 10],
};

const AttempsImage = ({ attempts, initialAttempts, level }) => {
    const images = IMAGES_BY_LEVEL[level] || IMAGES_BY_LEVEL[1];

    // Los fallos se derivan directamente de los intentos: no hace falta estado
    // ni efectos. (initialAttempts ?? attempts) protege si no se pasa el inicial.
    const failCount = Math.max(0, (initialAttempts ?? attempts) - attempts);
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
