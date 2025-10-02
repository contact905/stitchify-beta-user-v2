import React from 'react';
import { Shirt, Clock, Package, CheckCircle, MessageSquare } from 'lucide-react';
import { Project, FactoryChat } from '../types';

interface ProgressViewProps {
  activeProjects: Project[];
  factoryChats: FactoryChat[];
  selectedProgressProject: string;
  setSelectedProgressProject: (id: string) => void;
  setCurrentView: (view: string) => void;
  setSelectedFactory: (id: string | null) => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ activeProjects, factoryChats, selectedProgressProject, setSelectedProgressProject, setCurrentView, setSelectedFactory }) => {
    
    const selectedProject = activeProjects.find(p => p.id === selectedProgressProject);

    const handleSendMessage = () => {
        if (!selectedProject) return;
        const relatedChat = factoryChats.find(c => c.factoryName === selectedProject.factoryName && c.projectName === selectedProject.title);
        if (relatedChat) {
            setSelectedFactory(relatedChat.id);
            setCurrentView('messages');
        } else {
            // Handle case where no chat exists yet
            alert("このプロジェクトのチャットを開始します。");
        }
    }
    
    return (
        <div className="min-h-screen pb-20 bg-white">
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">進捗管理</h2>
                <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-3 pb-2 min-w-max">
                        {activeProjects.map(project => {
                            const projectProgress = Math.round((project.currentStage / 5) * 100);
                            const hasUnread = project.notifications?.some(n => n.unread);
                            return (
                                <button key={project.id} onClick={() => setSelectedProgressProject(project.id)} className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-300 border ${selectedProgressProject === project.id ? 'bg-orange-500/20 backdrop-blur-sm border-orange-500/30' : 'bg-black/5 backdrop-blur-sm border-black/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className={`text-sm font-bold whitespace-nowrap ${selectedProgressProject === project.id ? 'text-orange-700' : 'text-gray-700'}`}>{project.title}</h3>
                                        {hasUnread && (<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 rounded-full overflow-hidden bg-gray-200">
                                            <div className="h-full transition-all duration-500 bg-orange-500" style={{ width: `${projectProgress}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-500 font-bold">{projectProgress}%</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                {selectedProject && (
                    <div className="space-y-6">
                        <div className="rounded-2xl p-4 md:p-6 border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-black mb-2">{selectedProject.title}</h3>
                                    <p className="text-sm text-gray-600">{selectedProject.factoryName}</p>
                                </div>
                                <div className="px-4 py-2 rounded-full text-xs font-bold bg-orange-500 text-white">
                                    {Math.round((selectedProject.currentStage / 5) * 100)}%
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Shirt size={16} />
                                    <span>{selectedProject.itemType} {selectedProject.lotSize}着</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={16} />
                                    <span>{selectedProject.expectedDelivery}</span>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl p-4 md:p-6 border border-gray-200 bg-white shadow-sm">
                            <h4 className="text-lg md:text-xl font-bold text-black mb-6 flex items-center gap-2">
                                <Package size={24} />製作ステップ
                            </h4>
                            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                                <div className="flex items-center gap-2 min-w-max pb-2">
                                    {selectedProject.stages.map((stage, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <div className="flex flex-col items-center gap-2 min-w-[90px]">
                                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${stage.completed ? 'bg-orange-500 border-orange-500' : stage.current ? 'bg-yellow-500 border-yellow-500' : 'bg-gray-200 border-gray-300'}`}>
                                                    {stage.completed ? (<CheckCircle size={24} className="text-white" strokeWidth={2.5} />) : stage.current ? (<Clock size={24} className="text-white animate-pulse" strokeWidth={2.5} />) : (<div className="w-3 h-3 rounded-full bg-gray-400"></div>)}
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-xs font-semibold whitespace-nowrap ${stage.completed ? 'text-orange-600' : stage.current ? 'text-yellow-600' : 'text-gray-500'}`}>{stage.name}</p>
                                                    {stage.current && (<p className="text-[10px] text-yellow-600 mt-1">進行中</p>)}
                                                </div>
                                            </div>
                                            {idx < selectedProject.stages.length - 1 && (<div className={`h-1 w-8 mx-1 transition-all duration-300 rounded-full ${stage.completed ? 'bg-orange-500' : 'bg-gray-300'}`} />)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 p-3 rounded-xl bg-orange-100">
                                <p className="text-xs text-orange-700 text-center">← スワイプして全てのステップを確認 →</p>
                            </div>
                        </div>
                        <div className="rounded-2xl p-4 md:p-6 border border-gray-200 bg-white shadow-sm">
                            <h4 className="text-lg md:text-xl font-bold text-black mb-4 flex items-center gap-2">
                                <MessageSquare size={24} />工場とのメッセージ
                            </h4>
                            <div className="space-y-3 mb-4">
                                {selectedProject.messages.slice(-2).map(msg => (
                                    <div key={msg.id} className={`p-3 md:p-4 rounded-xl ${msg.sender === 'あなた' ? 'bg-orange-100 ml-4 md:ml-8' : 'bg-gray-100 mr-4 md:mr-8'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-semibold text-black text-sm">{msg.sender}</p>
                                            <p className="text-xs text-gray-500">{msg.time}</p>
                                        </div>
                                        <p className="text-gray-800 text-sm">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSendMessage} className="w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30">
                                <MessageSquare size={20} />メッセージを送る
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressView;