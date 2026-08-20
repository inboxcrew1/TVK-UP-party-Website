import Link from 'next/link';
import { Shield, ArrowLeft, Newspaper, Calendar, Image as ImageIcon, MapPin } from 'lucide-react';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

async function getCMSData() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishAt: 'desc' },
    });

    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { eventDate: 'asc' },
    });

    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { announcements, events, albums };
  } catch (error) {
    console.error('Failed to fetch CMS data:', error);
    return { announcements: [], events: [], albums: [] };
  }
}

export default async function CMSPage() {
  const { announcements, events, albums } = await getCMSData();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative">
      {/* Background Tints */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#A00000]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A00000] via-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-[#A00000]/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-widest uppercase font-display text-[#A00000]">
              TVK UTTAR PRADESH
            </h1>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Press & Media Releases</p>
          </div>
        </Link>

        <Link
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-16">
        {/* Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-amber-600" /> Official Press & Events
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900">
            News, Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A00000] via-red-600 to-amber-600">Announcements</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Stay updated with official resolutions, regional conferences, and media press releases from TVK Uttar Pradesh.
          </p>
        </div>

        {/* Announcements Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#A00000] uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
            <Newspaper className="w-5 h-5 text-[#A00000]" /> Press Releases & Announcements
          </h3>

          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-400 transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 uppercase mb-3">
                      <span>{item.category}</span>
                      <span className="text-slate-500">{new Date(item.publishAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 mb-4">{item.content}</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-100 pt-3">
                    Author: {item.author}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-4">No press announcements currently scheduled.</div>
          )}
        </div>

        {/* Events Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#A00000] uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
            <Calendar className="w-5 h-5 text-[#A00000]" /> State & District Events
          </h3>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-400 transition-all shadow-sm">
                  <div className="text-[10px] font-bold text-amber-700 uppercase mb-2">
                    {new Date(event.eventDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{event.title}</h4>
                  <p className="text-slate-600 text-xs mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A00000] shrink-0" /> {event.location}
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{event.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-4">No public events currently scheduled.</div>
          )}
        </div>

        {/* Gallery Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#A00000] uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
            <ImageIcon className="w-5 h-5 text-[#A00000]" /> Photo Gallery Albums
          </h3>

          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-400 transition-all shadow-sm">
                  <div className="text-[10px] font-bold text-amber-700 uppercase mb-2">{album.category}</div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{album.title}</h4>
                  {album.description && <p className="text-slate-600 text-xs mb-4 line-clamp-2">{album.description}</p>}
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{album.images.length} Media Assets</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-4">Gallery albums will be published shortly.</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 text-center border-t border-slate-800 relative z-10">
        <p className="max-w-md mx-auto leading-relaxed">
          &copy; {new Date().getFullYear()} Tamilaga Vetri Kazhagam. News & CMS Directory.
        </p>
      </footer>
    </div>
  );
}
