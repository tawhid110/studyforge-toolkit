(function() {
    let selectedFiles = [];

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const mergeBtn = document.getElementById('merge-btn');
    const statusMessage = document.getElementById('status-message');

    // UI Logic: Handle clicks and drag-and-drop for the main upload zone
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        for (let file of files) {
            if (file.type === 'application/pdf') {
                selectedFiles.push(file);
            }
        }
        updateFileList();
    }

    // --- NEW DRAG AND DROP REORDERING LOGIC ---
    function updateFileList() {
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${file.name}`;
            
            // Make the HTML element draggable
            li.draggable = true;
            li.dataset.index = index;

            // When user clicks and holds the file
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });

            // When user lets go of the file
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                reorderFilesArray();
            });

            fileList.appendChild(li);
        });
    }

    // Allow the list itself to be a drop zone for reordering
    fileList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(fileList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                fileList.appendChild(draggable);
            } else {
                fileList.insertBefore(draggable, afterElement);
            }
        }
    });

    // Math to figure out exactly which file you are hovering over
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Sync the visual HTML list back to our JavaScript array
    function reorderFilesArray() {
        const currentListItems = document.querySelectorAll('#file-list li');
        const newFilesArray = [];

        currentListItems.forEach((li) => {
            const oldIndex = parseInt(li.dataset.index, 10);
            newFilesArray.push(selectedFiles[oldIndex]);
        });

        selectedFiles = newFilesArray;
        updateFileList(); // Refresh the numbers (1, 2, 3...) to match the new order
    }
    // ------------------------------------------

    // Processing Logic: Merge the PDFs
    mergeBtn.addEventListener('click', async () => {
        if (selectedFiles.length < 2) {
            statusMessage.textContent = 'Please select at least 2 PDFs (like "Biology_Chapter_1.pdf" and "Biology_Chapter_2.pdf").';
            return;
        }

        statusMessage.textContent = 'Merging... please wait.';
        mergeBtn.disabled = true;

        try {
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (let file of selectedFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfFile = await mergedPdf.save();
            downloadFile(mergedPdfFile, 'StudyForge_Merged.pdf');
            
            statusMessage.textContent = 'Success! File downloaded.';
            selectedFiles = [];
            updateFileList();
            
        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'An error occurred during merging.';
        } finally {
            mergeBtn.disabled = false;
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