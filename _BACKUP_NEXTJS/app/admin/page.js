import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Need to ensure Table is installed? Actually shadcn table is separate component.
// I will stick to simple HTML table or install table component.
// I will just use divs for simplicity or assume table is not crucial styling.
// Or I can add table component: npx shadcn@latest add table
// I'll skip installing more components and use standard HTML table with Tailwind classes.

export const revalidate = 0;

async function getStats() {
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: moodCount } = await supabase.from('moods').select('*', { count: 'exact', head: true });
    const { count: verseCount } = await supabase.from('verses').select('*', { count: 'exact', head: true });
    return { userCount, moodCount, verseCount };
}

async function getMoods() {
    const { data } = await supabase.from('moods').select('*').order('created_at', { ascending: false });
    return data || [];
}

export default async function AdminPage() {
    const stats = await getStats();
    const moods = await getMoods();

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardHeader><CardTitle>Total Moods</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.moodCount}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Verses</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.verseCount}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Users</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.userCount || 0}</p></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Moods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="p-4 font-medium text-slate-500">Emoji</th>
                                    <th className="p-4 font-medium text-slate-500">Name</th>
                                    <th className="p-4 font-medium text-slate-500">Keywords</th>
                                    <th className="p-4 font-medium text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {moods.map(mood => (
                                    <tr key={mood.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4 text-2xl">{mood.emoji}</td>
                                        <td className="p-4 font-medium">{mood.name}</td>
                                        <td className="p-4 text-slate-500 text-sm max-w-xs truncate" title={mood.youtube_keywords}>{mood.youtube_keywords}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${mood.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {mood.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
