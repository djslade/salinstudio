package testutils

import "testing"

func AssertEqual[T comparable](t *testing.T, actual, expected T) {
	t.Helper()
	if actual != expected {
		t.Errorf("expected: %v; actual: %v\n", expected, actual)
	}
}
