import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#040105] text-white flex flex-col justify-between font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 my-20">
        <div className="max-w-lg w-full bg-slate-900/90 border-2 border-amber-400/60 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="text-6xl md:text-8xl font-black text-amber-400 font-display tracking-tight">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-white font-display">
              पृष्ठ नहीं मिला (Page Not Found)
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              यह पृष्ठ उपलब्ध नहीं है या इसका पता बदल दिया गया है। (The requested page could not be found.)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/"
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Home className="w-4 h-4" />
              <span>मुख्य पृष्ठ (Home)</span>
            </Link>
            <Link
              href="/sadasyata"
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-400/40 transition-all"
            >
              <span>सदस्यता लें (Join TVK)</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
