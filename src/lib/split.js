const split = (el, byChar) => {
  const text = el.textContent.trim();
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = text;

  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');

  text.split(/\s+/).forEach((word, i) => {
    if (i > 0) visual.append(' ');
    const wordEl = document.createElement('span');
    wordEl.className = 'word';
    if (byChar) {
      for (const ch of word) {
        const charEl = document.createElement('span');
        charEl.className = 'char';
        charEl.textContent = ch;
        wordEl.append(charEl);
      }
    } else {
      wordEl.textContent = word;
    }
    visual.append(wordEl);
  });

  el.replaceChildren(label, visual);
  return [...visual.querySelectorAll(byChar ? '.char' : '.word')];
};

export const splitChars = (el) => split(el, true);
export const splitWords = (el) => split(el, false);
