import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Mic, FileText, MessageSquare, Settings } from 'lucide-react';

const Layout = ({ children, onUpgradeClick }) => {
    const location = useLocation();

    const getHeaderTitle = () => {
        switch (location.pathname) {
            case '/': return 'Enregistrement';
            case '/notes': return 'Mes Notes';
            case '/chat': return 'Assistant IA';
            case '/settings': return 'Paramètres';
            default:
                if (location.pathname.includes('/analyze')) return 'Analyse';
                if (location.pathname.includes('/notes/')) return 'Détail Note';
                return 'Voice Notes';
        }
    };

    const getHeaderSubtitle = () => {
        switch (location.pathname) {
            case '/': return 'Parlez, on s\'occupe du reste';
            case '/notes': return 'Vos enregistrements sauvegardés';
            case '/chat': return 'Discutez avec vos notes';
            case '/settings': return 'Gérez votre compte';
            default:
                if (location.pathname.includes('/analyze')) return 'Analyse avancée IA';
                return '';
        }
    };

    return (
        <div className="relative min-h-screen min-h-dvh flex flex-col items-center justify-center bg-background text-white/90 font-sans overflow-hidden">
            {/* Mobile Container - iOS optimized */}
            <div className="w-full h-full sm:h-[100dvh] sm:max-w-md bg-background relative flex flex-col overflow-hidden sm:border-x sm:border-white/5 sm:shadow-2xl noise-overlay font-sans">

                {/* Ambient Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-0 w-[200px] h-[200px] bg-secondary/5 rounded-full blur-[80px]" />
                </div>

                {/* Header - with iOS safe area */}
                <header className="relative z-20 pt-safe px-6 pb-4">
                    <div className="pt-4 flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight gradient-text">
                            {getHeaderTitle()}
                        </h1>
                        <p className="text-xs text-white/40 font-light tracking-wide">
                            {getHeaderSubtitle()}
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 relative z-10 overflow-y-auto px-5 pb-32 scrollbar-hide overscroll-none">
                    {children}
                </main>

                {/* Bottom Navigation - with iOS safe area */}
                <nav className="absolute bottom-0 left-0 right-0 z-30">
                    {/* Gradient fade effect */}
                    <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                    <div className="liquid-glass pt-3 px-4 flex justify-around items-center pb-safe" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                        <NavItem to="/" icon={Mic} label="Record" />
                        <NavItem to="/notes" icon={FileText} label="Notes" />
                        <NavItem to="/chat" icon={MessageSquare} label="Chat" />
                        <NavItem to="/settings" icon={Settings} label="Compte" />
                    </div>
                </nav>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200
      active:scale-95
      ${isActive
                ? 'text-white'
                : 'text-white/35 hover:text-white/60'}
    `}
    >
        {({ isActive }) => (
            <>
                {isActive && (
                    <div className="absolute inset-0 bg-primary/15 rounded-2xl" />
                )}
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`relative z-10 transition-all duration-200 ${isActive ? 'text-primary-light' : ''}`}
                />
                <span className={`relative z-10 text-[9px] font-medium tracking-wider uppercase ${isActive ? 'text-primary-light' : ''}`}>
                    {label}
                </span>
            </>
        )}
    </NavLink>
);

export default Layout;
