(function() {
    const searchBtn = document.getElementById('search-btn');
    const isbnInput = document.getElementById('isbn-input');
    const resultsContainer = document.getElementById('citation-results');
    const bookTitleDisplay = document.getElementById('book-title');
    const apaCitation = document.getElementById('apa-citation');
    const mlaCitation = document.getElementById('mla-citation');
    const statusMessage = document.getElementById('status-message');

    searchBtn.addEventListener('click', async () => {
        // Clean the input to remove dashes or spaces
        const isbn = isbnInput.value.replace(/[- ]/g, '').trim();
        
        if (!isbn) {
            statusMessage.textContent = 'Please enter an ISBN.';
            return;
        }

        // Reset UI
        statusMessage.textContent = 'Searching Open Library...';
        resultsContainer.classList.add('hidden');

        try {
            // Fetch data from the Open Library API
            const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
            const data = await response.json();
            const bookData = data[`ISBN:${isbn}`];

            if (!bookData) {
                statusMessage.textContent = 'Book not found. Please verify the ISBN.';
                return;
            }

            statusMessage.textContent = ''; // Clear status on success

            // Extract needed information, providing fallbacks if data is missing
            const title = bookData.title || 'Unknown Title';
            const authors = bookData.authors ? bookData.authors.map(a => a.name).join(', ') : 'Unknown Author';
            const publishDate = bookData.publish_date || 'n.d.';
            const publisher = bookData.publishers ? bookData.publishers[0].name : 'Unknown Publisher';

            // Populate the UI
            bookTitleDisplay.textContent = title;
            
            // Generate APA: Author. (Year). Title. Publisher.
            apaCitation.textContent = `${authors}. (${publishDate}). ${title}. ${publisher}.`;
            
            // Generate MLA: Author. Title. Publisher, Year.
            mlaCitation.textContent = `${authors}. "${title}." ${publisher}, ${publishDate}.`;

            // Reveal the results
            resultsContainer.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'An error occurred while fetching the citation.';
        }
    });
})();