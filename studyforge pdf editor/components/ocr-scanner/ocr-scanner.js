(function() {
    const imageInput = document.getElementById('image-input');
    const scanBtn = document.getElementById('scan-btn');
    const imagePreview = document.getElementById('image-preview');
    const statusMessage = document.getElementById('status-message');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const resultText = document.getElementById('result-text');

    let selectedFile = null;

    // Show a preview of the image when selected
    imageInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            imagePreview.src = url;
            imagePreview.classList.remove('hidden');
            resultText.classList.add('hidden');
            statusMessage.textContent = 'Image loaded. Ready to scan.';
        }
    });

    scanBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            statusMessage.textContent = 'Please select an image file first (like a photo of your Economics notes).';
            return;
        }

        // Lock the UI and show the progress bar
        scanBtn.disabled = true;
        statusMessage.textContent = 'Downloading Tesseract language data... this can take 1-2 minutes on the first run!';
        progressBarContainer.classList.remove('hidden');
        resultText.classList.add('hidden');
        progressBar.style.width = '0%';

        try {
            // FIX: Pass the raw selectedFile directly to Tesseract
            const result = await Tesseract.recognize(
                selectedFile,
                'eng',
                {
                    logger: m => {
                        // This will show us EXACTLY what it is doing (downloading, initializing, etc.)
                        if (m.status === 'recognizing text') {
                            const percent = Math.round(m.progress * 100);
                            progressBar.style.width = `${percent}%`;
                            statusMessage.textContent = `Scanning... ${percent}%`;
                        } else {
                            statusMessage.textContent = `System Status: ${m.status}...`;
                        }
                    }
                }
            );

            // Unlock the UI and display the text
            statusMessage.textContent = 'Scan complete!';
            resultText.value = result.data.text;
            resultText.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            // Print the exact error to the screen so we can see it
            statusMessage.textContent = `Error: ${error.message}`;
        } finally {
            scanBtn.disabled = false;
            progressBarContainer.classList.add('hidden');
        }
    });
})();