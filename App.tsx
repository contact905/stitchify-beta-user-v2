import React, { useState, useCallback, useEffect } from 'react';
import { Home, User, TrendingUp, Search, MessageSquare, FileText, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

import { 
  LANGUAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_FACTORY_CHATS, 
  ACTIVE_PROJECTS,
  PAST_PRODUCTS,
  MOCK_FACTORIES,
  CAMPAIGNS,
  INITIAL_DRAFTS,
  EMPTY_SPEC
} from './constants';
import { ChatMessage, Draft, FactoryChat, Notification, ProfileVisibility, Specification } from './types';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import NotificationsView from './components/NotificationsView';
import MessagesView from './components/MessagesView';
import ChatView from './components/ChatView';
import ProgressView from './components/ProgressView';
import SearchView from './components/SearchView';
import DraftsView from './components/DraftsView';
import ProfileView from './components/ProfileView';
import HelpChat from './components/HelpChat';
import MatchingView from './components/MatchingView';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // State for the spec creation chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentSpec, setCurrentSpec] = useState<Specification | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [initialUserPrompt, setInitialUserPrompt] = useState('');


  // State for matching
  const [specToMatch, setSpecToMatch] = useState<Specification | null>(null);

  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
  const [selectedProgressProject, setSelectedProgressProject] = useState('p1');
  const [showHelpChat, setShowHelpChat] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [factoryChats, setFactoryChats] = useState<FactoryChat[]>(INITIAL_FACTORY_CHATS);
  const [savedDrafts, setSavedDrafts] = useState<Draft[]>(INITIAL_DRAFTS);
  
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>({
    brandName: true, brandConcept: true, contactName: true, email: true, establishedYear: true,
    location: true, capital: true, entityType: true, website: true,
  });
  const [currentLanguage, setCurrentLanguage] = useState('ja');

  useEffect(() => {
    if (currentView !== 'dashboard') {
      setShowHelpChat(false);
    }
  }, [currentView]);

  const markNotificationAsRead = useCallback((notifId: string) => {
    setNotifications(prev => prev.map(notif => notif.id === notifId ? { ...notif, isRead: true } : notif));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);

  const startChat = useCallback((promptOrCategory = '', draftId: string | null = null) => {
    setCurrentView('chat');
    setInitialUserPrompt('');

    if (draftId) {
      const draft = savedDrafts.find(d => d.id === draftId);
      if (draft) {
        setChatMessages(draft.messages);
        setCurrentSpec(draft.spec);
        setCurrentDraftId(draftId);
      }
    } else {
      const isSimpleCategory = ['Tシャツ', 'パーカー', 'パンツ', 'アウター', '小物', 'その他'].includes(promptOrCategory);
      const newSpec = { ...EMPTY_SPEC };
      
      if (isSimpleCategory) {
        newSpec.itemType = promptOrCategory;
      } else if (promptOrCategory) {
        setInitialUserPrompt(promptOrCategory);
      }

      setChatMessages([]);
      setCurrentSpec(newSpec);
      setCurrentDraftId(null);
    }
  }, [savedDrafts]);

  const saveDraft = useCallback((spec: Specification, messages: ChatMessage[]) => {
    if (messages.length === 0) return;
    const title = `${spec.itemType || '新規プロジェクト'}の仕様書`;
    const category = spec.itemType || 'その他';
    
    if (currentDraftId) {
      setSavedDrafts(prev => prev.map(draft => draft.id === currentDraftId ? { ...draft, spec, messages, title, category, lastEdited: new Date().toISOString().split('T')[0] } : draft));
      alert('下書きを更新しました！');
    } else {
      const newDraft: Draft = { id: `draft${Date.now()}`, title, category, lastEdited: new Date().toISOString().split('T')[0], messages, spec, completed: false };
      setSavedDrafts(prev => [newDraft, ...prev]);
      setCurrentDraftId(newDraft.id);
      alert('下書きを保存しました！');
    }
  }, [currentDraftId]);

  const deleteDraft = useCallback((draftId: string) => {
    if (window.confirm('この下書きを削除してもよろしいですか？')) {
      setSavedDrafts(prev => prev.filter(d => d.id !== draftId));
    }
  }, []);

  const handleStartMatching = useCallback((spec: Specification) => {
    setSpecToMatch(spec);
    setCurrentView('matching');
  }, []);
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          activeProjects={ACTIVE_PROJECTS}
          pastProducts={PAST_PRODUCTS}
          campaigns={CAMPAIGNS}
          handleCategoryClick={(category) => startChat(category)}
          startChat={startChat}
          setCurrentView={setCurrentView}
          setSelectedProgressProject={setSelectedProgressProject}
        />;
      case 'notifications':
        return <NotificationsView 
          notifications={notifications}
          markNotificationAsRead={markNotificationAsRead}
          markAllNotificationsAsRead={markAllNotificationsAsRead}
        />;
      case 'messages':
        return <MessagesView
          factoryChats={factoryChats}
          setFactoryChats={setFactoryChats}
          selectedFactory={selectedFactory}
          setSelectedFactory={setSelectedFactory}
          currentLanguage={currentLanguage}
        />;
      case 'chat':
        return <ChatView
          initialMessages={chatMessages}
          initialSpec={currentSpec}
          initialUserPrompt={initialUserPrompt}
          saveDraft={saveDraft}
          setCurrentView={setCurrentView}
          onStartMatching={handleStartMatching}
        />;
      case 'matching':
        return <MatchingView 
          spec={specToMatch!}
          factories={MOCK_FACTORIES}
          setCurrentView={setCurrentView}
          setSelectedFactory={setSelectedFactory}
        />;
      case 'progress':
        return <ProgressView
          activeProjects={ACTIVE_PROJECTS}
          factoryChats={factoryChats}
          selectedProgressProject={selectedProgressProject}
          setSelectedProgressProject={setSelectedProgressProject}
          setCurrentView={setCurrentView}
          setSelectedFactory={setSelectedFactory}
        />;
      case 'search':
        return <SearchView factories={MOCK_FACTORIES} campaigns={CAMPAIGNS} />;
      case 'drafts':
        return <DraftsView 
          savedDrafts={savedDrafts}
          startChat={startChat}
          deleteDraft={deleteDraft}
        />;
      case 'profile':
        return <ProfileView 
          profileImage={profileImage}
          profileVisibility={profileVisibility}
          setProfileVisibility={setProfileVisibility}
          savedDraftsCount={savedDrafts.length}
          activeProjectsCount={ACTIVE_PROJECTS.length}
        />;
      default:
        return <Dashboard 
          activeProjects={ACTIVE_PROJECTS}
          pastProducts={PAST_PRODUCTS}
          campaigns={CAMPAIGNS}
          handleCategoryClick={(category) => startChat(category)}
          startChat={startChat}
          setCurrentView={setCurrentView}
          setSelectedProgressProject={setSelectedProgressProject}
        />;
    }
  };

  return (
    <div className={`min-h-screen bg-white ${currentView === 'chat' ? 'flex flex-col h-screen' : 'pb-20 md:pb-0'}`}>
      <Navigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        notifications={notifications}
        factoryChats={factoryChats}
        savedDrafts={savedDrafts}
        profileImage={profileImage}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />
      
      <main className={currentView === 'chat' ? 'flex-grow min-h-0' : 'h-full'}>
        {renderView()}
      </main>

      {currentView === 'dashboard' && (
        <>
          <button 
            onClick={() => setShowHelpChat(!showHelpChat)} 
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-600 hover:bg-orange-500/30"
          >
            <HelpCircle size={28} />
          </button>
          {showHelpChat && <HelpChat setShowHelpChat={setShowHelpChat} />}
        </>
      )}
    </div>
  );
};

export default App;