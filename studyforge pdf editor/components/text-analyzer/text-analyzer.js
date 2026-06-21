(function() {
    const inputArea = document.getElementById('analyzer-input');
    const langSelect = document.getElementById('lang-select');
    const wordCountDisplay = document.getElementById('word-count');
    const charCountDisplay = document.getElementById('char-count');
    const readTimeDisplay = document.getElementById('read-time');

    // Instantly change the spellcheck dictionary when the dropdown changes
    langSelect.addEventListener('change', (e) => {
        inputArea.setAttribute('lang', e.target.value);
    });

    // Calculate stats on every keystroke or paste event
    inputArea.addEventListener('input', () => {
        const text = inputArea.value;
        
        // Character Count
        const charCount = text.length;
        charCountDisplay.textContent = charCount;

        // Word Count (splits by spaces/newlines and filters out empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountDisplay.textContent = wordCount;

        // Reading Time (Average adult reading speed is ~200 words per minute)
        if (wordCount === 0) {
            readTimeDisplay.textContent = '0 min';
        } else {
            const timeInMinutes = Math.ceil(wordCount / 200);
            readTimeDisplay.textContent = `${timeInMinutes} min`;
        }
    });
})();