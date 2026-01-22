
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, Orientation, Coordinates, Star } from './types';
import { useStore } from './store';
import { Button, Card, Badge, SectionHeader } from './components/UI';
import AROverlay from './components/AROverlay';
import { STARS_DATA, MISSIONS_DATA, KNOWLEDGE_DATA } from './data/mock_data';

// --- Icons (Custom Sci-fi Set) ---
const IconAR = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 8v8M8 12h8"/></svg>;
const IconMap = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>;
const IconMissions = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const IconBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>;
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconProfile = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [lang] = useState<'th' | 'en'>('th');
  const [orientation, setOrientation] = useState<Orientation>({ alpha: 0, beta: 0, gamma: 0 });
  const [location, setLocation] = useState<Coordinates>({ lat: 13.73, lng: 100.52 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  
  const { 
    user, missions, completeMission, 
    setCurrentMission, currentMissionId,
    currentKnowledgeId
  } = useStore();

  const activeMission = missions.find(m => m.id === currentMissionId) || null;

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma || 0 });
      }
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    if (view === 'ar') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { if (videoRef.current) videoRef.current.srcObject = s; })
        .catch(e => console.error(e));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    }
  }, [view]);

  const handleMissionComplete = (id: string) => {
    completeMission(id);
    setCurrentMission(null);
    setView('profile');
  };

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const renderOnboarding = () => (
    <motion.div {...pageTransition} className="h-screen flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-20">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full"></div>
        <h1 className="text-5xl font-orbitron font-bold tracking-[0.3em] mb-4 relative z-10 text-white leading-tight">
          CATLOOP<br /><span className="text-[#00f3ff]">SKY</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-[10px] font-orbitron text-cyan-500/60 tracking-[0.4em] uppercase">
          <div className="h-[1px] w-8 bg-cyan-500/30"></div>
          Stellar Systems Active
          <div className="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>
      <Button onClick={() => setView('home')} className="w-full max-w-xs group relative overflow-hidden">
        <span className="relative z-10">INITIALIZE EXPLORATION</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      </Button>
    </motion.div>
  );

  const renderHome = () => (
    <motion.div {...pageTransition} className="h-screen pt-20 px-6 pb-32 overflow-y-auto no-scrollbar">
      <header className="mb-12">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-3xl font-orbitron font-bold tracking-wider text-white">DECK</h2>
          <Badge color="#00f3ff">LVL {user.level}</Badge>
        </div>
        <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">Atmosphere: Clear | Sector 7G</p>
      </header>

      <SectionHeader>Featured Tonight</SectionHeader>
      <div className="space-y-5 mb-10">
        <Card className="group relative h-48 overflow-hidden !p-0 border-white/5" onClick={() => setSelectedStar(STARS_DATA.find(s => s.id === 'moon') || null)}>
          <img src="https://images.unsplash.com/photo-1522030239044-132a64016752?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <Badge color="#bc13fe">EVENT</Badge>
            <h3 className="text-2xl font-bold mt-2 text-white">Supermoon Peak</h3>
            <p className="text-slate-400 text-xs mt-1">98% Illumination | 12:45 AM</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="!p-5 flex flex-col items-center text-center justify-center space-y-3" onClick={() => setView('ar')}>
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400"><IconAR /></div>
            <span className="text-xs font-orbitron tracking-widest uppercase text-white">Scan Sky</span>
          </Card>
          <Card className="!p-5 flex flex-col items-center text-center justify-center space-y-3" onClick={() => setView('missions')}>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400"><IconMissions /></div>
            <span className="text-xs font-orbitron tracking-widest uppercase text-white">Missions</span>
          </Card>
        </div>
      </div>

      <SectionHeader>Active Objectives</SectionHeader>
      <div className="space-y-4">
        {MISSIONS_DATA.slice(0, 2).map(m => (
          <Card key={m.id} className="flex items-center gap-5 !bg-white/[0.02]" onClick={() => { setCurrentMission(m.id); setView('mission_detail'); }}>
            <div className="w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-slate-500 text-xs font-orbitron">0{m.id.replace('m','')}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{lang === 'th' ? m.titleTh : m.titleEn}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500/40 w-1/3"></div>
                </div>
                <span className="text-[9px] font-orbitron text-slate-500">33%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderMissionDetail = () => {
    if (!activeMission) return null;
    return (
      <motion.div {...pageTransition} className="h-screen flex flex-col bg-black">
        <div className="h-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
          <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <button onClick={() => setView('missions')} className="absolute top-14 left-8 z-20 p-3 glass rounded-full text-white"><IconBack /></button>
          <div className="absolute inset-0 flex items-center justify-center z-20">
             <div className="w-48 h-48 rounded-full border border-purple-500/30 flex items-center justify-center p-4">
                <div className="w-full h-full rounded-full bg-purple-500/10 backdrop-blur-3xl border border-purple-500/20 shadow-[0_0_80px_rgba(188,19,254,0.15)] flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-white opacity-10 animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>
        <div className="flex-1 px-8 pt-6 space-y-6">
          <Badge color="#bc13fe">LEVEL {activeMission.difficulty} OBJECTIVE</Badge>
          <h2 className="text-4xl font-orbitron font-bold text-white tracking-tight">{lang === 'th' ? activeMission.titleTh : activeMission.titleEn}</h2>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            {lang === 'th' ? activeMission.descriptionTh : activeMission.descriptionEn}
          </p>
          <div className="pt-8">
            <Button onClick={() => setView('ar')} className="w-full py-5 !bg-[#bc13fe] !text-white !shadow-glow-purple !rounded-2xl">
              INITIATE AR INTERFACE
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-transparent min-h-screen text-slate-200 overflow-hidden font-prompt">
      <AnimatePresence mode="wait">
        {view === 'onboarding' && renderOnboarding()}
        {view === 'home' && renderHome()}
        {view === 'missions' && (
          <motion.div {...pageTransition} key="missions" className="h-screen pt-20 px-6 overflow-y-auto no-scrollbar pb-32">
             <header className="flex items-center gap-4 mb-10">
                <button onClick={() => setView('home')} className="p-3 glass rounded-xl text-white"><IconBack /></button>
                <h2 className="text-2xl font-orbitron font-bold tracking-widest text-white">MISSIONS</h2>
             </header>
             <div className="space-y-4">
               {MISSIONS_DATA.map(m => (
                  <Card key={m.id} className="flex items-center gap-5 group border-white/5 hover:border-cyan-500/30" onClick={() => { setCurrentMission(m.id); setView('mission_detail'); }}>
                     <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-cyan-500 border border-white/10 group-hover:scale-105 transition-transform">
                        <IconAR />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-white font-bold tracking-wide">{lang === 'th' ? m.titleTh : m.titleEn}</h3>
                        <p className="text-[10px] font-orbitron text-slate-500 mt-1">XP +{m.rewards.xp} | DIFFICULTY {m.difficulty}</p>
                     </div>
                  </Card>
               ))}
             </div>
          </motion.div>
        )}
        {view === 'mission_detail' && renderMissionDetail()}
        {view === 'ar' && (
          <div className="relative h-screen bg-black overflow-hidden" key="ar">
            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-[0.3]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
            
            <AROverlay orientation={orientation} location={location} lang={lang} activeMission={activeMission} onMissionComplete={handleMissionComplete} />
            
            {/* HUD Elements */}
            <div className="absolute top-14 left-8 right-8 z-30 flex justify-between items-start pointer-events-none">
              <button onClick={() => setView('home')} className="p-4 glass rounded-2xl text-white pointer-events-auto active:scale-90 transition-all border-white/10">
                <IconBack />
              </button>
              <div className="text-right">
                <div className="text-[10px] font-orbitron text-cyan-400 tracking-[0.2em] mb-1 uppercase">Stellar Positioning</div>
                <div className="text-xs font-orbitron text-white">LAT {location.lat.toFixed(2)} | LNG {location.lng.toFixed(2)}</div>
              </div>
            </div>

            <div className="absolute bottom-12 left-6 right-6 z-30">
               <div className="glass !bg-black/40 p-6 rounded-[2.5rem] border-white/5 flex flex-col items-center">
                  <div className="w-10 h-1 bg-white/10 rounded-full mb-4"></div>
                  <div className="text-[10px] font-orbitron tracking-[0.3em] text-[#00f3ff] uppercase mb-2">Interface Active</div>
                  <h4 className="text-xl font-bold text-white tracking-wide">
                    {activeMission ? (lang === 'th' ? activeMission.titleTh : activeMission.titleEn) : 'Stellar Navigation Mode'}
                  </h4>
               </div>
            </div>

            {/* Corner HUD Decorations */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 h-40 w-[1px] bg-white/10"></div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 h-40 w-[1px] bg-white/10"></div>
          </div>
        )}

        {view === 'profile' && (
          <motion.div {...pageTransition} key="profile" className="h-screen flex flex-col items-center justify-center p-12 text-center">
             <div className="relative mb-10">
                <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse"></div>
                <div className="w-32 h-32 rounded-full glass border border-purple-500/40 flex items-center justify-center relative z-10">
                   <span className="text-5xl">🌌</span>
                </div>
             </div>
             <h2 className="text-4xl font-orbitron font-bold text-white mb-4 tracking-tighter">DATA SYNCED</h2>
             <p className="text-slate-400 mb-12 max-w-xs mx-auto">Objective verified. You have earned {user.xp} units of XP and new knowledge core.</p>
             <Button onClick={() => setView('home')} className="w-full max-w-xs">RETURN TO DECK</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-End Floating Nav Dock */}
      {['home', 'missions', 'map', 'library', 'profile'].includes(view) && (
        <motion.nav 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-10 left-6 right-6 h-20 floating-nav rounded-[2.5rem] flex justify-between items-center px-6 z-50 overflow-hidden"
        >
           <NavItem active={view === 'home'} onClick={() => setView('home')} icon={<IconHome />} label="DECK" />
           <NavItem active={view === 'missions'} onClick={() => setView('missions')} icon={<IconMissions />} label="JOBS" />
           
           <div className="relative -top-3">
              <button 
                onClick={() => setView('ar')} 
                className="w-16 h-16 bg-[#00f3ff] rounded-[1.8rem] flex items-center justify-center text-black shadow-glow-cyan active:scale-95 transition-all border-[4px] border-black"
              >
                <IconAR />
              </button>
           </div>

           <NavItem active={false} onClick={() => {}} icon={<IconMap />} label="MAP" />
           <NavItem active={view === 'profile'} onClick={() => setView('profile')} icon={<IconProfile />} label="LOG" />
           
           <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
        </motion.nav>
      )}

      {/* Detail Modal (Object Focus) */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedStar(null)}></div>
            <motion.div 
              initial={{ y: 500 }} animate={{ y: 0 }} exit={{ y: 500 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md glass rounded-[3rem] p-10 border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-500/10 blur-3xl rounded-full"></div>
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-10"></div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-orbitron text-cyan-500 tracking-[0.3em] uppercase mb-2 block">{selectedStar.type}</span>
                  <h2 className="text-4xl font-orbitron font-bold text-white leading-none">{lang === 'th' ? selectedStar.nameTh : selectedStar.nameEn}</h2>
                </div>
                <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center border border-white/10">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedStar.color || 'white', boxShadow: `0 0 30px ${selectedStar.color || 'white'}` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] font-orbitron text-slate-500 tracking-widest uppercase mb-1">Magnitude</div>
                  <div className="text-xl font-bold text-white">{selectedStar.mag.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] font-orbitron text-slate-500 tracking-widest uppercase mb-1">RA / DEC</div>
                  <div className="text-xl font-bold text-white">{selectedStar.ra.toFixed(0)}° / {selectedStar.dec.toFixed(0)}°</div>
                </div>
              </div>
              <Button onClick={() => { setView('ar'); setSelectedStar(null); }} className="w-full py-5 !bg-white !text-black !rounded-2xl">TRACK TARGET IN AR</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-[#00f3ff]' : 'text-slate-500'}`}>
    <div className={`p-2 rounded-xl ${active ? 'bg-cyan-500/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[8px] font-orbitron tracking-widest">{label}</span>
  </button>
);

export default App;
