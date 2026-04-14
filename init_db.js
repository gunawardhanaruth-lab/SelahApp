const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect without selecting a database first
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Enable multiple statements for the SQL script
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
        console.log('---');
        console.log('Make sure XAMPP (MySQL) is running!');
        process.exit(1);
    }
    console.log('✅ Connected to MySQL server.');

    // Step 1: Create Database
    connection.query("CREATE DATABASE IF NOT EXISTS selah_app", (err) => {
        if (err) {
            console.error('❌ Error creating database:', err.message);
            process.exit(1);
        }
        console.log('✅ Database "selah_app" created or already exists.');

        // Step 2: Select Database
        connection.changeUser({ database: 'selah_app' }, (err) => {
            if (err) {
                console.error('❌ Error selecting database:', err.message);
                process.exit(1);
            }

            // Step 3: Run SQL File
            const sqlPath = path.join(__dirname, 'database.sql');
            const sql = fs.readFileSync(sqlPath, 'utf8');

            connection.query(sql, (err) => {
                if (err) {
                    console.error('❌ Error executing database.sql:', err.message);
                    process.exit(1);
                }
                console.log('✅ Tables created and data seeded successfully!');
                console.log('---');
                console.log('🎉 You can now run "node server.js"!');
                connection.end();
            });
        });
    });
});
