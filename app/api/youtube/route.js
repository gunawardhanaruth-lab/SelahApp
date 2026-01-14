import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    if (!YOUTUBE_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Missing YouTube API Key' }, { status: 500 });
    }

    try {
        const params = new URLSearchParams({
            part: 'snippet',
            maxResults: '15',
            q: query,
            type: 'video',
            videoCategoryId: '10', // Music category
            safeSearch: 'moderate',
            key: YOUTUBE_API_KEY,
        });

        const response = await fetch(`${YOUTUBE_API_URL}?${params.toString()}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('YouTube API Error:', errorData);
            return NextResponse.json({ error: 'Failed to fetch from YouTube', details: errorData }, { status: response.status });
        }

        const data = await response.json();

        // Transform items to a simpler format
        const videos = data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channel: item.snippet.channelTitle,
        }));

        return NextResponse.json({ videos });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
