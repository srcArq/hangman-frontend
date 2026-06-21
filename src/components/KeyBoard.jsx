import { useEffect, useRef, useState } from 'react';

const LETTERS = [
  ...Array.from({ length: 14 }, (_, i) => String.fromCharCode(65 + i)), // A-N
  'Ñ',
  ...Array.from({ length: 12 }, (_, i) => String.fromCharCode(79 + i)), // O-Z
];

const KeyBoard = ({ handleCheckLetter, disabled = false, usedLetters = [] }) => {
  // Letras pulsadas localmente: feedback inmediato antes de la respuesta del servidor.
  const [optimistic, setOptimistic] = useState(() => new Set());

  // Conjunto efectivo = confirmadas por el servidor (fuente de verdad) + optimistas.
  const used = new Set([...usedLetters, ...optimistic]);

  // Refs para que el listener de teclado lea siempre el estado actual sin
  // necesidad de re-suscribirse en cada render (incluido el token más reciente,
  // que vive dentro de handleCheckLetter).
  const usedRef = useRef(used);
  const disabledRef = useRef(disabled);
  const handleCheckLetterRef = useRef(handleCheckLetter);
  usedRef.current = used;
  disabledRef.current = disabled;
  handleCheckLetterRef.current = handleCheckLetter;

  const handleLetter = (rawLetter) => {
    const letter = rawLetter.toUpperCase();
    if (!disabledRef.current && !usedRef.current.has(letter) && /^[A-ZÑ]$/.test(letter)) {
      setOptimistic((prev) => new Set(prev).add(letter));
      handleCheckLetterRef.current(letter);
    }
  };

  useEffect(() => {
    const listener = (e) => handleLetter(e.key.toUpperCase());
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []); // se registra una sola vez

  return (
    <div className="keyboard" role="group" aria-label="Teclado de letras">
      {LETTERS.map((letter) => (
        <button
          key={letter}
          className={`gameButton key ${used.has(letter) ? 'cursor-not-allowed' : ''}`}
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
