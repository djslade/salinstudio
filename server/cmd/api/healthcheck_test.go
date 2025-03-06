package main

import (
	"net/http"
	"testing"

	"github.com/djslade/salinstudio/internal/testutils"
)

func TestHealthchechHandler(t *testing.T) {
	app := newTestApplication(t)
	ts := newTestServer(t, app.routes())

	tests := []struct {
		name               string
		expectedStatusCode int
		expectedResStatus  string
		expectedResEnv     string
		expectedResVersion string
	}{
		{
			name:               "Happy path",
			expectedStatusCode: http.StatusOK,
			expectedResStatus:  "available",
			expectedResEnv:     "development",
			expectedResVersion: "1.0.0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var pl responseHealthcheck
			code, _ := ts.get(t, "/v1/healthcheck", &pl)

			testutils.AssertEqual(t, code, tt.expectedStatusCode)
			testutils.AssertEqual(t, pl.Status, tt.expectedResStatus)
			testutils.AssertEqual(t, pl.Env, tt.expectedResEnv)
			testutils.AssertEqual(t, pl.Version, tt.expectedResVersion)
		})
	}
}
