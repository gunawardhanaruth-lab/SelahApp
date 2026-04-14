const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('--- Supabase Connection Diagnostic ---');
    console.log('Project URL:', supabaseUrl);
    
    const tablesToCheck = ['users', 'moods', 'verses'];
    
    for (const table of tablesToCheck) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.error(`❌ Table "${table}": Access error - ${error.message}`);
                if (error.code === '42P01') {
                    console.log(`   (Hint: Table "${table}" does not exist in the database yet)`);
                }
            } else {
                console.log(`✅ Table "${table}": Connected and accessible. (Row count: ${count})`);
            }
        } catch (err) {
            console.error(`❌ Table "${table}": Unexpected crash - ${err.message}`);
        }
    }
}

testConnection();
