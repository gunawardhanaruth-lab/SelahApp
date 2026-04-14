const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret_key_123', // In prod use a robust env var
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
// Protect Admin Page - MUST be before express.static
app.get('/admin.html', (req, res) => {
    if (req.session.role !== 'admin') {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await db
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.name = user.name;
            res.json({ message: 'Login successful', role: user.role, name: user.name });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Register Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await db
            .from('users')
            .insert([{ name, email, password: hashedPassword, role: 'user' }]);

        if (error) {
            if (error.code === '23505') { // Postgres code for unique violation
                return res.status(400).json({ error: 'Email already exists' });
            }
            console.error('Registration Error:', error);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout Route
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Check Session
app.get('/api/me', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, name: req.session.name, role: req.session.role });
    } else {
        res.json({ loggedIn: false });
    }
});

// 1. Get All Moods
app.get('/api/moods', async (req, res) => {
    const { data, error } = await db.from('moods').select('*');
    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
});

// 2. Get Data for a Specific Mood (Verses)
app.get('/api/moods/:idOrName', async (req, res) => {
    const selector = req.params.idOrName;
    const isId = !isNaN(selector);

    try {
        // One query to get mood
        let queryBuilder = db.from('moods').select('*');
        if (isId) queryBuilder = queryBuilder.eq('id', selector);
        else queryBuilder = queryBuilder.eq('name', selector);

        const { data: mood, error: moodErr } = await queryBuilder.single();
        if (moodErr || !mood) return res.status(404).json({ error: 'Mood not found' });

        // Return empty verses for guests (Requirement: only registered users can see verses)
        let verses = [];
        if (req.session.userId) {
            const { data: rawVerses, error: verseErr } = await db
                .from('verses')
                .select('*')
                .eq('mood_id', mood.id);
            
            if (verseErr) throw verseErr;

            console.log(`📖 DB found ${rawVerses?.length || 0} references for mood: ${mood.name}. Fetching live text from Bible-API.com...`);

            const myFetch = global.fetch || (await import('node-fetch')).default;
            verses = await Promise.all((rawVerses || []).map(async (v) => {
                try {
                    const apiUrl = `https://bible-api.com/${encodeURIComponent(v.reference)}`;
                    console.log(`🔗 API Request: ${apiUrl}`);
                    
                    const apiRes = await myFetch(apiUrl);
                    const apiData = await apiRes.json();
                    
                    if (apiData.text) {
                        console.log(`✅ API Success for ${v.reference}`);
                        return {
                            id: v.id,
                            reference: apiData.reference || v.reference,
                            text: apiData.text,
                            icon: v.icon || '📖'
                        };
                    } else {
                        console.warn(`⚠️ API returned no text for ${v.reference}. Using DB fallback.`);
                        return v;
                    }
                } catch (apiErr) {
                    console.error(`❌ Bible API Error for ${v.reference}:`, apiErr.message);
                    return v;
                }
            }));
        }

        res.json({
            mood: mood,
            verses: verses,
            loggedIn: !!req.session.userId,
            userName: req.session.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. YouTube Proxy (To hide API Key)
app.get('/api/youtube', async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) return res.status(400).json({ error: 'Missing query' });
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
        return res.status(500).json({ error: 'Server missing valid API Key. Please update your .env' });
    }

    try {
        // Use global fetch (Node 18+) or fall back to native web fetch if in some environments
        const myFetch = global.fetch || (await import('node-fetch')).default;
        // Add a random suffix to the query to force YouTube to find different "niches" of content
        const suffixes = ['live', 'acoustic', 'playlist', 'latest', 'classic', 'spirit-filled'];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomizedQuery = `${query} ${randomSuffix}`;

        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(randomizedQuery)}&type=video&videoCategoryId=10&safeSearch=moderate&key=${apiKey}`;

        console.log(`🎬 YouTube Search: "${randomizedQuery}"`);

        const response = await myFetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            console.error('YouTube API Data Error:', data.error);
            return res.status(400).json(data.error);
        }

        let videos = (data.items || []).map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url,
            channel: item.snippet.channelTitle
        }));

        console.log(`📦 Found ${videos.length} videos from API.`);

        // Shuffle the results
        videos = videos.sort(() => Math.random() - 0.5);

        // Return a fresh subset of 10 videos
        const freshSubset = videos.slice(0, 10);
        console.log(`✅ Returning ${freshSubset.length} randomized videos.`);

        res.json({ videos: freshSubset });

    } catch (error) {
        console.error('YouTube Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch from YouTube. Error: ' + error.message });
    }
});

// Serve Frontend


app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.params[0] || 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
