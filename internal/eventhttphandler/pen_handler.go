package eventhttphandler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/owulveryck/goMarkableStream/internal/events"
	"github.com/owulveryck/goMarkableStream/internal/pubsub"
)

// NewEventHandler creates an event habdler that subscribes from the inputEvents
func NewEventHandler(inputEvents *pubsub.PubSub) *EventHandler {
	return &EventHandler{
		inputEventBus: inputEvents,
	}
}

// EventHandler is a http.Handler that servers the input events over http via wabsockets
type EventHandler struct {
	inputEventBus *pubsub.PubSub
}

// ServeHTTP implements http.Handler
func (h *EventHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	eventC := h.inputEventBus.Subscribe("eventListener")
	defer func() {
		h.inputEventBus.Unsubscribe(eventC)
	}()
	// Set necessary headers to indicate a stream
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	isStreaming := false

	for {
		select {
		case <-r.Context().Done():
			return
		case event := <-eventC:
			if event.Source == events.System {
				switch event.Code {
				case events.StreamingStart:
					if !isStreaming {
						isStreaming = true
						log.Println("Screen streaming started, pausing pen events")
					}
				case events.StreamingStop:
					if isStreaming {
						isStreaming = false
						log.Println("Screen streaming stopped, resuming pen events")
					}
				}
				continue
			}
			if isStreaming {
				continue
			}
			// Serialize the structure as JSON
			if event.Source != events.Pen {
				continue
			}
			if event.Type != events.EvAbs {
				continue
			}
			// Send the event
			fmt.Fprintf(w, "data: %d,%d\n\n", event.Code, event.Value)
			w.(http.Flusher).Flush() // Ensure client receives the message immediately

		}
	}
}
