-- name: CreateImage :one
INSERT INTO images(id, image_url_full, image_url_mobile, image_url_thumb, index, category, title_en, title_fi, created_at)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, 0, $4, $5, $6, NOW())
RETURNING *;

-- name: GetImagesByCategory :many
SELECT * FROM images WHERE category=$1;
