async function loadComponent(componentName) {
    const mainContainer = document.getElementById('app-content');
    
    try {
        const response = await fetch(`components/${componentName}/${componentName}.html`);
        
        if (!response.ok) {
            throw new Error('Component not found');
        }
        
        const html = await response.text();
        mainContainer.innerHTML = html;

        // Extract and run scripts inside the loaded component
        const scripts = mainContainer.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // Copy all attributes (like src)
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            // Copy inline code if it exists
            if (oldScript.innerHTML) {
                newScript.innerHTML = oldScript.innerHTML;
            }
            // Replace the old non-working script with the new working one
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        
    } catch (error) {
        mainContainer.innerHTML = `<h2>Error 404</h2><p>The ${componentName} module is not built yet.</p>`;
    }
}
// --- THEME ENGINE LOGIC ---
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    
    // Toggle the class on the body
    body.classList.toggle('light-mode');
    
    // Check if light mode is active to update the button text and save to localStorage
    if (body.classList.contains('light-mode')) {
        themeBtn.textContent = '🌙 Dark Mode';
        localStorage.setItem('studyforge-theme', 'light');
    } else {
        themeBtn.textContent = '☀️ Light Mode';
        localStorage.setItem('studyforge-theme', 'dark');
    }
}

// Automatically check for a saved theme when the app first loads
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('studyforge-theme');
    const themeBtn = document.getElementById('theme-btn');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if(themeBtn) themeBtn.textContent = '🌙 Dark Mode';
    }
});