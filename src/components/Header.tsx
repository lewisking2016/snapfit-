import React from 'react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 2
}) => {
  const isSubScreen = currentScreen === 'audio' || currentScreen === 'recovery' || currentScreen === 'devices';

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Home';
      case 'routines':
        return 'Routines';
      case 'tracker':
        return 'Live Tracker';
      case 'progress':
        return 'Progress';
      case 'audio':
        return 'Audio Companion & Spotify';
      case 'recovery':
        return 'Recovery & Sleep';
      case 'devices':
        return 'Connected Devices & Samsung Health';
      default:
        return 'Athletic Telemetry';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full z-50 pt-safe bg-[#111417]/85 backdrop-blur-xl border-b border-[#1d2023] shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {isSubScreen ? (
            <button
              onClick={() => onNavigate('home')}
              aria-label="Go back"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#e1e2e7] hover:text-[#c3f400] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left"
              aria-label="Return home"
            >
              <img
                alt="Logo"
                className="h-8 w-auto object-contain shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2xFVaBJrodohQxfyDqbQBwQ1PjuSP86LhurBmrmemiXQ_k5Rb_tjcD3jnfpD0YXQden9cUAvqtM65Zw9abiH5d1TqIcrhJXjSDUudTmNFuH55Aa9teYk6K8FX3dxGCOmbvzT3KMJJ0P3Tm6MyhyJ2ydf-UAEFupRYz7-ufDgEAKqKWSj40fMoUL9A3coPFnOp1bnRLIMkrt-GEk3YD8Tnswvn4PoHZwUwg83uuZmckiph2FbaoSb_BQ"
              />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            {!isSubScreen && (
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#c4c9ac] truncate">
                Athletic Telemetry
              </span>
            )}
            <h1 className={`${isSubScreen ? 'font-headline-sm text-[16px] sm:text-[18px]' : 'font-headline-sm text-[18px]'} text-[#e1e2e7] truncate leading-tight font-semibold`}>
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#c4c9ac] hover:text-[#e1e2e7] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c3f400] ring-2 ring-[#111417] animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Athlete Profile"
            className="w-8 h-8 rounded-full overflow-hidden border border-[#323538] hover:border-[#c3f400] transition-colors shrink-0"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh1xHsZmkc7w0sj0NHoeSvHIF030F6I_ITx2cGzWkdPMZsHcKg6kAr94M3Dg4PTnkGq3yRACjN8iW-Rp-7ysdk0g_IgU-5RYGKNtML57OsFiLJ0Tv9sveVR8PN1gjJTJrRWp_bojWAqVwU1sXbutOGdPm4Wd3KPE6Yx_F9VcQz_wJEBXaZErHL-mkKI0-JGsGXGdZkIii-JvMmYOGHGG9WDXs7oS1FOwpoTvMtWG4rwBxRyG5mQRhRHg"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
