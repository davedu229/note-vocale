
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Mic, FileText, MessageSquare, Settings, Menu } from 'lucide-react';

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
        <div className="relative min-h-screen min-h-dvh flex flex-col md:flex-row bg-background text-white/90 font-sans overflow-hidden">
            {/* Ambient Background - Full Screen */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-0 w-[200px] h-[200px] bg-secondary/5 rounded-full blur-[80px]" />
                <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none"></div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-background/50 backdrop-blur-md z-30 pt-safe pb-safe relative">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight gradient-text">Voice Notes</h1>
                    <p className="text-xs text-white/40 font-light mt-1">Assistant Personnel IA</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <SidebarItem to="/" icon={Mic} label="Enregistrement" />
                    <SidebarItem to="/notes" icon={FileText} label="Mes Notes" />
                    <SidebarItem to="/chat" icon={MessageSquare} label="Assistant IA" />
                    <SidebarItem to="/settings" icon={Settings} label="Paramètres" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                        <p className="text-xs font-medium text-white/80 mb-1">Passer Premium</p>
                        <p className="text-xxs text-white/40 mb-3">Débloquez l'illimité</p>
                        <button
                            onClick={onUpgradeClick}
                            className="w-full py-2 px-3 bg-primary/20 hover:bg-primary/30 text-primary-light text-xs font-medium rounded-lg transition-colors text-center"
                        >
                            Voir les offres
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-20 h-full overflow-hidden">
                {/* Header - Mobile Only or Hybrid */}
                <header className="md:hidden relative z-20 pt-safe px-6 pb-4 flex-shrink-0">
                    <div className="pt-4 flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight gradient-text">
                            {getHeaderTitle()}
                        </h1>
                        <p className="text-xs text-white/40 font-light tracking-wide">
                            {getHeaderSubtitle()}
                        </p>
                    </div>
                </header>

                {/* Desktop Header (Minimal) */}
                <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/5 bg-background/30 backdrop-blur-sm">
                    <div>
                        <h2 className="text-xl font-semibold text-white/90">{getHeaderTitle()}</h2>
                        <p className="text-sm text-white/50 font-light">{getHeaderSubtitle()}</p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 relative overflow-y-auto px-5 md:px-8 pb-32 md:pb-8 scrollbar-hide overscroll-none">
                    <div className="max-w-5xl mx-auto h-full flex flex-col">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
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
    );
};

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      relative flex flex - col items - center gap - 1 px - 3 py - 2 rounded - 2xl transition - all duration - 200
active: scale - 95
      ${isActive
                ? 'text-white'
                : 'text-white/35 hover:text-white/60'
            }
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
                    className={`relative z - 10 transition - all duration - 200 ${isActive ? 'text-primary-light' : ''} `}
                />
                <span className={`relative z - 10 text - [9px] font - medium tracking - wider uppercase ${isActive ? 'text-primary-light' : ''} `}>
                    {label}
                </span>
            </>
        )}
    </NavLink>
);

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      flex items - center gap - 3 px - 4 py - 3 rounded - xl transition - all duration - 200 group
      ${isActive
                ? 'bg-primary/10 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }
`}
    >
        {({ isActive }) => (
            <>
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`transition - colors duration - 200 ${isActive ? 'text-primary-light' : 'group-hover:text-white/70'} `}
                />
                <span className={`text - sm font - medium ${isActive ? 'text-white' : ''} `}>
                    {label}
                </span>
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light"
                    />
                )}
            </>
        )}
    </NavLink>
);

export default Layout;
