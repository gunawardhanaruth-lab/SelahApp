-- Database Name: selah_app

DROP TABLE IF EXISTS verses;
DROP TABLE IF EXISTS moods;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data for Users (Password: 'admin123' and 'user123' - Hashed versions for bcrypt)
-- Using simple plaintext for now if bcrypt not enforced in seed, but plan assumes server handles hashing OR we insert precooked hashes.
-- TO BE SAFE: I will insert Pre-Hashed passwords in the seed so the new server auth works immediately.
-- admin123 -> $2a$10$X.x.x... (I will use a known hash for 'admin123' and 'user123')
-- Hash for 'admin123': $2b$10$vNtbjS6qXnOq0D1vaP6ZUO.jGjXX.xXX.xXX.xXX.xXX.xX (Placeholder, better to let user register or use a simple one)
-- Actually, to keep it simple and robust, I will use a known BCrypt hash for "password".
-- "password" hash: $2a$10$start... 
-- Let's just put plaintext for now and I'll handle hashing in server.js or we assume this is a dev env. 
-- BETTER APPROACH: I will just insert them as plaintext for testing and make sure the server code handles "if (password match OR bcrypt match)". 
-- WAIT, mixing is bad. I will generate the hash in the implementation step or just use a registration flow.
-- OK, I will Insert valid MD5 or I'll just rely on Registration to create users. 
-- BUT User wants test accounts.
-- I'll use a hardcoded helper script to seed users properly via JS instead of SQL if needed, but SQL is faster.
-- I will Insert these users assuming the app will check them. 
-- Password 'password' hash using bcrypt (cost 10): $2b$10$Top7.1U6.3.1.1.1.1.1.1.1.1.1.1.1.1.1 (Fake)
-- Let's stick to: Create the table structure first. I will add the seed in SQL but I need valid hashes. 
-- Hash for 'admin123': $2a$10$M9sdG.fM9sdG.fM9sdG.fM9sdG.fM9sdG.fM9sdG.fM9sdG.fM9sdG. (invalid)
-- I will skip SQL seeding for users and create a `seed_users.js` script to run once, ensuring correct hashing.
-- Changing strategy: Just update table structure here.

CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    youtube_keywords VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS verses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mood_id INT NOT NULL,
    text TEXT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    FOREIGN KEY (mood_id) REFERENCES moods(id) ON DELETE CASCADE
);

-- Seed Data for Moods
INSERT INTO moods (name, emoji, youtube_keywords) VALUES
('Happy', '😊', 'christian worship songs upbeat praise'),
('Anxious', '😰', 'peaceful christian worship songs for anxiety'),
('Sad', '😢', 'comforting christian worship songs for sadness'),
('Grateful', '🙏', 'thanksgiving worship songs'),
('Peaceful', '🕊️', 'instrumental worship music quiet time');

-- Seed Data for Verses (Example for Mood 1 - Happy)
INSERT INTO verses (mood_id, text, reference) VALUES
(1, 'This is the day that the Lord has made; let us rejoice and be glad in it.', 'Psalm 118:24'),
(1, 'Rejoice in the Lord always; again I will say, rejoice.', 'Philippians 4:4');

-- Seed Data for Verses (Example for Mood 2 - Anxious)
INSERT INTO verses (mood_id, text, reference) VALUES
(2, 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.', 'Philippians 4:6'),
(2, 'Peace I leave with you; my peace I give to you.', 'John 14:27');
