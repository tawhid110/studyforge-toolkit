(function() {
    const exportBtn = document.getElementById('export-btn');
    const inputArea = document.getElementById('flashcard-input');
    const statusMessage = document.getElementById('status-message');

    exportBtn.addEventListener('click', () => {
        const text = inputArea.value.trim();
        
        if (!text) {
            statusMessage.textContent = 'Please paste some notes first, like "Photosynthesis - Plants making food".';
            return;
        }

        // Split the large text block into individual lines
        const lines = text.split('\n');
        let csvContent = "";
        let cardCount = 0;

        lines.forEach(line => {
            // Check if the line uses a dash or a colon to separate term and definition
            let separator = line.includes('-') ? '-' : (line.includes(':') ? ':' : null);
            
            if (separator) {
                // Split the line into exactly two parts
                let parts = line.split(separator);
                
                // Clean up spacing and escape any rogue quotation marks for safe CSV formatting
                let front = parts[0].trim().replace(/"/g, '""');
                
                // Re-join the rest just in case the definition has dashes in it too
                let back = parts.slice(1).join(separator).trim().replace(/"/g, '""'); 
                
                // Construct the CSV row
                csvContent += `"${front}","${back}"\n`;
                cardCount++;
            }
        });

        if (cardCount === 0) {
            statusMessage.textContent = 'Could not find any flashcards. Make sure you use a dash (-) or colon (:) between terms and definitions.';
            return;
        }

        // Create the CSV file locally and force a download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'StudyForge_Anki_Deck.csv';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        statusMessage.textContent = `Success! Generated ${cardCount} cards and downloaded StudyForge_Anki_Deck.csv.`;
    });
})();