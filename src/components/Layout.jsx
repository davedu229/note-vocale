
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Mic, FileText, MessageSquare, Settings } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const Layout = ({ children, onUpgradeClick }) => {
    const location = useLocation();
    const { isPremium } = useSubscription();

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
        <div className="relative min-h-screen min-h-dvh flex flex-col md:flex-row bg-background text-text-primary font-sans overflow-hidden">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface z-30 pt-safe pb-safe relative">
                <div className="p-6">
                    <h1 className="text-xl font-semibold tracking-tight text-text-primary">Voice Notes</h1>
                    <p className="text-xs text-text-tertiary font-light mt-1">Assistant Personnel IA</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <SidebarItem to="/" icon={Mic} label="Enregistrement" />
                    <SidebarItem to="/notes" icon={FileText} label="Mes Notes" />
                    <SidebarItem to="/chat" icon={MessageSquare} label="Assistant IA" />
                    <SidebarItem to="/settings" icon={Settings} label="Paramètres" />
                </nav>

                {!isPremium && (
                    <div className="p-4 border-t border-border">
                        <div className="p-4 rounded-xl bg-surface-elevated border border-border">
                            <p className="text-sm font-medium text-text-primary mb-1">Passer Premium</p>
                            <p className="text-xs text-text-tertiary mb-3">Débloquez l'illimité</p>
                            <button
                                onClick={onUpgradeClick}
                                className="w-full py-2.5 px-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors text-center"
                            >
                                Voir les offres
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-20 h-full overflow-hidden">
                {/* Header - Mobile Only */}
                <header className="md:hidden relative z-20 pt-safe px-6 pb-4 flex-shrink-0 bg-background">
                    <div className="pt-4 flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                            {getHeaderTitle()}
                        </h1>
                        <p className="text-sm text-text-tertiary font-light">
                            {getHeaderSubtitle()}
                        </p>
                    </div>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-border bg-surface/80 backdrop-blur-xl">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">{getHeaderTitle()}</h2>
                        <p className="text-sm text-text-secondary font-light">{getHeaderSubtitle()}</p>
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
                <div className="liquid-glass pt-3 px-4 flex justify-around items-center pb-safe backdrop-blur-xl" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                    <NavItem to="/" icon={Mic} label="Enregistrer" />
                    <NavItem to="/notes" icon={FileText} label="Notes" />
                    <NavItem to="/chat" icon={MessageSquare} label="Assistant" />
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
            relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95
            ${isActive ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'}
        `}
    >
        {({ isActive }) => (
            <>
                {isActive && (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                )}
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="relative z-10 transition-all duration-200"
                />
                <span className="relative z-10 text-[9px] font-medium tracking-wider uppercase">
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
            flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
            ${isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'}
        `}
    >
        {({ isActive }) => (
            <>
                <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="transition-colors duration-200"
                />
                <span className="text-sm font-medium">
                    {label}
                </span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
            </>
        )}
    </NavLink>
);

export default Layout;
