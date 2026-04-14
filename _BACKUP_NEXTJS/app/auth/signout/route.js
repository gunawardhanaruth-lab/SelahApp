import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request) {
    const supabase = await createClient()

    // Check if we have a session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    return redirect('/')
}
