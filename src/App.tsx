import React, { useState } from 'react';
import { Shield, Activity, FileText, Camera, CheckCircle, AlertTriangle, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VisionScanner from './components/VisionScanner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'AUDIT' | 'SCAN' | 'REPORT'>('HOME');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* --- RADIAL GLOW --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[150px] rounded-full" />
      </div>

      {/* --- NAV BAR --- */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col items-center py-8 z-50">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-12 shadow-xl shadow-blue-500/20 cursor-pointer hover:rotate-12 transition-transform">
          <Shield className="text-white" size={24} />
        </div>
        
        <div className="flex flex-col gap-6">
          <NavItem icon={<Activity size={22} />} active={activeTab === 'AUDIT'} onClick={() => setActiveTab('AUDIT')} label="Audit" />
          <NavItem icon={<Camera size={22} />} active={activeTab === 'SCAN'} onClick={() => setActiveTab('SCAN')} label="AI Scanner" />
          <NavItem icon={<FileText size={22} />} active={activeTab === 'REPORT'} onClick={() => setActiveTab('REPORT')} label="Gazette" />
        </div>

        <div className="mt-auto flex flex-col gap-6">
           <NavItem icon={<User size={22} />} active={false} onClick={() => {}} label="Profile" />
        </div>
      </nav>

      {/* --- CONTENT HUB --- */}
      <main className="ml-20 p-10 relative z-10 min-h-screen">
        <header className="max-w-6xl mx-auto mb-16 flex justify-between items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
              CADET <span className="text-blue-500">PROTOCOL</span>
            </h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Stealth-Ops Medical Readiness v4.2</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800" />)}
             </div>
             <div className="h-10 w-[1px] bg-slate-800 mx-2" />
             <div className="text-right">
                <div className="text-xs text-slate-500 font-mono">NODE_LOCATION</div>
                <div className="text-sm font-bold text-blue-400">AMB_DHAULA_KUAN</div>
             </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'HOME' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <DashboardCard 
                  title="Systemic Audit" 
                  desc="Execute Level 4 clinical audit matching AFMS 2024 Gazette." 
                  icon={<Activity className="text-blue-500" size={32} />} 
                  color="blue"
                  onClick={() => setActiveTab('AUDIT')}
                />
                <DashboardCard 
                  title="Vision Scan" 
                  desc="Real-time skeletal AI for Carry Angle & Ortho detection." 
                  icon={<Camera className="text-indigo-500" size={32} />} 
                  color="indigo"
                  onClick={() => setActiveTab('SCAN')}
                />
                <DashboardCard 
                  title="Archives" 
                  desc="Search global medical standards and hospital registries." 
                  icon={<FileText className="text-emerald-500" size={32} />} 
                  color="emerald"
                  onClick={() => setActiveTab('REPORT')}
                />
              </motion.div>
            )}

            {activeTab === 'SCAN' && (
              <motion.div 
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="mb-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                   <div>
                     <h2 className="text-2xl font-bold">AI Ortho-Scanner</h2>
                     <p className="text-slate-500 text-sm">Real-time Computer Vision Inference Active</p>
                   </div>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded-full border border-blue-500/20 font-bold tracking-tighter">GPU_ACCELERATED</span>
                   </div>
                </div>
                <VisionScanner />
              </motion.div>
            )}

            {activeTab === 'AUDIT' && (
               <motion.div 
               key="audit"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20"
             >
               <AlertTriangle className="text-slate-700 mb-4" size={48} />
               <p className="text-slate-500 font-mono italic">LOADING_COMPREHENSIVE_AUDIT_PROTOCOL_V4...</p>
             </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ${
        active 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
          : 'text-slate-600 hover:text-slate-300'
      }`}
    >
      {icon}
      {active && (
        <motion.div layoutId="nav-glow" className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full" />
      )}
      <span className="absolute left-20 bg-slate-800 text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-50 pointer-events-none">
        {label}
      </span>
    </button>
  );
}

function DashboardCard({ title, desc, icon, onClick, color }) {
  const colorMap = {
    blue: "hover:border-blue-500/40 hover:bg-blue-500/[0.02] shadow-blue-500/10",
    indigo: "hover:border-indigo-500/40 hover:bg-indigo-500/[0.02] shadow-indigo-500/10",
    emerald: "hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] shadow-emerald-500/10"
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`bg-slate-900/40 backdrop-blur-3xl border border-slate-800/80 p-8 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden ${colorMap[color]}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] blur-3xl pointer-events-none" />
      
      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-800 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">{desc}</p>
      
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        INITIATE PROTOCOL <span className="text-lg">→</span>
      </div>
    </motion.div>
  );
}
