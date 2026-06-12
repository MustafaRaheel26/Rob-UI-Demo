import React, { useState, useMemo } from 'react';
import { useEZShift } from '../context/EZShiftContext';
import { Layout } from '../components/layout/Layout';
import { 
  Send, 
  MessageSquare, 
  UserCheck, 
  Info, 
  UserPlus, 
  Dot,
  FileCheck,
  Search,
  Check
} from 'lucide-react';
import { Conversation } from '../types/message';

export default function MessagesPage() {
  const { conversations, currentUser, sendMessage, users, startNewConversation } = useEZShift();
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return conversations[0]?.id || '';
  });
  const [typedText, setTypedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Find active conversation
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConvId);
  }, [conversations, activeConvId]);

  // Handle send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || !activeConvId) return;

    sendMessage(activeConvId, typedText.trim());
    setTypedText('');
  };

  // Get recipient information
  const currentRecipientName = useMemo(() => {
    if (!currentUser) return '';
    if (currentUser.role === 'Admin') {
      return activeConversation ? activeConversation.workerName : 'Worker';
    } else {
      return 'Rob (EZ-Shift Admin)';
    }
  }, [currentUser, activeConversation]);

  // Filter conversations based on query
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => 
      c.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex h-[calc(100vh-175px)] min-h-[500px]">
        
        {/* Left Side: Conversations Catalog (Hidden on mobile if conversation is active, or responsive flex) */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${
          activeConvId && 'hidden md:flex'
        }`}>
          {/* Quick Search */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Chat Channels
            </h2>
            <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
              {conversations.length} total
            </span>
          </div>

          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff chats..."
                className="w-full text-xs bg-white pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Conversations scroll index list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const itemIsActive = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                    itemIsActive ? 'bg-blue-50/70 border-r-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {conv.workerName.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 truncate">{conv.workerName}</span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessageText}</p>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active messaging channels found.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Window Dialogue */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${
          !activeConvId && 'hidden md:flex'
        }`}>
          {activeConversation ? (
            <>
              {/* Active Conversation Profile Header */}
              <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveConvId('')}
                    className="md:hidden text-xs text-blue-600 font-bold hover:underline"
                  >
                    &larr; Channels
                  </button>
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                    {currentRecipientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-800 tracking-tight leading-none uppercase">
                      {currentRecipientName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>Online for Support</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 px-2.5 py-1 text-slate-600 font-bold rounded uppercase tracking-wider">
                    Secure Staff Hotline
                  </span>
                </div>
              </div>

              {/* Chat Message dialog balloon area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Systems disclosure block */}
                <div className="mx-auto max-w-sm text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-[10px] text-slate-500 font-bold rounded-full uppercase border border-slate-200">
                    <FileCheck className="h-3.5 w-3.5 text-blue-500" /> End-to-End HIPAA Encryption
                  </span>
                </div>

                {activeConversation.messages.map((msg) => {
                  const isCurrentUserMsg = msg.senderId === currentUser?.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUserMsg ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm space-y-1 ${
                        isCurrentUserMsg 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-150'
                      }`}>
                        {!isCurrentUserMsg && (
                          <span className="block text-[10px] font-black uppercase text-slate-400">
                            {msg.senderName} ({msg.senderRole})
                          </span>
                        )}
                        <p className="text-xs leading-relaxed break-words">{msg.text}</p>
                        <span className={`block text-[9px] text-right ${
                          isCurrentUserMsg ? 'text-blue-100' : 'text-slate-400'
                        } font-mono`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Composer bar */}
              <div className="bg-white p-4 border-t border-slate-200">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    placeholder="Type secure response..."
                    className="flex-1 px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-xl"
                  />
                  <button
                    type="submit"
                    disabled={!typedText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:shadow-none flex items-center justify-center cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-8">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700">No Channel Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Select a staff conversation from the sidebar channels catalog to start communicating.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
