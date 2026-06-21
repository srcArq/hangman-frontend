const IMAGES_BY_LEVEL = {
    1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    2: [0, 1, 2, 4, 5, 6, 8, 10],
    3: [0, 1, 2, 4, 5, 10],
};

const AttempsImage = ({ attempts, level }) => {
    const images = IMAGES_BY_LEVEL[level] || IMAGES_BY_LEVEL[1];

    // Los intentos iniciales del nivel = nº de imágenes - 1, así que los fallos
    // se derivan directamente de los intentos restantes. Funciona también al
    // reanudar una partida (no depende de un valor inicial externo).
    const maxFails = images.length - 1;
    const failCount = Math.max(0, Math.min(maxFails, maxFails - attempts));
    const imageIndex = images[failCount] ?? images[images.length - 1];

    return (
        <img
            className="attempts-image"
            src={`/assets/images/hangman-${imageIndex}.png`}
            alt={`Estado del ahorcado: ${failCount} fallos de ${maxFails}`}
        />
    );
};

export default AttempsImage;
export { IMAGES_BY_LEVEL };
