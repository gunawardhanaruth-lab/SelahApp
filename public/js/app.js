// Utility to get URL params
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Global Logout Function
async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'index.html';
}

// Check Session on Load
async function checkSession() {
    try {
        const res = await fetch('/api/me');
        const session = await res.json();

        const headerBtn = document.querySelector('header .btn');
        if (headerBtn) {
            if (session.loggedIn) {
                if (session.role === 'admin') {
                    headerBtn.textContent = 'Admin Panel';
                    headerBtn.href = 'admin.html';
                } else {
                    headerBtn.textContent = 'Logout';
                    headerBtn.href = '#';
                    headerBtn.onclick = logout;
                }
            }
        }
    } catch (err) {
        console.error('Session check failed', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    checkSession();

    // --- MOODS PAGE LOGIC ---
    const moodGrid = document.getElementById('mood-grid');
    if (moodGrid) {
        try {
            const response = await fetch('/api/moods');
            const moods = await response.json();

            moodGrid.innerHTML = moods.map(mood => `
                <a href="dashboard.html?mood_id=${mood.id}" class="mood-card">
                    <div class="mood-emoji">${mood.emoji}</div>
                    <div class="mood-name">${mood.name}</div>
                </a>
            `).join('');
        } catch (error) {
            moodGrid.innerHTML = '<p>Failed to load moods. Please ensure database is connected.</p>';
            console.error(error);
        }
    }

    // --- DASHBOARD MOOD LOGIC ---
    const dashboardTitle = document.getElementById('dashboard-title');
    if (dashboardTitle) {
        const moodId = getQueryParam('mood_id');
        if (!moodId) {
            window.location.href = 'moods.html';
            return;
        }

        try {
            // Fetch Mood & Verses
            const res = await fetch(`/api/moods/${moodId}`);
            if (!res.ok) throw new Error('Failed to fetch mood data');
            const data = await res.json();

            // Update Title
            dashboardTitle.innerHTML = `${data.mood.emoji} Feeling ${data.mood.name}`;

            // Render Verses
            const versesContainer = document.getElementById('verses-container');
            versesContainer.innerHTML = data.verses.map(v => `
                <div class="verse-card">
                    <p class="verse-text">"${v.text}"</p>
                    <cite class="verse-ref">— ${v.reference}</cite>
                </div>
            `).join('');

            // Fetch Videos (Proxy)
            const videoRes = await fetch(`/api/youtube?q=${encodeURIComponent(data.mood.youtube_keywords)}`);
            const videoData = await videoRes.json();

            if (videoData.videos && videoData.videos.length > 0) {
                renderPlayer(videoData.videos);
            }

        } catch (error) {
            console.error(error);
            alert('Error loading dashboard data');
        }
    }
});

function renderPlayer(videos) {
    let currentIndex = 0;
    const playerContainer = document.getElementById('video-player');
    const playlistContainer = document.getElementById('playlist');

    function loadVideo(index) {
        currentIndex = index;
        const video = videos[index];
        playerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}?autoplay=1" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        renderPlaylist();
    }

    function renderPlaylist() {
        playlistContainer.innerHTML = videos.map((video, idx) => `
            <div class="playlist-item ${idx === currentIndex ? 'active' : ''}" onclick="window.playVideo(${idx})">
                <img src="${video.thumbnail}" alt="" class="playlist-thumb">
                <div class="playlist-info">
                    <div class="playlist-title">${video.title}</div>
                    <div class="playlist-channel">${video.channel}</div>
                </div>
            </div>
        `).join('');
    }

    // Expose function to global scope for onclick
    window.playVideo = loadVideo;

    // init
    loadVideo(0);
}
