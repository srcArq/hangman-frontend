import { useState, useEffect } from 'react';

/**
 * KeyBoard Component
 * Renders an on-screen keyboard (A-Z) and listens for physical key presses.
 * Calls handleCheckLetter(letter) when a letter is selected.
 */
const KeyBoard = ({ handleCheckLetter }) => {
  // Track which letters have been used to disable them
  const [usedLetters, setUsedLetters] = useState(new Set());

  // Handler for letter selection (click or keydown)
  const handleLetter = (letter) => {
    const upper = letter.toUpperCase();
    if (!usedLetters.has(upper) && /^[A-ZÑ]$/.test(upper)) {
      setUsedLetters((prev) => new Set(prev).add(upper));
      handleCheckLetter(upper);
    }
  };

  // Listen for physical keyboard events
  useEffect(() => {
    const listener = (e) => {
      const key = e.key.toUpperCase();
      handleLetter(key);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [usedLetters]);

  // Create letters A-Z
const letters = [
  ...Array.from({ length: 14 }, (_, i) => String.fromCharCode(65 + i)), // A-N
  'Ñ',
  ...Array.from({ length: 12 }, (_, i) => String.fromCharCode(79 + i)), // O-Z
];
  return (
    <div className="keyboard grid grid-cols-7 gap-2 p-4">
      {letters.map((letter) => (
        <button
          key={letter}
          className={`gameButton key px-3 py-2 rounded-lg shadow ${usedLetters.has(letter) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          onClick={() => handleLetter(letter)}
          disabled={usedLetters.has(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default KeyBoard;
