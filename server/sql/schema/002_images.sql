-- +goose Up
CREATE TABLE images(
    id UUID PRIMARY KEY,
    image_url_full TEXT NOT NULL,
    image_url_mobile TEXT NOT NULL,
    image_url_thumb TEXT NOT NULL,
    index INT NOT NULL,
    category TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_fi TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE images;