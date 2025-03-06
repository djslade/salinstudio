package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"testing"
)

// This file contains test helper functions that are not reuseable across other packages

func newTestApplication(t *testing.T) *application {
	cfg := config{
		port: 8080,
		env:  "development",
	}

	return &application{
		version: "1.0.0",
		config:  cfg,
		logger:  log.New(io.Discard, "", log.Ldate|log.Ltime),
	}
}

type testServer struct {
	*httptest.Server
}

func newTestServer(t *testing.T, h http.Handler) *testServer {
	ts := httptest.NewServer(h)

	jar, err := cookiejar.New(nil)
	if err != nil {
		t.Fatal(err)
	}

	ts.Client().Jar = jar

	ts.Client().CheckRedirect = func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	}

	return &testServer{ts}
}

func (ts *testServer) get(t *testing.T, urlPath string, payload any) (int, http.Header) {
	rs, err := ts.Client().Get(ts.URL + urlPath)
	if err != nil {
		t.Fatal(err)
	}

	defer rs.Body.Close()
	body, err := io.ReadAll(rs.Body)
	if err != nil {
		t.Fatal(err)
	}

	if err := json.Unmarshal(body, payload); err != nil {
		t.Fatal(err)
	}

	return rs.StatusCode, rs.Header
}
