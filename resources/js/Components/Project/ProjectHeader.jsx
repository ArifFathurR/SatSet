import React from 'react';
import { Columns, Plus, Columns as ColumnsIcon, Table as TableIcon, List as ListIcon, Lock, Settings } from 'lucide-react';

export default function ProjectHeader({ 
    projectName, 
    isPrivate,
    completionPercentage, 
    workspaceMembers, 
    onAddMemberClick, 
    activeTab, 
    setActiveTab, 
    viewMode, 
    setViewMode,
    onSettingsClick
}) {
    return (
        <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-8 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                
                {/* Project title and completion indicator */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-250 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/50 shadow-sm">
                        <ColumnsIcon size={20} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 truncate">{projectName}</h1>
                            {isPrivate && (
                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                                    <Lock size={10} /> Private
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                            <div className="w-24 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="font-semibold text-zinc-650 dark:text-zinc-400">{completionPercentage}% complete</span>
                        </div>
                    </div>
                </div>

                {/* Right tools: members & actions */}
                <div className="flex items-center gap-4">
                    {/* Member stack */}
                    <div className="flex items-center -space-x-2">
                        {workspaceMembers && workspaceMembers.slice(0, 4).map((member) => (
                            <div 
                                key={member.id} 
                                title={member.name}
                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-150 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shadow-sm"
                            >
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        ))}
                        {workspaceMembers && workspaceMembers.length > 4 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 bg-indigo-100 dark:bg-indigo-950 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
                                +{workspaceMembers.length - 4}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={onAddMemberClick}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={14} />
                        <span>Add Member</span>
                    </button>
                </div>
            </div>

            {/* Subnavigation Tabs & View toggles */}
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div className="flex items-center gap-6">
                    {[
                        { id: 'overview', name: 'Overview' },
                        { id: 'requests', name: 'Requests' },
                        { id: 'reports', name: 'Reports' },
                        { id: 'messages', name: 'Messages' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative py-1 text-sm font-semibold transition-all ${
                                activeTab === tab.id 
                                    ? 'text-indigo-600' 
                                    : 'text-zinc-400 hover:text-zinc-750 dark:hover:text-zinc-300'
                            }`}
                        >
                            {tab.name}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* View Toggles & Settings */}
                {activeTab === 'requests' && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onSettingsClick}
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors shadow-sm"
                            title="Board Settings"
                        >
                            <Settings size={14} />
                            <span>Board Settings</span>
                        </button>
                        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 shadow-sm">
                            <button 
                                onClick={() => setViewMode('board')}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewMode === 'board' 
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                        >
                            <ColumnsIcon size={13} />
                            <span>Board</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewMode === 'table' 
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                        >
                            <TableIcon size={13} />
                            <span>Table</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewMode === 'list' 
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                        >
                            <ListIcon size={13} />
                            <span>List</span>
                        </button>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}
