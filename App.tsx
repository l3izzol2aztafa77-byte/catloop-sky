
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Orientation, Coordinates, Star } from './types';
import { useStore } from './store';
import { Button, Card, Badge, SectionHeader } from './components/UI';
import AROverlay from './components/AROverlay';
import { STARS_DATA, MISSIONS_DATA, KNOWLEDGE_DATA } from './data/mock_data';

// Icons
const IconAR = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 8v8M8 12h8"/></svg>;
const IconMap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const IconMissions = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const IconBack = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [orientation, setOrientation] = useState<Orientation>({ alpha: 0, beta: 0, gamma: 0 });
  const [location, setLocation] = useState<Coordinates>({ lat: 13.73, lng: 100.52 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  
  const { 
    user, missions, completeMission, 
    setCurrentMission, currentMissionId,
    setCurrentKnowledge, currentKnowledgeId
  } = useStore();

  const activeMission = missions.find(m => m.id === currentMissionId) || null;
  const activeKnowledge = KNOWLEDGE_DATA.find(k => k.id === currentKnowledgeId) || null;

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
    }
  }, [view]);

  const handleMissionComplete = (id: string) => {
    completeMission(id);
    setCurrentMission(null);
    setView('profile');
  };

  const renderSplash = () => (
    <div className="h-screen flex flex-col items-center justify-between p-12 text-center animate-fade-in bg-black">
      <div className="mt-40">
        <h1 className="text-4xl font-orbitron neon-text-cyan tracking-[0.4em] mb-4">CATLOOP SKY</h1>
        <p className="text-slate-400 font-light text-sm tracking-widest opacity-60">
          Listen to the night. Look at the stars.
        </p>
      </div>
      <div className="w-full max-w-xs mb-20">
        <Button onClick={() => setView('home')} className="w-full py-5 text-sm glass border border-white/10 shadow-glow-cyan">
          {lang === 'th' ? 'เข้าชมท้องฟ้า' : 'EXPLORE'}
        </Button>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="h-screen pt-20 px-8 pb-32 overflow-y-auto no-scrollbar animate-fade-in">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-orbitron tracking-widest">Tonight's Sky</h2>
        </div>
        <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-[#00f3ff]"><IconAR /></div>
      </header>

      <div className="space-y-4">
        <Card className="p-0 overflow-hidden h-44 relative border-none" onClick={() => setSelectedStar(STARS_DATA.find(s => s.id === 'moon') || null)}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522030239044-132a64016752?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h3 className="text-xl font-medium text-white">คืนพระจันทร์</h3>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden h-44 relative border-none" onClick={() => setSelectedStar(STARS_DATA.find(s => s.id === 'jupiter') || null)}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h3 className="text-xl font-medium text-white">ตามหา Jupiter</h3>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden h-44 relative border-none" onClick={() => setSelectedStar(STARS_DATA.find(s => s.id === 'betelgeuse') || null)}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4b519?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h3 className="text-xl font-medium text-white">กลุ่มดาว Orion</h3>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={() => setView('ar')} className="flex-1 glass py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-orbitron tracking-widest text-[#00f3ff]">
          <IconAR /> AR View
        </button>
        <button onClick={() => setView('map')} className="flex-1 glass py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-orbitron tracking-widest">
          <IconMap /> Sky Map
        </button>
        <button onClick={() => setView('missions')} className="flex-1 glass py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-orbitron tracking-widest">
          <IconMissions /> Missions
        </button>
      </div>
    </div>
  );

  const renderMissionDetail = () => {
    if (!activeMission) return null;
    return (
      <div className="h-screen bg-black animate-fade-in flex flex-col">
        <div className="h-[45%] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] to-black"></div>
          <div className="w-56 h-56 rounded-full glass p-4 relative z-10 border-white/5 shadow-[0_0_60px_rgba(188,19,254,0.15)]">
             <div className="w-full h-full rounded-full bg-cover" style={{backgroundImage: `url('https://api.dicebear.com/7.x/identicon/svg?seed=${activeMission.targetObjectId}&backgroundColor=transparent&rowColor=bc13fe')`}}></div>
          </div>
          <button onClick={() => setView('missions')} className="absolute top-14 left-8 z-20 p-3 glass rounded-full text-white"><IconBack /></button>
        </div>
        <div className="flex-1 p-10 space-y-8">
          <div>
            <span className="text-[10px] font-orbitron text-[#bc13fe] tracking-[0.3em] uppercase mb-2 block">Mission Objective</span>
            <h2 className="text-3xl font-orbitron text-white">{lang === 'th' ? activeMission.titleTh : activeMission.titleEn}</h2>
          </div>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            {lang === 'th' ? activeMission.descriptionTh : activeMission.descriptionEn}
          </p>
          <div className="pt-10">
            <Button onClick={() => setView('ar')} className="w-full py-5 bg-[#bc13fe] shadow-glow-purple">
              {lang === 'th' ? 'เริ่มภารกิจ' : 'START MISSION'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderMap = () => (
    <div className="h-screen bg-black animate-fade-in pt-20 px-8">
       <header className="mb-10 flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-3 glass rounded-full text-white"><IconBack /></button>
          <h2 className="text-2xl font-orbitron tracking-widest">Stellar Map</h2>
       </header>
       <div className="aspect-square w-full rounded-full border border-white/5 relative flex items-center justify-center bg-[#0a0e1a]/40">
          <div className="absolute inset-0 rounded-full border border-white/5 m-10"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-20"></div>
          {STARS_DATA.map(s => (
             <div key={s.id} className="absolute w-2 h-2 rounded-full" style={{
                left: `${(s.ra / 360) * 100}%`,
                top: `${((s.dec + 90) / 180) * 100}%`,
                backgroundColor: s.color || 'white',
                boxShadow: `0 0 10px ${s.color || 'white'}`
             }}></div>
          ))}
          <div className="text-[10px] text-slate-500 font-orbitron absolute bottom-[-40px]">Go To AR</div>
       </div>
       <div className="mt-20">
          <Button onClick={() => setView('ar')} className="w-full">OPEN AR VIEW</Button>
       </div>
    </div>
  );

  return (
    <div className="bg-transparent min-h-screen text-slate-200">
      {view === 'onboarding' && renderSplash()}
      {view === 'home' && renderHome()}
      {view === 'missions' && (
        <div className="h-screen pt-20 px-8 pb-32 overflow-y-auto no-scrollbar animate-fade-in">
           <header className="mb-10 flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-3 glass rounded-full text-white"><IconBack /></button>
              <h2 className="text-2xl font-orbitron tracking-widest">Missions</h2>
           </header>
           <div className="space-y-4">
             {MISSIONS_DATA.map(m => (
                <Card key={m.id} className="flex items-center gap-6" onClick={() => { setCurrentMission(m.id); setView('mission_detail'); }}>
                   <div className="w-14 h-14 rounded-full glass flex items-center justify-center border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                   </div>
                   <div className="flex-1">
                      <h3 className="text-white font-medium">{lang === 'th' ? m.titleTh : m.titleEn}</h3>
                      <p className="text-[10px] text-slate-500 font-orbitron mt-1 uppercase">LEVEL {m.difficulty}</p>
                   </div>
                </Card>
             ))}
           </div>
        </div>
      )}
      {view === 'mission_detail' && renderMissionDetail()}
      {view === 'map' && renderMap()}
      {view === 'ar' && (
        <div className="relative h-screen bg-black overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale brightness-50" />
          <AROverlay orientation={orientation} location={location} lang={lang} activeMission={activeMission} onMissionComplete={handleMissionComplete} />
          
          <button onClick={() => setView('home')} className="absolute top-14 left-8 z-30 p-4 glass rounded-full text-white active:scale-90 transition-transform">
            <IconBack />
          </button>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] glass p-6 rounded-[2.5rem] z-30 border-white/5 text-center flex flex-col items-center">
             <div className="w-10 h-1 bg-white/10 rounded-full mb-4"></div>
             <p className="text-xs font-orbitron tracking-[0.2em] text-[#00f3ff] uppercase mb-1">Scanning Sector</p>
             <h4 className="text-xl font-medium text-white">{activeMission ? (lang === 'th' ? activeMission.titleTh : activeMission.titleEn) : 'Stellar Navigation Active'}</h4>
          </div>
        </div>
      )}

      {/* Profile/Stats View Placeholder */}
      {view === 'profile' && (
        <div className="h-screen pt-20 px-8 flex flex-col items-center justify-center text-center animate-fade-in">
           <div className="w-32 h-32 rounded-full glass border border-[#bc13fe]/30 mb-8 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
           </div>
           <h2 className="text-3xl font-orbitron text-white mb-4">MISSION COMPLETE</h2>
           <p className="text-slate-400 mb-10">You have earned {user.xp} XP and new knowledge data.</p>
           <Button onClick={() => setView('home')} className="w-full">RETURN TO STATION</Button>
        </div>
      )}

      {/* Floating Navigation (Bottom Sheet Style) */}
      {['home', 'missions', 'map', 'library'].includes(view) && (
        <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm floating-nav rounded-[2.5rem] p-2 flex justify-between items-center z-50 animate-fade-in">
           <NavItem active={view === 'home'} onClick={() => setView('home')} icon={<IconHome size={20} />} />
           <NavItem active={view === 'map'} onClick={() => setView('map')} icon={<IconMap />} />
           <div className="relative -top-10">
              <button onClick={() => setView('ar')} className="w-16 h-16 bg-[#00f3ff] rounded-full flex items-center justify-center text-black shadow-glow-cyan active:scale-90 transition-all">
                <IconAR />
              </button>
           </div>
           <NavItem active={view === 'missions'} onClick={() => setView('missions')} icon={<IconMissions />} />
           <NavItem active={view === 'profile'} onClick={() => setView('profile')} icon={<IconProfile size={20} />} />
        </nav>
      )}

      {/* Detail Modal */}
      {selectedStar && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStar(null)}></div>
          <div className="relative w-full max-w-md glass rounded-[3rem] p-10 border-white/10 shadow-2xl">
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-orbitron text-[#bc13fe] tracking-[0.3em] uppercase mb-2 block">{selectedStar.type}</span>
                <h2 className="text-3xl font-orbitron text-white">{lang === 'th' ? selectedStar.nameTh : selectedStar.nameEn}</h2>
              </div>
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center border border-white/10">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedStar.color || 'white', boxShadow: `0 0 20px ${selectedStar.color || 'white'}` }}></div>
              </div>
            </div>
            <p className="text-slate-400 font-light leading-relaxed mb-10">
              {lang === 'th' ? 'วัตถุท้องฟ้าสำคัญ สังเกตเห็นได้ง่ายในคืนนี้ เหมาะสำหรับผู้เริ่มต้นศึกษาดาราศาสตร์' : 'A prominent celestial body tonight, easily observable for astronomy beginners.'}
            </p>
            <Button onClick={() => { setView('ar'); setSelectedStar(null); }} className="w-full py-5 bg-[#bc13fe] text-white">TRACK IN AR</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Extra Icons
const IconHome = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconProfile = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`p-4 rounded-3xl transition-all duration-300 ${active ? 'text-[#00f3ff] bg-white/5' : 'text-slate-600'}`}>
    {icon}
  </button>
);

export default App;
