import { supabase } from '@/lib/supabaseClient';
import DashboardClient from '@/components/dashboard-client';
import { redirect } from 'next/navigation';

export const revalidate = 0;

async function getData(moodId) {
    // Fetch mood
    const { data: mood } = await supabase
        .from('moods')
        .select('*')
        .eq('id', moodId)
        .single();

    if (!mood) return { mood: null, verses: [], videos: [] };

    // Fetch verses
    const { data: verses } = await supabase
        .from('verses')
        .select('*')
        .eq('mood_id', moodId)
        .limit(4);

    // Fetch videos (Server-side call to YouTube API logic - reused or internal fetch)
    // Since we are in Server Component, we can fetch directly or call our own API.
    // Calling own API with full URL is sometimes tricky, let's just use the logic directly or fetch empty and let client populate?
    // User asked for "Real time generation".
    // Better to fetch on server for SEO and initial load speed.
    // I can't easily import the route handler logic unless I extract it.
    // I'll do a fetch to the absolute URL if possible, or just reimplement fetch here.
    // Reimplementing fetch here is safer than assuming localhost port.

    let videos = [];
    try {
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        const query = mood.youtube_keywords;
        const params = new URLSearchParams({
            part: 'snippet',
            maxResults: '15',
            q: query,
            type: 'video',
            videoCategoryId: '10',
            safeSearch: 'moderate',
            key: YOUTUBE_API_KEY,
        });
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
        if (res.ok) {
            const data = await res.json();
            videos = data.items.map((item) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                channel: item.snippet.channelTitle,
            }));
        }
    } catch (e) {
        console.error("Failed to fetch initial videos", e);
    }

    return { mood, verses, videos };
}

export default async function DashboardPage(props) {
    const searchParams = await props.searchParams;
    const moodId = searchParams.mood_id;

    if (!moodId) {
        redirect('/moods');
    }

    const { mood, verses, videos } = await getData(moodId);

    if (!mood) {
        redirect('/moods');
    }

    return (
        <DashboardClient mood={mood} initialVerses={verses} initialVideos={videos} />
    );
}
