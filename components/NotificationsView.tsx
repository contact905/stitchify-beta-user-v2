import React from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, markNotificationAsRead, markAllNotificationsAsRead }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-3">
              <Bell size={32} />通知
            </h2>
            {unreadCount > 0 && (<p className="text-sm text-gray-600 mt-2">{unreadCount}件の未読通知があります</p>)}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllNotificationsAsRead} className="px-4 py-2 rounded-xl text-sm font-semibold bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 hover:bg-black/10 transition-all duration-300">
              すべて既読にする
            </button>
          )}
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} onClick={() => markNotificationAsRead(notif.id)} className={`rounded-2xl p-4 md:p-5 transition-all duration-300 cursor-pointer border ${!notif.isRead ? 'border-orange-300 hover:border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${!notif.isRead ? 'bg-orange-500 text-white' : 'bg-gray-100 text-black'}`}>
                  {notif.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`font-bold text-base md:text-lg ${!notif.isRead ? 'text-black' : 'text-gray-800'}`}>{notif.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className={`text-sm ${!notif.isRead ? 'text-gray-800' : 'text-gray-500'}`}>{notif.content}</p>
                  {!notif.isRead && (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>未読
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;