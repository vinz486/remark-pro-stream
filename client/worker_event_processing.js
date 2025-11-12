let height;
let width;
let eventURL;
let portrait;
let draw; 
let latestX;
let latestY;
let maxXValue;
let maxYValue;

onmessage = (event) => {
	const data = event.data;

	switch (data.type) {
		case 'init':
			height = event.data.height;
			width = event.data.width;
			eventURL = event.data.eventURL;
			portrait = event.data.portrait;
            maxXValue = event.data.maxXValue;
            maxYValue = event.data.maxYValue;
			initiateEventsListener();
			break;
		case 'portrait':
			portrait = event.data.portrait;
			// Handle the error, maybe show a user-friendly message or take some corrective action
			break;
		case 'terminate':
			console.log("terminating worker");
			close();
			break;
	}
};


async function initiateEventsListener() {
	const eventSource = new EventSource(eventURL);
	draw = true;
	eventSource.onmessage = (event) => {
		const parts = event.data.split(',');
		const code = parseInt(parts[0], 10);
		const value = parseInt(parts[1], 10);

		// The original logic only cared about Type === 3, which we are now assuming
		// as the server filters for it.

		if (code === 24) {
			draw = false;
			postMessage({ type: 'clear' });
		} else if (code === 25) {
			draw = true;
		}

		// Update and draw laser pointer
		// Send RAW coordinates to main thread - scaling will happen there with correct canvas dimensions
		if (portrait) {
			if (code === 1) { // Horizontal position
				latestX = value;
			} else if (code === 0) { // Vertical position
				latestY = value;
			}
		} else {
			// Landscape mode
			if (code === 1) { // Horizontal position
				latestX = value;
			} else if (code === 0) { // Vertical position
				latestY = value;
			}
		}
		if (draw) {
			postMessage({
				type: 'update',
				rawX: latestX,
				rawY: latestY,
				maxX: maxXValue,
				maxY: maxYValue
			});
		}
	}

	eventSource.onerror = () => {
		postMessage({
			type: 'error',
			message: "EventSource error",
		});
		console.error('EventSource error occurred.');
	};

	eventSource.onclose = () => {
		postMessage({
			type: 'error',
			message: 'Connection closed'
		});
		console.log('EventSource connection closed.');
	};
}

// Function to scale the incoming value to the canvas size
function scaleValue(value, maxValue, canvasSize) {
	return (value / maxValue) * canvasSize;
}
