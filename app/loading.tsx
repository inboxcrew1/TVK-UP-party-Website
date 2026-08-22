export default function Loading() {
  return (
    <div className="min-h-screen bg-[#040105] text-white flex flex-col items-center justify-center space-y-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin" />
        <span className="absolute text-[11px] font-black text-amber-300 font-display">TVK</span>
      </div>
      <p className="text-xs font-mono font-bold text-amber-400/80 tracking-widest uppercase animate-pulse">
        TVK UTTAR PRADESH &bull; LOADING...
      </p>
    </div>
  );
}
