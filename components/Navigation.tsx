import React, { useState } from 'react';
import { Home, User, TrendingUp, Search, MessageSquare, FileText, CheckCircle, Bell } from 'lucide-react';
import { Notification, FactoryChat, Draft } from '../types';
import { LANGUAGES } from '../constants';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  notifications: Notification[];
  factoryChats: FactoryChat[];
  savedDrafts: Draft[];
  profileImage: string | null;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  notifications,
  factoryChats,
  savedDrafts,
  profileImage,
  currentLanguage,
  setCurrentLanguage,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button onClick={() => setCurrentView('dashboard')} className="text-lg font-bold text-black">
            Stitchify
          </button>
          <div className="flex items-center gap-5">
            <div className="relative">
              <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100">
                <span className="text-sm font-bold text-gray-700">{LANGUAGES.find(l => l.code === currentLanguage)?.shortCode}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 rounded-xl overflow-hidden border border-gray-200 z-50 bg-white shadow-lg">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => { setCurrentLanguage(lang.code); setShowLanguageMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${currentLanguage === lang.code ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <span className="text-sm font-bold">{lang.shortCode}</span>
                      <span className="text-sm">{lang.label}</span>
                      {currentLanguage === lang.code && (<CheckCircle size={16} className="ml-auto" />)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setCurrentView('notifications')} className="relative group">
              <Bell size={24} className={currentView === 'notifications' ? 'text-orange-500' : 'text-gray-500 hover:text-black'} strokeWidth={2.5} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-orange-500">
                  {notifications.filter(n => !n.isRead).length}
                </div>
              )}
            </button>
            <button onClick={() => setCurrentView('profile')} className="relative group">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-orange-400 transition-all duration-300">
                {profileImage ? (<img src={profileImage} alt="Profile" className="w-full h-full object-cover" />) : (<User size={20} className="text-gray-600" />)}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center max-w-7xl mx-auto">
          {[
            { view: 'dashboard', icon: Home, label: 'ホーム' },
            { view: 'drafts', icon: FileText, label: '下書き' },
            { view: 'messages', icon: MessageSquare, label: 'メッセージ' },
            { view: 'progress', icon: TrendingUp, label: '進捗管理' },
            { view: 'search', icon: Search, label: '検索' }
          ].map(({ view, icon: Icon, label }) => {
            const unreadMessages = view === 'messages' ? factoryChats.reduce((sum, chat) => sum + chat.unreadCount, 0) : 0;
            const draftCount = view === 'drafts' ? savedDrafts.length : 0;
            return (
              <button key={view} onClick={() => setCurrentView(view)} className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${currentView === view ? 'text-orange-600' : 'text-gray-500 hover:text-black'}`}>
                <Icon size={22} strokeWidth={currentView === view ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{label}</span>
                {unreadMessages > 0 && (<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">{unreadMessages}</div>)}
                {draftCount > 0 && view === 'drafts' && (<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">{draftCount}</div>)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;