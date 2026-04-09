import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Sparkles } from 'lucide-react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import MatchResultPage from './pages/MatchResultPage';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
    { path: '/jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-brand-600 hover:opacity-80 transition-opacity">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">SkillBridge AI</span>
          </Link>
          <div className="flex gap-1 sm:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base ${
                  location.pathname === item.path
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        
        <Navigation />
        
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-12 z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/match/:id" element={<MatchResultPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
