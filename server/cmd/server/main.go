package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/djslade/salinstudio-server/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	db               *database.Queries
	jwtSecret        string
	platform         string
	assetsRoot       string
	s3Client         *s3.Client
	s3Bucket         string
	s3Region         string
	s3CfDistribution string
	port             string
}

func main() {
	godotenv.Load(".env")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	platform := os.Getenv("PLATFORM")
	if platform == "" {
		log.Fatal("PLATFORM environment variable is not set")
	}

	assetsRoot := os.Getenv("ASSETS_ROOT")
	if assetsRoot == "" {
		log.Fatal("ASSETS_ROOT environment variable is not set")
	}

	s3Bucket := os.Getenv("S3_BUCKET")
	if s3Bucket == "" {
		log.Fatal("S3_BUCKET environment variable is not set")
	}

	s3Region := os.Getenv("S3_REGION")
	if s3Region == "" {
		log.Fatal("S3_REGION environment variable is not set")
	}

	s3CfDistribution := os.Getenv("S3_CF_DISTRO")
	if s3CfDistribution == "" {
		log.Fatal("S3_CF_DISTRO environment variable is not set")
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	awsCfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	client := s3.NewFromConfig(awsCfg)

	db, err := sql.Open("postgres", "")
	if err != nil {
		log.Fatal(err)
	}

	cfg := apiConfig{
		db:               database.New(db),
		jwtSecret:        jwtSecret,
		platform:         platform,
		assetsRoot:       assetsRoot,
		s3Client:         client,
		s3Bucket:         s3Bucket,
		s3Region:         s3Region,
		s3CfDistribution: s3CfDistribution,
		port:             port,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/images", cfg.handlerUploadImage)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Serving on: http://localhost:%s\n", port)
	log.Fatal(srv.ListenAndServe())
}
