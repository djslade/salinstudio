-- name: CreateRefreshToken :one
INSERT INTO refresh_tokens (token, user_id, created_at, expires_at)
VALUES ($1, $2, NOW(), $3)
RETURNING *;

-- name: ExtendRefreshToken :exec
UPDATE refresh_tokens SET expires_at=$1 WHERE token=$2;

-- name: RevokeRefreshToken :exec
UPDATE refresh_tokens SET expires_at=NOW() WHERE token=$1;