import React, { useState } from 'react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Head } from '@inertiajs/react';
import { MessageSquare, Send, Hash, User } from 'lucide-react';

const INITIAL_CHANNELS = [
    { id: 'general', name: 'general', description: 'Company-wide announcements and work discussion.' },
    { id: 'design', name: 'design-spec', description: 'Design assets, dark theme mockups, and layout files.' },
    { id: 'dev', name: 'development', description: 'Database schema planning, API keys, and deployment logs.' }
];

const INITIAL_MESSAGES = {
    general: [
        { id: 1, sender: 'Karen Smith', email: 'karen@example.com', content: 'Hello team! Welcome to the ReqTracker workspace. Let\'s make sure we track all task cards here.', time: '10:05 AM' },
        { id: 2, sender: 'Steve Mcconnell', email: 'steve@example.com', content: 'Indeed. The Kanban drag and drop feels super fast. I am currently seeding data for projects.', time: '10:12 AM' },
        { id: 3, sender: 'Sarah Green', email: 'sarah@example.com', content: 'Make sure to add due dates to all requests so they synchronize with our Workspace Calendar!', time: '10:15 AM' }
    ],
    design: [
        { id: 1, sender: 'Karen Smith', email: 'karen@example.com', content: 'Hi everyone! I just updated the UI specifications. Take a look at the Slate dark theme mockups.', time: 'Yesterday, 4:20 PM' },
        { id: 2, sender: 'Brad Smith', email: 'brad@example.com', content: 'Agreed, the slate border radius (rounded-lg) and rich Indigo highlight look extremely clean.', time: 'Yesterday, 5:10 PM' }
    ],
    dev: [
        { id: 1, sender: 'Steve Mcconnell', email: 'steve@example.com', content: 'scaffolded migrations for workspace isolation and task comments pivot table. Ready to migrate.', time: 'Yesterday, 2:30 PM' },
        { id: 2, sender: 'Sarah Green', email: 'sarah@example.com', content: 'Perfect. I will prepare test requests to verify the drag-reorder logic.', time: 'Yesterday, 2:45 PM' }
    ]
};

export default function WorkspaceMessages({ workspace, projectsList, workspacesList, workspaceMembers, auth }) {
    const [channels, setChannels] = useState(INITIAL_CHANNELS);
    const [activeChannel, setActiveChannel] = useState('general');
    const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES);
    const [typedMessage, setTypedMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!typedMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: auth.user.name,
            email: auth.user.email,
            content: typedMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessagesMap(prev => ({
            ...prev,
            [activeChannel]: [...(prev[activeChannel] || []), newMessage]
        }));

        setTypedMessage('');
    };

    // Calculate avatar letters
    const getAvatarInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    };

    const activeChannelInfo = channels.find(c => c.id === activeChannel);
    const currentMessages = messagesMap[activeChannel] || [];

    return (
        <SatSetLayout 
            activeWorkspace={workspace} 
            projectsList={projectsList} 
            workspacesList={workspacesList} 
            workspaceMembers={workspaceMembers} 
            auth={auth}
        >
            <Head title="Team Chat - SatSet" />
            
            <div className="flex h-full bg-white dark:bg-zinc-950 overflow-hidden">
                
                {/* 1. Channels list pane */}
                <div className="w-60 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/10 p-5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                            <MessageSquare size={16} />
                        </div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Team Messages</h2>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto">
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2 px-1">Channels</span>
                            <div className="space-y-0.5">
                                {channels.map((channel) => {
                                    const isActive = activeChannel === channel.id;
                                    return (
                                        <button
                                            key={channel.id}
                                            onClick={() => setActiveChannel(channel.id)}
                                            className={`flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.8 text-xs font-semibold transition-colors py-2.5 ${
                                                isActive 
                                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                                            }`}
                                        >
                                            <Hash size={13} className={isActive ? 'text-white' : 'text-zinc-400'} />
                                            <span>{channel.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Message stream panel */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
                    {/* Active Channel Info */}
                    <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-150 flex items-center gap-1">
                                <Hash size={14} className="text-zinc-400" />
                                <span>{activeChannelInfo?.name}</span>
                            </h3>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{activeChannelInfo?.description}</p>
                        </div>
                    </div>

                    {/* Chat Stream Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafafa]/50 dark:bg-zinc-950/20">
                        {currentMessages.map((msg) => {
                            const isSelf = msg.email === auth.user.email;
                            return (
                                <div key={msg.id} className={`flex gap-3 items-start text-xs ${isSelf ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-850 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                                        {getAvatarInitials(msg.sender)}
                                    </div>
                                    <div className={`max-w-[65%] ${isSelf ? 'items-end' : ''} flex flex-col`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{msg.sender}</span>
                                            <span className="text-[9px] text-zinc-400">{msg.time}</span>
                                        </div>
                                        <p className={`p-3 rounded-xl border leading-relaxed shadow-sm whitespace-pre-line text-zinc-850 dark:text-zinc-200 ${
                                            isSelf 
                                                ? 'bg-indigo-600 border-indigo-650 text-white dark:text-zinc-50' 
                                                : 'bg-white border-zinc-150 dark:bg-zinc-900 dark:border-zinc-800/80'
                                        }`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {currentMessages.length === 0 && (
                            <p className="text-xs text-zinc-400 italic text-center py-6">No messages in this channel yet.</p>
                        )}
                    </div>

                    {/* Chat Text Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-3">
                            <input 
                                type="text"
                                value={typedMessage}
                                onChange={(e) => setTypedMessage(e.target.value)}
                                placeholder={`Message #${activeChannelInfo?.name}`}
                                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SatSetLayout>
    );
}
