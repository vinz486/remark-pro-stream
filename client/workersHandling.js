// Send the OffscreenCanvas to the worker for initialization
streamWorker.postMessage({ 
	type: 'init', 
	width: screenWidth,
	height: screenHeight,
	rate: rate,
	withColor: withColor,
	useRLE: UseRLE,
});

let firstFrameRendered = false;
const mainThreadStart = performance.now();

// Listen for updates from the worker
streamWorker.onmessage = (event) => {
	// To hide the message (e.g., when you start drawing in WebGL again)
	messageDiv.style.display = 'none';

	const data = event.data;

	switch (data.type) {
		case 'update':
			// Handle the update
			if (!firstFrameRendered) {
				console.log(`[PERF Main] First frame data received from worker at T+${(performance.now() - mainThreadStart).toFixed(2)}ms`);
			}
			
			const frameData = event.data.data;
			const renderStart = performance.now();
			// portrait=true → rotate 270°, portrait=false → no rotation
			updateTexture(frameData, portrait, 1);
			const renderDuration = performance.now() - renderStart;
			
			if (!firstFrameRendered) {
				console.log(`[PERF Main] First frame rendered at T+${(performance.now() - mainThreadStart).toFixed(2)}ms (render took ${renderDuration.toFixed(2)}ms)`);
				firstFrameRendered = true;
			}
			break;
		case 'error':
			console.error('Error from worker:', event.data.message);
			waiting(event.data.message)
			// Handle the error, maybe show a user-friendly message or take some corrective action
			break;
			// ... handle other message types as needed
	}
};


// Determine the WebSocket protocol based on the current window protocol
const eventURL = `/events`;
// Send the OffscreenCanvas to the worker for initialization
eventWorker.postMessage({ 
	type: 'init', 
	width: screenWidth,
	height: screenHeight,
	portrait: portrait,
	eventURL: eventURL,
    maxXValue: MaxXValue,
    maxYValue: MaxYValue,
});
gestureWorker.postMessage({ 
	type: 'init', 
});

gestureWorker.onmessage = (event) => {
	const data = event.data;

	switch (data.type) {
		case 'gesture':

			switch (event.data.value) {
				case 'left':
					document.getElementById('content').contentWindow.postMessage( JSON.stringify({ method: 'left' }), '*' );
					break;
				case 'right':
					document.getElementById('content').contentWindow.postMessage( JSON.stringify({ method: 'right' }), '*' );
					break;
				case 'topleft-to-bottomright':
					document.getElementById('content').contentWindow.postMessage( JSON.stringify({ method: 'right' }), '*' );
					break;
				case 'topright-to-bottomleft':
					document.getElementById('content').contentWindow.postMessage( JSON.stringify({ method: 'left' }), '*' );
					break;
				case 'bottomright-to-topleft':
					iFrame.style.zIndex = 1;
					break;
				case 'bottomleft-to-topright':
					iFrame.style.zIndex = 4;
					break;
				default:
					// Code to execute if none of the above cases match
			}
			break;
		case 'error':
			console.error('Error from worker:', event.data.message);
			break;
	}

}

// Listen for updates from the worker
eventWorker.onmessage = (event) => {
	// To hide the message (e.g., when you start drawing in WebGL again)
	messageDiv.style.display = 'none';

	const data = event.data;

	switch (data.type) {
		case 'clear':
			// Clear button pressed - hide cursor
			updateLaserPosition(-10, -10);
			break;
		case 'update':
			// Handle the update - receive raw coordinates and max values from worker
			// HTML overlay with CSS transitions handles smoothing automatically
			updateLaserPosition(data.rawX, data.rawY, data.maxX, data.maxY);
			break;
		case 'error':
			console.error('Error from worker:', event.data.message);
			waiting(event.data.message)
			break;
	}
};
