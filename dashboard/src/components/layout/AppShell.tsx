/**
 * ADS INTELLIGENCE App Shell
 * Precision Ads Console inspired design - ADS INTELLIGENCE identity
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, radius, spacing, typography, brand } from '../../styles/tokens';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.background }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1" style={{ padding: spacing.margin }}>
          <div className="max-w-full mx-auto w-full" style={{ maxWidth: '1600px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Visão Geral', icon: 'dashboard' },
    { path: '/campaigns', label: 'Campanhas', icon: 'campaign' },
    { path: '/creatives', label: 'Criativos', icon: 'palette' },
    { path: '/experiments', label: 'Experimentos', icon: 'science' },
    { path: '/recommendations', label: 'Recomendações IA', icon: 'lightbulb' },
    { path: '/market', label: 'Mercado', icon: 'trending_up' },
    { path: '/competitors', label: 'Concorrentes', icon: 'radar' },
    { path: '/audiences', label: 'Audiências', icon: 'groups' },
    { path: '/performance', label: 'Performance', icon: 'monitoring' },
    { path: '/crm', label: 'CRM & Conversões', icon: 'account_tree' },
    { path: '/learning', label: 'Aprendizado', icon: 'psychology' },
    { path: '/settings', label: 'Configurações', icon: 'settings' },
  ];

  const navGroups = [
    { label: 'VISÃO', items: navItems.slice(0, 1) },
    { label: 'OPERAÇÃO', items: navItems.slice(1, 4) },
    { label: 'INTELIGÊNCIA', items: navItems.slice(4, 8) },
    { label: 'RESULTADOS', items: navItems.slice(8, 11) },
    { label: 'SISTEMA', items: navItems.slice(11, 12) },
  ];

  return (
    <aside className="bg-white border-r h-screen sticky top-0 flex flex-col" style={{ borderColor: colors.border, width: '256px', flexShrink: 0 }}>
      {/* Brand */}
      <div className="flex-shrink-0 p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: brand.primary }}>
            <span className="material-symbols-outlined text-2xl">psychology</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 leading-tight truncate" style={{ fontSize: typography.fontSize.lg[0], fontFamily: typography.fontFamily.sans.join(', ') }}>ADS INTELLIGENCE</h1>
            <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>Inteligência de Apoio à Decisão</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400" style={{ letterSpacing: typography.letterSpacing.wider, marginBottom: '4px' }}>
              {group.label}
            </span>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? `bg-[${brand.primaryContainer}] text-[${brand.primary}]`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  style={{ fontFamily: typography.fontFamily.sans.join(', ') }}
                >
                  <span className="material-symbols-outlined text-lg flex-shrink-0" style={{ fontSize: '22px' }}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-sm">info</span>
          <span>Modo demonstração</span>
        </div>
      </div>
    </aside>
  );
};

const TopBar = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-20 flex-shrink-0" style={{ borderColor: colors.border, height: '64px' }}>
      <div className="max-w-full mx-auto w-full px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: brand.primary }}>
              <span className="material-symbols-outlined text-base">psychology</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>ADS INTELLIGENCE</span>
              <span className="text-xs text-gray-500 ml-2" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>Conta de demonstração</span>
            </div>
          </div>
          <div className="relative w-full hidden sm:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '22px' }}>search</span>
            <input
              className="w-full bg-gray-50 border rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[${brand.primary}] focus:border-transparent"
              placeholder="Pesquisar campanhas, métricas, recomendações..."
              type="text"
              style={{ borderColor: colors.border, fontFamily: typography.fontFamily.sans.join(', ') }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-50" style={{ borderColor: colors.border, fontFamily: typography.fontFamily.sans.join(', ') }}>
            <span className="material-symbols-outlined text-sm">date_range</span>
            <span>Últimos 30 dias</span>
          </div>
          <button className="px-5 py-2.5 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2" style={{ backgroundColor: brand.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
            <span className="material-symbols-outlined">add</span>
            Nova Campanha
          </button>
        </div>
      </div>
    </header>
  );
};
