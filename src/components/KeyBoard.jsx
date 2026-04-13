import { useState, useEffect } from 'react';

const LETTERS = [
  ...Array.from({ length: 14 }, (_, i) => String.fromCharCode(65 + i)), // A-N
  'Ñ',
  ...Array.from({ length: 12 }, (_, i) => String.fromCharCode(79 + i)), // O-Z
];

const KeyBoard = ({ handleCheckLetter, disabled = false }) => {
  const [usedLetters, setUsedLetters] = useState(new Set());

  const handleLetter = (letter) => {
    const upper = letter.toUpperCase();
    if (!disabled && !usedLetters.has(upper) && /^[A-ZÑ]$/.test(upper)) {
      setUsedLetters((prev) => new Set(prev).add(upper));
      handleCheckLetter(upper);
    }
  };

  useEffect(() => {
    const listener = (e) => handleLetter(e.key.toUpperCase());
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [usedLetters, disabled]);

  return (
    <div className="keyboard" role="group" aria-label="Teclado de letras">
      {LETTERS.map((letter) => (
        <button
          key={letter}
          className={`gameButton key ${usedLetters.has(letter) ? 'cursor-not-allowed' : ''}`}
          onClick={() => handleLetter(letter)}
          disabled={usedLetters.has(letter) || disabled}
          aria-label={`Letra ${letter}`}
          aria-disabled={usedLetters.has(letter) || disabled}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default KeyBoard;
