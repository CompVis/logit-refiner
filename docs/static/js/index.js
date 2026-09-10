'use strict';
const copyButton = document.getElementById('copy-bibtex');
const citation = document.getElementById('bibtex-code');
const status = document.getElementById('copy-status');
if (copyButton && citation && status) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      status.textContent = 'BibTeX copied to clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy, or use Download BibTeX below.';
    }
  });
}

const papersContainer = document.querySelector('.more-works-container');
const papersToggle = document.getElementById('other-papers-toggle');
const papersDropdown = document.getElementById('moreWorksDropdown');
const papersClose = document.getElementById('other-papers-close');
if (papersContainer && papersToggle && papersDropdown && papersClose) {
  const setPapersOpen = (open, restoreFocus = false) => {
    papersToggle.setAttribute('aria-expanded', String(open));
    papersToggle.classList.toggle('active', open);
    papersDropdown.hidden = !open;
    papersDropdown.setAttribute('aria-hidden', String(!open));
    papersDropdown.classList.toggle('show', open);
    if (restoreFocus) papersToggle.focus();
  };
  papersToggle.hidden = false;
  papersToggle.addEventListener('click', () => {
    setPapersOpen(papersToggle.getAttribute('aria-expanded') !== 'true');
  });
  papersClose.addEventListener('click', () => setPapersOpen(false, true));
  document.addEventListener('click', (event) => {
    if (!papersContainer.contains(event.target)) setPapersOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !papersDropdown.hidden) {
      setPapersOpen(false, true);
    }
  });
  papersContainer.addEventListener('focusout', (event) => {
    if (!papersContainer.contains(event.relatedTarget)) setPapersOpen(false);
  });
}
