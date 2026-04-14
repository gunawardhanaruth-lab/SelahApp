const supabase = require('./db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    console.log('🚀 Starting user seeding for Supabase...');

    try {
        // Generate hashes (keep same as your previous logic)
        const adminPass = await bcrypt.hash('admin123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        const usersToSeed = [
            {
                name: 'Admin User',
                email: 'admin@selah.com',
                password: adminPass,
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'user@selah.com',
                password: userPass,
                role: 'user'
            }
        ];

        console.log('⏳ Inserting users into "users" table...');

        // Using upsert on email to prevent duplicates if the script is run multiple times
        // Note: This assumes the 'email' column has a UNIQUE constraint in Supabase
        const { data, error } = await supabase
            .from('users')
            .upsert(usersToSeed, { onConflict: 'email' })
            .select();

        if (error) {
            throw error;
        }

        console.log('✅ Seeding complete!');
        console.log('---');
        console.log('Admin: admin@selah.com / admin123');
        console.log('User: user@selah.com / user123');
        
        if (data && data.length > 0) {
            console.log(`Seeded/Updated ${data.length} user records.`);
        }

    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
        if (error.message.includes('relation "public.users" does not exist')) {
            console.log('Hint: Make sure you have created the "users" table in the Supabase SQL Editor.');
        }
    }
}

seedUsers();
