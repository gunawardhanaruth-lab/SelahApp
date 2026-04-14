const supabase = require('./db');

async function fixMoods() {
    console.log('🔍 Checking for missing moods in Supabase...');

    const newMoods = [
        { name: 'Worship', emoji: '✨', youtube_keywords: 'deep devotional worship songs hillsong bethel' },
        { name: 'Grateful', emoji: '🙏', youtube_keywords: 'thanksgiving christian worship songs' },
        { name: 'Peaceful', emoji: '🕊️', youtube_keywords: 'calm instrumental christian worship' }
    ];

    try {
        for (const mData of newMoods) {
            const { data: existing, error: checkErr } = await supabase
                .from('moods')
                .select('id')
                .eq('name', mData.name)
                .single();

            if (!existing) {
                console.log(`➕ Adding missing mood: ${mData.name}`);
                const { data: inserted, error: insErr } = await supabase
                    .from('moods')
                    .insert([mData])
                    .select();
                
                if (insErr) console.error(`❌ Error adding ${mData.name}:`, insErr.message);
                else {
                    console.log(`✅ Added ${mData.name} (ID: ${inserted[0].id})`);
                    
                    // Add some verses for this new mood
                    const verses = [];
                    if (mData.name === 'Worship') {
                        verses.push({ mood_id: inserted[0].id, reference: 'Psalm 29:2', text: 'Ascribe to the Lord the glory due his name; worship the Lord in the splendor of his holiness.' });
                        verses.push({ mood_id: inserted[0].id, reference: 'John 4:24', text: 'God is spirit, and his worshipers must worship in the Spirit and in truth.' });
                    } else if (mData.name === 'Grateful') {
                        verses.push({ mood_id: inserted[0].id, reference: '1 Thessalonians 5:18', text: 'Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.' });
                    } else if (mData.name === 'Peaceful') {
                        verses.push({ mood_id: inserted[0].id, reference: 'Isaiah 26:3', text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.' });
                    }

                    if (verses.length > 0) {
                        const { error: vErr } = await supabase.from('verses').insert(verses);
                        if (vErr) console.error(`❌ Error adding verses for ${mData.name}:`, vErr.message);
                        else console.log(`✅ Added ${verses.length} verses for ${mData.name}`);
                    }
                }
            } else {
                console.log(`✔ Mood exists: ${mData.name}`);
            }
        }
    } catch (err) {
        console.error('❌ Crash:', err);
    }
}

fixMoods();
