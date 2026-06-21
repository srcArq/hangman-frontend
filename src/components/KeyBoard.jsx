import { useEffect, useRef, useState } from 'react';

const LETTERS = [
  ...Array.from({ length: 14 }, (_, i) => String.fromCharCode(65 + i)), // A-N
  'Ñ',
  ...Array.from({ length: 12 }, (_, i) => String.fromCharCode(79 + i)), // O-Z
];

const KeyBoard = ({ handleCheckLetter, disabled = false, usedLetters = [], maskedWord = [] }) => {
  // Letras pulsadas localmente: feedback inmediato antes de la respuesta del servidor.
  const [optimistic, setOptimistic] = useState(() => new Set());

  const serverUsed = new Set(usedLetters);          // confirmadas por el servidor
  const maskedSet = new Set(maskedWord);            // letras ya reveladas
  const used = new Set([...usedLetters, ...optimistic]);

  // Refs para que el listener de teclado lea siempre el estado actual (incluido
  // el token más reciente, que vive dentro de handleCheckLetter) sin re-suscribirse.
  const usedRef = useRef(used);
  const disabledRef = useRef(disabled);
  const handleCheckLetterRef = useRef(handleCheckLetter);
  usedRef.current = used;
  disabledRef.current = disabled;
  handleCheckLetterRef.current = handleCheckLetter;

  const handleLetter = async (rawLetter) => {
    const letter = rawLetter.toUpperCase();
    if (disabledRef.current || usedRef.current.has(letter) || !/^[A-ZÑ]$/.test(letter)) {
      return;
    }
    setOptimistic((prev) => new Set(prev).add(letter));
    const ok = await handleCheckLetterRef.current(letter);
    if (ok === false) {
      // La petición falló (p. ej. red): revertir para poder reintentar la letra.
      setOptimistic((prev) => {
        const next = new Set(prev);
        next.delete(letter);
        return next;
      });
    }
  };

  useEffect(() => {
    const listener = (e) => handleLetter(e.key.toUpperCase());
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []); // se registra una sola vez

  const keyClass = (letter) => {
    if (serverUsed.has(letter)) {
      return maskedSet.has(letter) ? 'key-hit' : 'key-miss';
    }
    return used.has(letter) ? 'cursor-not-allowed' : '';
  };

  return (
    <div className="keyboard" role="group" aria-label="Teclado de letras">
      {LETTERS.map((letter) => (
        <button
          key={letter}
          className={`gameButton key ${keyClass(letter)}`}
          onClick={() => handleLetter(letter)}
          disabled={used.has(letter) || disabled}
          aria-label={`Letra ${letter}`}
          aria-disabled={used.has(letter) || disabled}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default KeyBoard;
