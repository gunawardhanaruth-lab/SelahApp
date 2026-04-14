const supabase = require('./db');

async function seedVerses() {
    console.log('🚀 Starting Bible Verse seeding for Supabase...');

    const versesData = [
        { mood_name: 'Happy', reference: 'Psalm 118:24', text: 'This is the day that the Lord has made; let us rejoice and be glad in it.' },
        { mood_name: 'Happy', reference: 'Philippians 4:4', text: 'Rejoice in the Lord always; again I will say, rejoice.' },
        { mood_name: 'Anxious', reference: 'Philippians 4:6', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.' },
        { mood_name: 'Anxious', reference: '1 Peter 5:7', text: 'Cast all your anxiety on him because he cares for you.' },
        { mood_name: 'Sad', reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
        { mood_name: 'Sad', reference: 'Matthew 5:4', text: 'Blessed are those who mourn, for they will be comforted.' },
        { mood_name: 'Grateful', reference: '1 Thessalonians 5:18', text: 'Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.' },
        { mood_name: 'Grateful', reference: 'Psalm 100:4', text: 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.' },
        { mood_name: 'Peaceful', reference: 'Isaiah 26:3', text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.' },
        { mood_name: 'Peaceful', reference: 'Numbers 6:24-26', text: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.' }
    ];

    try {
        const { data: moods, error: moodErr } = await supabase.from('moods').select('id, name');
        if (moodErr) {
            console.error('❌ Could not fetch moods:', moodErr.message);
            return;
        }

        console.log('Available moods in DB:', moods.map(m => m.name).join(', '));

        const moodMap = {};
        moods.forEach(m => moodMap[m.name] = m.id);

        const finalVerses = versesData
            .filter(v => moodMap[v.mood_name])
            .map(v => ({
                mood_id: moodMap[v.mood_name],
                reference: v.reference,
                text: v.text
            }));

        if (finalVerses.length === 0) {
            console.warn('⚠️ No matching moods found in database. Check your mood names!');
            return;
        }

        console.log(`⏳ Seeding ${finalVerses.length} verses...`);

        const { error: insError } = await supabase.from('verses').insert(finalVerses);
        
        if (insError) {
            console.error('❌ Error inserting verses:', insError.message);
            if (insError.hint) console.log('Hint:', insError.hint);
            return;
        }

        console.log('✅ Bible verses seeded successfully for all moods!');
        
    } catch (error) {
        console.error('❌ Unexpected crash:', error);
    }
}

seedVerses();
