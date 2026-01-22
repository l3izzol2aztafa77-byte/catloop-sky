
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, Orientation, Coordinates, Star } from './types';
import { useStore } from './store';
import { Button, Card, Badge, SectionHeader } from './components/UI';
import AROverlay from './components/AROverlay';
import { STARS_DATA, MISSIONS_DATA } from './data/mock_data';

// --- Icons ---
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
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const { 
    user, missions, completeMission, 
    setCurrentMission, currentMissionId
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

  const handleImageError = (id: string) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const renderOnboarding = () => (
    <motion.div {...pageTransition} className="h-screen flex flex-col items-center justify-center p-12 text-center bg-transparent">
      <div className="relative mb-24">
        <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <h1 className="text-6xl font-orbitron font-extrabold tracking-[0.4em] mb-4 text-white glow-cyan">
          CATLOOP<br /><span className="text-[#00f3ff]">SKY</span>
        </h1>
        <div className="text-[10px] font-orbitron text-cyan-500/80 tracking-[0.5em] uppercase flex items-center justify-center gap-3">
          <div className="h-[1px] w-6 bg-cyan-500/40"></div>
          Deep Space Interface
          <div className="h-[1px] w-6 bg-cyan-500/40"></div>
        </div>
      </div>
      <Button onClick={() => setView('home')} className="w-full max-w-xs !py-6">
        ENGAGE CORE SYSTEMS
      </Button>
    </motion.div>
  );

  const renderHome = () => (
    <motion.div {...pageTransition} className="h-screen pt-24 px-8 pb-32 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-orbitron font-bold text-white tracking-tighter">DECK</h2>
          <div className="text-[10px] text-cyan-500/60 font-orbitron mt-1 tracking-widest">SYSTEMS NOMINAL</div>
        </div>
        <div className="p-3 glass rounded-2xl flex flex-col items-end border-white/5">
           <span className="text-[9px] text-slate-500 font-orbitron uppercase">Exp. Level</span>
           <span className="text-xl font-orbitron font-bold text-[#00f3ff] leading-none">{user.level}</span>
        </div>
      </div>

      <SectionHeader>Orbital Feed</SectionHeader>
      <div className="space-y-6 mb-12">
        <Card className="group relative h-56 overflow-hidden !p-0 !border-0" onClick={() => setSelectedStar(STARS_DATA.find(s => s.id === 'moon') || null)}>
          {!imageError['moon'] ? (
            <img 
              src="https://images.unsplash.com/photo-1522030239044-132a64016752?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
              onError={() => handleImageError('moon')}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center">
              <span className="text-5xl">🌕</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <Badge color="#bc13fe">CELESTIAL EVENT</Badge>
            <h3 className="text-2xl font-bold mt-2 text-white font-orbitron tracking-wide">Waxing Moon</h3>
            <div className="flex justify-between items-end">
              <p className="text-slate-400 text-xs mt-1">94% Luminosity Visible</p>
              <div className="text-[10px] font-orbitron text-cyan-500">TRACKING AVAILABLE</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-5">
          <Card className="!p-6 flex flex-col items-center justify-center space-y-4 glow-border-cyan" onClick={() => setView('ar')}>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 flex items-center justify-center text-cyan-400 border border-cyan-500/20"><IconAR /></div>
            <span className="text-[10px] font-orbitron tracking-widest uppercase font-bold text-white">Initiate Scan</span>
          </Card>
          <Card className="!p-6 flex flex-col items-center justify-center space-y-4 glow-border-cyan" onClick={() => setView('missions')}>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/5 flex items-center justify-center text-purple-400 border border-purple-500/20"><IconMissions /></div>
            <span className="text-[10px] font-orbitron tracking-widest uppercase font-bold text-white">Objective Log</span>
          </Card>
        </div>
      </div>

      <SectionHeader>Mission Directives</SectionHeader>
      <div className="space-y-4">
        {MISSIONS_DATA.slice(0, 2).map(m => (
          <Card key={m.id} className="flex items-center gap-6 !bg-white/[0.03] active:bg-white/[0.08]" onClick={() => { setCurrentMission(m.id); setView('mission_detail'); }}>
            <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center">
               <span className="text-[10px] font-orbitron text-slate-500">ID-{m.id}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">{lang === 'th' ? m.titleTh : m.titleEn}</h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00f3ff] w-1/3 shadow-[0_0_10px_#00f3ff]"></div>
                </div>
                <span className="text-[8px] font-orbitron text-slate-500">ANALYZING</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderARView = () => (
    <div className="relative h-screen bg-black overflow-hidden" key="ar">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale brightness-[0.4]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
      
      {/* HUD Elements */}
      <div className="scanning-line"></div>
      
      <AROverlay orientation={orientation} location={location} lang={lang} activeMission={activeMission} onMissionComplete={handleMissionComplete} />
      
      <div className="absolute top-16 left-8 right-8 z-30 flex justify-between items-start pointer-events-none">
        <button onClick={() => setView('home')} className="p-4 glass rounded-[1.2rem] text-white pointer-events-auto active:scale-90 transition-all border-white/10">
          <IconBack />
        </button>
        <div className="text-right p-3 glass rounded-[1.2rem] border-white/5">
          <div className="text-[8px] font-orbitron text-cyan-400 tracking-[0.2em] mb-1 uppercase">Stellar Position</div>
          <div className="text-[10px] font-orbitron text-white">{location.lat.toFixed(4)}N / {location.lng.toFixed(4)}E</div>
        </div>
      </div>

      <div className="absolute bottom-16 left-8 right-8 z-30">
         <div className="glass !bg-black/60 p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center">
            <div className="w-12 h-1 bg-white/10 rounded-full mb-6"></div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
               <div className="text-[9px] font-orbitron tracking-[0.4em] text-[#00f3ff] uppercase">Telemetry Active</div>
            </div>
            <h4 className="text-2xl font-bold text-white tracking-wide font-orbitron text-center">
              {activeMission ? (lang === 'th' ? activeMission.titleTh : activeMission.titleEn) : 'Deep Sky Navigation'}
            </h4>
         </div>
      </div>

      {/* Grid Pattern HUD */}
      <div className="absolute inset-0 pointer-events-none opacity-20 border-[30px] border-transparent" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );

  return (
    <div className="bg-transparent min-h-screen text-slate-200 overflow-hidden font-prompt">
      <AnimatePresence mode="wait">
        {view === 'onboarding' && renderOnboarding()}
        {view === 'home' && renderHome()}
        {view === 'missions' && (
           <motion.div {...pageTransition} key="missions" className="h-screen pt-24 px-8 overflow-y-auto no-scrollbar pb-32">
              <header className="flex items-center gap-5 mb-12">
                 <button onClick={() => setView('home')} className="p-4 glass rounded-2xl text-white"><IconBack /></button>
                 <h2 className="text-3xl font-orbitron font-bold tracking-tight text-white">LOGBOOK</h2>
              </header>
              <div className="space-y-5">
                {MISSIONS_DATA.map(m => (
                   <Card key={m.id} className="flex items-center gap-6 group border-white/5 active:scale-95 transition-all" onClick={() => { setCurrentMission(m.id); setView('mission_detail'); }}>
                      <div className="w-16 h-16 rounded-[1.4rem] glass flex items-center justify-center text-cyan-500 border border-white/10">
                         <IconAR />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-white font-bold tracking-wide text-lg">{lang === 'th' ? m.titleTh : m.titleEn}</h3>
                         <div className="flex items-center gap-4 mt-2">
                            <span className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Rewards: {m.rewards.xp} XP</span>
                            <Badge color="#bc13fe">RANK {m.difficulty}</Badge>
                         </div>
                      </div>
                   </Card>
                ))}
              </div>
           </motion.div>
        )}
        {view === 'mission_detail' && activeMission && (
           <motion.div {...pageTransition} className="h-screen flex flex-col bg-black">
             <div className="h-2/5 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
               <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40" onError={(e) => (e.currentTarget.style.display='none')} />
               <button onClick={() => setView('missions')} className="absolute top-16 left-8 z-20 p-4 glass rounded-2xl text-white"><IconBack /></button>
               <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-56 h-56 rounded-full border border-cyan-500/20 flex items-center justify-center p-6">
                     <div className="w-full h-full rounded-full bg-cyan-500/5 backdrop-blur-3xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(0,243,255,0.1)]">
                        <div className="w-32 h-32 rounded-full border border-white/5 animate-spin-slow"></div>
                     </div>
                  </div>
               </div>
             </div>
             <div className="flex-1 px-10 pt-8 space-y-8">
               <Badge color="#00f3ff">SECTOR OBJECTIVE</Badge>
               <h2 className="text-5xl font-orbitron font-bold text-white tracking-tight leading-tight">{lang === 'th' ? activeMission.titleTh : activeMission.titleEn}</h2>
               <p className="text-slate-400 font-light leading-relaxed text-xl">
                 {lang === 'th' ? activeMission.descriptionTh : activeMission.descriptionEn}
               </p>
               <div className="pt-10">
                 <Button onClick={() => setView('ar')} className="w-full !py-6 !bg-[#00f3ff] !text-black !rounded-[1.8rem] !shadow-[0_20px_50px_rgba(0,243,255,0.3)]">
                   ENGAGE SCANNER
                 </Button>
               </div>
             </div>
           </motion.div>
        )}
        {view === 'ar' && renderARView()}
        {view === 'profile' && (
           <motion.div {...pageTransition} key="profile" className="h-screen flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-12">
                 <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full animate-pulse"></div>
                 <div className="w-40 h-40 rounded-full glass border border-cyan-500/30 flex items-center justify-center relative z-10">
                    <span className="text-6xl">🚀</span>
                 </div>
              </div>
              <h2 className="text-5xl font-orbitron font-extrabold text-white mb-6 tracking-tighter">MISSION LOGGED</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-xs mx-auto leading-relaxed">Celestial data synchronized successfully. Experience points allocated to core processor.</p>
              <Button onClick={() => setView('home')} className="w-full max-w-xs !py-6">RETURN TO DECK</Button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Dock */}
      {['home', 'missions', 'profile'].includes(view) && (
        <motion.nav 
          initial={{ y: 150 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 h-32 floating-nav rounded-t-[3rem] flex justify-around items-start px-10 pt-8 z-50"
        >
           <NavItem active={view === 'home'} onClick={() => setView('home')} icon={<IconHome />} label="DECK" />
           <div className="relative -top-12">
              <button 
                onClick={() => setView('ar')} 
                className="w-20 h-20 bg-gradient-to-br from-[#00f3ff] to-[#bc13fe] rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-90 transition-all border-[4px] border-black"
              >
                <IconAR />
              </button>
           </div>
           <NavItem active={view === 'profile'} onClick={() => setView('profile')} icon={<IconProfile />} label="LOG" />
        </motion.nav>
      )}

      {/* Star Modal */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-8"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedStar(null)}></div>
            <motion.div 
              initial={{ y: 600 }} animate={{ y: 0 }} exit={{ y: 600 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md glass rounded-[3.5rem] p-12 border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full"></div>
              <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-12"></div>
              <div className="flex justify-between items-start mb-10">
                <div>
                  <Badge color="#00f3ff">{selectedStar.type}</Badge>
                  <h2 className="text-5xl font-orbitron font-bold text-white leading-tight mt-4">{lang === 'th' ? selectedStar.nameTh : selectedStar.nameEn}</h2>
                </div>
                <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center border border-white/10">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: selectedStar.color || 'white', boxShadow: `0 0 40px ${selectedStar.color || 'white'}` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-12">
                <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/5">
                  <div className="text-[10px] font-orbitron text-slate-500 tracking-widest uppercase mb-2">Vis. Mag</div>
                  <div className="text-2xl font-bold text-white">{selectedStar.mag.toFixed(2)}</div>
                </div>
                <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/5">
                  <div className="text-[10px] font-orbitron text-slate-500 tracking-widest uppercase mb-2">Coords</div>
                  <div className="text-2xl font-bold text-white">{selectedStar.ra.toFixed(0)}° / {selectedStar.dec.toFixed(0)}°</div>
                </div>
              </div>
              <Button onClick={() => { setView('ar'); setSelectedStar(null); }} className="w-full !py-6">SYNCHRONIZE TRACKER</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all duration-300 ${active ? 'text-[#00f3ff]' : 'text-slate-500'}`}>
    <div className={`p-3 rounded-[1.2rem] ${active ? 'bg-cyan-500/10 border border-cyan-500/20' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-orbitron font-bold tracking-[0.2em]">{label}</span>
  </button>
);

export default App;
