package state

import "sync"

// SharedState holds the application's shared state, like streaming status.
type SharedState struct {
	mu          sync.RWMutex
	isStreaming bool
}

// NewSharedState creates a new SharedState.
func NewSharedState() *SharedState {
	return &SharedState{}
}

// SetStreaming sets the streaming state.
func (s *SharedState) SetStreaming(isStreaming bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.isStreaming = isStreaming
}

// IsStreaming returns the current streaming state.
func (s *SharedState) IsStreaming() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.isStreaming
}
