CREATE TABLE IF NOT EXISTS coaches (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO coaches (username, password_hash, full_name) VALUES
('trainer', '$2b$10$rZ5L3kVX5JZXqKjYvZ5YKeTQH3Hj8CzVJkF5Hj8CzVJkF5Hj8CzVJk', 'Петрова А.М.');