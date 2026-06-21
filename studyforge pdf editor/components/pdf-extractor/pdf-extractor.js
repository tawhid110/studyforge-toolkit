(function() {
    const pdfInput = document.getElementById('pdf-input');
    const pagesInput = document.getElementById('pages-input');
    const extractBtn = document.getElementById('extract-btn');
    const statusMessage = document.getElementById('status-message');

    // Helper function to turn "1-3, 5" into an array: [0, 1, 2, 4]
    function parsePageNumbers(inputString, maxPages) {
        const pages = new Set();
        const parts = inputString.replace(/\s+/g, '').split(',');

        for (let part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                
                if (start > 0 && end >= start && start <= maxPages) {
                    const actualEnd = Math.min(end, maxPages);
                    for (let i = start; i <= actualEnd; i++) {
                        pages.add(i - 1); // PDF-lib is zero-indexed
                    }
                }
            } else {
                const pageNum = parseInt(part, 10);
                if (pageNum > 0 && pageNum <= maxPages) {
                    pages.add(pageNum - 1);
                }
            }
        }
        // Return sorted array
        return Array.from(pages).sort((a, b) => a - b);
    }

    extractBtn.addEventListener('click', async () => {
        const file = pdfInput.files[0];
        const pageString = pagesInput.value.trim();

        if (!file) {
            statusMessage.textContent = 'Please select a PDF file first, like "HistorySyllabus.pdf".';
            return;
        }

        if (!pageString) {
            statusMessage.textContent = 'Please enter the pages you want to extract (e.g., 1-5).';
            return;
        }

        statusMessage.textContent = 'Extracting pages...';
        extractBtn.disabled = true;

        try {
            const { PDFDocument } = PDFLib;
            
            // Load the original PDF
            const arrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(arrayBuffer);
            const totalPages = originalPdf.getPageCount();

            // Figure out exactly which pages the user wants
            const pagesToExtract = parsePageNumbers(pageString, totalPages);

            if (pagesToExtract.length === 0) {
                statusMessage.textContent = 'No valid pages selected. Check your page numbers!';
                extractBtn.disabled = false;
                return;
            }

            // Create a brand new blank PDF
            const newPdf = await PDFDocument.create();

            // Copy the requested pages over
            const copiedPages = await newPdf.copyPages(originalPdf, pagesToExtract);
            copiedPages.forEach((page) => newPdf.addPage(page));

            // Save and download the new PDF
            const pdfBytes = await newPdf.save();
            downloadFile(pdfBytes, `StudyForge_Extracted_${file.name}`);

            statusMessage.textContent = `Success! Extracted ${pagesToExtract.length} pages.`;
            
        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'An error occurred while extracting the PDF.';
        } finally {
            extractBtn.disabled = false;
        }
    });

    function downloadFile(uint8Array, filename) {
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();