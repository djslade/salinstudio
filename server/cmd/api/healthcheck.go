package main

import (
	"encoding/json"
	"net/http"
)

type responseHealthcheck struct {
	Status  string `json:"status"`
	Env     string `json:"env"`
	Version string `json:"version"`
}

func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	res := responseHealthcheck{
		Status:  "available",
		Env:     app.config.env,
		Version: app.version,
	}

	body, err := json.Marshal(res)
	if err != nil {
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(body)
}
