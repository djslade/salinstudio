-- name: CreateUser :one
INSERT INTO users(id, username, hashed_password, created_at)
VALUES (GEN_RANDOM_UUID(), $1, $2, NOW())
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE username=$1;