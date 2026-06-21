const LANGS = [
  { code: 'CA', label: 'Català' },
  { code: 'ES', label: 'Castellano' },
  { code: 'EN', label: 'English' },
];

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="language-selector" role="group" aria-label="Idioma">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`gameButton lang ${language === l.code ? 'selected' : ''}`}
          onClick={() => onChange(l.code)}
          aria-pressed={language === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
