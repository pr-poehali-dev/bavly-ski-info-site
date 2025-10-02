CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    child_name VARCHAR(255) NOT NULL,
    child_age INTEGER NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS athletes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    achievements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO athletes (name, age, achievements) VALUES
('Александров Иван', 15, '1 место - Кубок Татарстана 2024'),
('Петрова Мария', 14, '2 место - Первенство РТ 2024'),
('Сидоров Дмитрий', 16, '3 место - Зимняя Спартакиада'),
('Козлова Елена', 13, '1 место - Юниорский кубок');

INSERT INTO competitions (name, date, location) VALUES
('Кубок Бавлы', '2024-12-15', 'г. Бавлы, лыжная база'),
('Первенство Татарстана', '2025-01-20', 'г. Казань'),
('Зимняя Спартакиада', '2025-02-10', 'г. Альметьевск');