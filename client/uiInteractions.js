// UI interactions module

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save user preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    
    // Update the canvas to invert colors in dark mode
    if (typeof setDarkMode === 'function') {
        setDarkMode(isDarkMode);
    }
}

// Check user preference on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    const checkbox = document.getElementById('checkbox');
    
    // If user previously enabled dark mode
    if (savedTheme === 'enabled') {
        document.body.classList.add('dark-mode');
        checkbox.checked = true;
        
        // Apply dark mode to canvas
        if (typeof setDarkMode === 'function') {
            setDarkMode(true);
        }
    }
    
    // Ensure colors button starts toggled since colors are on by default
    const colorsButton = document.getElementById('colors');
    if (!colorsButton.classList.contains('toggled')) {
        colorsButton.classList.add('toggled');
    }
    
    // Initialize flip button as toggled (flip is on by default)
    const flipButton = document.getElementById('flip');
    if (flip && !flipButton.classList.contains('toggled')) {
        flipButton.classList.add('toggled');
    }
    
    // Initialize landscape button as toggled (landscape is on by default)
    const landscapeButton = document.getElementById('rotate');
    if (!portrait && !landscapeButton.classList.contains('toggled')) {
        landscapeButton.classList.add('toggled');
    }
    
    // Force initial canvas resize with correct orientation
    resizeVisibleCanvas();
});

// Event listeners for dark mode toggle
document.getElementById('checkbox').addEventListener('change', toggleDarkMode);

// Rotate button functionality - toggle orientation only
document.getElementById('rotate').addEventListener('click', function () {
    portrait = !portrait;
    this.classList.toggle('toggled');
    
    // Notify the event worker about orientation change
    eventWorker.postMessage({ type: 'portrait', portrait: portrait });
    resizeVisibleCanvas();
    
    // Force refresh of texture rotation with new orientation
    if (typeof refreshRotation === 'function') {
        refreshRotation();
    }
    
    // Show confirmation message
    showMessage(`Portrait ${portrait ? 'ON' : 'OFF'}`, 2000);
});

// Flip button functionality - toggle 180° rotation independently
document.getElementById('flip').addEventListener('click', function () {
    flip = !flip;
    this.classList.toggle('toggled');
    resizeVisibleCanvas();
    
    // Show confirmation message
    showMessage(`Flip ${flip ? 'ON' : 'OFF'}`, 2000);
});

// Colors button functionality
document.getElementById('colors').addEventListener('click', function () {
    withColor = !withColor;
    this.classList.toggle('toggled');
    streamWorker.postMessage({ type: 'withColorChanged', withColor: withColor });
    
    // Show confirmation message
    showMessage(`${withColor ? 'Color' : 'Grayscale'} mode enabled`, 2000);
});

// Sidebar hover effect
const sidebar = document.querySelector('.sidebar');
sidebar.addEventListener('mouseover', function () {
    sidebar.classList.add('active');
});
sidebar.addEventListener('mouseout', function () {
    sidebar.classList.remove('active');
});

// Resize the canvas whenever the window is resized
window.addEventListener("resize", resizeVisibleCanvas);

// Mask drawing button functionality
document.getElementById('switchOrderButton').addEventListener('click', function () {
    // Swap z-index values
    const isLayerSwitched = iFrame.style.zIndex != 1;
    
    if (isLayerSwitched) {
        iFrame.style.zIndex = 1;
        this.classList.remove('toggled');
        showMessage('Drawing layer on top', 2000);
    } else {
        iFrame.style.zIndex = 4;
        this.classList.add('toggled');
        showMessage('Content layer on top', 2000);
    }
});
