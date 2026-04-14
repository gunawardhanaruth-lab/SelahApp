'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, SkipForward, SkipBack, RefreshCw, Heart } from 'lucide-react';
import Image from 'next/image';

export default function DashboardClient({ mood, initialVerses, initialVideos }) {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videos, setVideos] = useState(initialVideos || []);
    const [verses] = useState(initialVerses || []); // Verses are static for now
    const [loading, setLoading] = useState(false);

    const currentVideo = videos[currentVideoIndex];

    const handleNext = () => {
        if (videos.length > 0) {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        }
    };

    const handlePrev = () => {
        if (videos.length > 0) {
            setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
        }
    };

    const handleRegenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/youtube?q=${encodeURIComponent(mood.youtube_keywords)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.videos && data.videos.length > 0) {
                    setVideos(data.videos);
                    setCurrentVideoIndex(0);
                }
            }
        } catch (error) {
            console.error('Failed to regenerate playlist', error);
        } finally {
            setLoading(false);
        }
    };

    // Log session on mount (simplified)
    useEffect(() => {
        // Fire and forget logging
        // fetch('/api/log', { ... }) 
    }, [mood.id]);

    if (!mood) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-4">
                    <span>{mood.emoji}</span>
                    <span>Feeling {mood.name}</span>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/moods'} className="ml-4 text-xs">Change Mood</Button>
                </h1>
            </div>

            {/* Verses Section */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {verses.map(verse => (
                    <Card key={verse.id} className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
                        <CardContent className="pt-6">
                            <blockquote className="text-lg font-medium italic text-slate-700 mb-4">
                                "{verse.verse_text}"
                            </blockquote>
                            <cite className="block text-right text-sm text-slate-500 font-semibold not-italic">
                                — {verse.reference}
                            </cite>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Music Section */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Worship Playlist</h2>
                    <Button onClick={handleRegenerate} disabled={loading} variant="ghost" className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Regenerate
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Player Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {currentVideo ? (
                            <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="w-full pt-[56.25%] bg-slate-200 rounded-xl flex items-center justify-center">
                                <p className="text-slate-500">No videos available</p>
                            </div>
                        )}

                        {currentVideo && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900 line-clamp-1">{currentVideo.title}</h3>
                                    <p className="text-sm text-slate-500">{currentVideo.channel}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={handlePrev}><SkipBack className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" onClick={() => window.open(`https://youtu.be/${currentVideo.id}`, '_blank')}><Heart className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" onClick={handleNext}><SkipForward className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Playlist Column */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {videos.map((vid, idx) => (
                            <Card
                                key={vid.id + idx}
                                className={`cursor-pointer transition-all hover:bg-slate-50 border-transparent ${currentVideoIndex === idx ? 'bg-slate-100 ring-2 ring-slate-900 border-transparent' : ''}`}
                                onClick={() => setCurrentVideoIndex(idx)}
                            >
                                <div className="flex p-2 gap-3">
                                    <div className="relative w-24 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                        <Image src={vid.thumbnail} alt={vid.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h4 className={`text-sm font-medium line-clamp-2 ${currentVideoIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {vid.title}
                                        </h4>
                                        <span className="text-xs text-slate-500 line-clamp-1">{vid.channel}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
