import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

async function getMoods() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('moods')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
    return data || [];
}

export default async function MoodsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const moods = await getMoods();

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center relative">
            <header className="w-full max-w-4xl flex justify-end mb-4">
                {user ? (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm pr-4">
                        <Avatar>
                            <AvatarImage src={user.user_metadata.avatar_url} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm">
                            <span className="font-semibold">{user.user_metadata.full_name || 'User'}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 text-slate-400 hover:text-slate-900">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button variant="outline" size="sm">Sign In</Button>
                    </Link>
                )}
            </header>

            <div className="max-w-4xl w-full">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl font-bold text-slate-800">
                        How are you feeling today{user ? `, ${user.user_metadata.full_name?.split(' ')[0]}` : ''}?
                    </h1>
                    <p className="text-slate-500">Select a card to receive your worship playlist.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {moods.map((mood) => (
                        <Link key={mood.id} href={`/dashboard?mood_id=${mood.id}`}>
                            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-slate-200 h-full group">
                                <CardContent className="flex flex-col items-center justify-center p-6 h-48">
                                    <span className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={mood.name}>
                                        {mood.emoji}
                                    </span>
                                    <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">
                                        {mood.name}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {moods.length === 0 && (
                    <div className="text-center p-10">
                        <p className="text-slate-500">System is getting ready...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
