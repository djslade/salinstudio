-- +goose Up
CREATE TABLE users(
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE users;