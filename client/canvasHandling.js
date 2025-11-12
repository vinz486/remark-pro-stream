// JavaScript code for working with the canvas element
function resizeVisibleCanvas() {
	var container = document.getElementById("container");

	// Always use landscape aspect ratio for this device
	var aspectRatio = screenHeight / screenWidth;

	console.log(`[RESIZE] portrait=${portrait}, screenW=${screenWidth}, screenH=${screenHeight}, aspectRatio=${aspectRatio}`);

	var containerWidth = container.offsetWidth;
	var containerHeight = container.offsetHeight;

	var containerAspectRatio = containerWidth / containerHeight;

	if (containerAspectRatio > aspectRatio) {
		        // Canvas is relatively wider than container
        //canvas.style.width = '100vw';
        //canvas.style.width = '100%';
        //canvas.style.height = 'auto';
		visibleCanvas.style.width = containerHeight * aspectRatio + "px";
		visibleCanvas.style.height = containerHeight + "px";
	} else {
		        // Canvas is relatively taller than container
        //canvas.style.width = 'auto';
        //canvas.style.height = '100vh';
        //canvas.style.height = '100%';
		visibleCanvas.style.width = containerWidth + "px";
		visibleCanvas.style.height = containerWidth / aspectRatio + "px";
	}

	console.log(`[RESIZE] Canvas size set to: ${visibleCanvas.style.width} x ${visibleCanvas.style.height}`);
	console.log(`[RESIZE] Applying flip=${flip} → transform: rotate(${flip ? 180 : 0}deg)`);

	if (flip) {
		visibleCanvas.style.transform = "rotate(180deg)";
	} else {
		visibleCanvas.style.transform = "rotate(0deg)";
	}
}
function waiting(message) {
	// Clear the canvas
	gl.clearColor(0, 0, 0, 1); // Set clear color (black, in this case)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// To show the message
	messageDiv.textContent = message;
	messageDiv.style.display = 'block';
}
