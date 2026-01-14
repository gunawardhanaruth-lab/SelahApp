'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center relative">
      <header className="absolute top-4 right-4">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
            Sign In
          </Button>
        </Link>
      </header>
      <main className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          Selah
        </h1>
        <p className="text-xl text-slate-600">
          Select your mood and get worship music + Bible verses to uplift your spirit.
        </p>
        <div className="mt-8 space-y-4">
          <Link href="/moods">
            <Button size="lg" className="w-full text-lg h-14 bg-slate-900 hover:bg-slate-800 transition-all">
              Get Started (Guest)
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>Want to save your history?</span>
            <Link href="/login" className="font-semibold text-slate-900 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-slate-400">
        © {new Date().getFullYear()} Selah App
      </footer>
    </div>
  );
}
