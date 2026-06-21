(function() {
    const synth = window.speechSynthesis;
    
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const rateInput = document.getElementById('rate-input');
    const rateValue = document.getElementById('rate-value');
    
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    let voices = [];

    // Fetch and populate available voices
    function populateVoiceList() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            // e.g., "Google US English (en-US)"
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
    }

    // Browsers load voices asynchronously, so we wait for them
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Update speed display text
    rateInput.addEventListener('input', () => {
        rateValue.textContent = `${rateInput.value}x`;
    });

    // Play/Resume functionality
    playBtn.addEventListener('click', () => {
        if (synth.paused) {
            synth.resume();
            return;
        }

        if (textInput.value.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(textInput.value);
            
            // Apply selected voice
            const selectedVoiceName = voiceSelect.options[voiceSelect.selectedIndex].getAttribute('data-name');
            utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
            
            // Apply speed
            utterance.rate = rateInput.value;
            
            synth.speak(utterance);
        }
    });

    // Pause functionality
    pauseBtn.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
        }
    });

    // Stop functionality
    stopBtn.addEventListener('click', () => {
        synth.cancel();
    });

    // Clean up if the user navigates away to another tool
    window.addEventListener('beforeunload', () => {
        synth.cancel();
    });
})();