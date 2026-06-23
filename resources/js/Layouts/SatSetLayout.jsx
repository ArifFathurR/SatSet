import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { 
    LayoutGrid, Plus, Search, Settings, Users, LogOut, 
    ChevronDown, Check, Clock, Bell, Calendar, MessageSquare, Layers, Sun, Moon, Lock
} from 'lucide-react';
import WorkspaceModal from '@/Components/Modals/WorkspaceModal';
import ProjectModal from '@/Components/Modals/ProjectModal';
import InviteModal from '@/Components/Modals/InviteModal';

export default function SatSetLayout({ children, activeWorkspace, workspacesList, projectsList, workspaceMembers, auth }) {
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const getStatusDot = (email) => {
        if (email.includes('alison') || email.includes('karen') || email.includes('sarah')) {
            return 'bg-emerald-500';
        }
        return 'bg-zinc-300';
    };

    const workspaceSlug = activeWorkspace ? activeWorkspace.slug : '';

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 antialiased transition-colors duration-200">
            
            {/* 1. GLOBAL MINI SIDEBAR (FAR LEFT) */}
            <div className="flex w-[70px] flex-col items-center justify-between border-r border-zinc-200 dark:border-zinc-800 bg-indigo-500 py-6">
                <div className="flex flex-col items-center gap-8 w-full">
                    {/* Brand Logo */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30">
                        SS
                    </div>

                    {/* Nav Icons */}
                    <nav className="flex flex-col items-center gap-5 w-full">
                        <Link 
                            href={activeWorkspace ? route('workspace.dashboard', { workspace_slug: workspaceSlug }) : '#'} 
                            className={`group flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                                window.location.pathname === `/w/${workspaceSlug}` || window.location.pathname.includes('/projects/')
                                    ? 'text-indigo-600 bg-white font-bold shadow-sm' 
                                    : 'text-white hover:bg-white/15 hover:text-white'
                            }`}
                            title="Dashboard"
                        >
                            <LayoutGrid size={20} />
                        </Link>
                        
                        <Link 
                            href={activeWorkspace ? route('workspace.calendar', { workspace_slug: workspaceSlug }) : '#'} 
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                                window.location.pathname.endsWith('/calendar')
                                    ? 'text-indigo-600 bg-white font-bold shadow-sm' 
                                    : 'text-white hover:bg-white/15 hover:text-white'
                            }`}
                            title="Calendar"
                        >
                            <Calendar size={20} />
                        </Link>
                        
                        <Link 
                            href={activeWorkspace ? route('workspace.members', { workspace_slug: workspaceSlug }) : '#'} 
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                                window.location.pathname.endsWith('/members')
                                    ? 'text-indigo-600 bg-white font-bold shadow-sm' 
                                    : 'text-white hover:bg-white/15 hover:text-white'
                            }`}
                            title="Team Members"
                        >
                            <Users size={20} />
                        </Link>

                        <Link 
                            href={activeWorkspace ? route('workspace.messages', { workspace_slug: workspaceSlug }) : '#'} 
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                                window.location.pathname.endsWith('/messages')
                                    ? 'text-indigo-600 bg-white font-bold shadow-sm' 
                                    : 'text-white hover:bg-white/15 hover:text-white'
                            }`}
                            title="Messages"
                        >
                            <MessageSquare size={20} />
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-col items-center gap-6 w-full text-white">
                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-white/15 hover:text-white"
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-white/15 hover:text-white">
                        <Settings size={20} />
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-white/15 hover:text-red-200"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* 2. SUB-SIDEBAR (MIDDLE COLUMN) */}
            <div className="flex w-[260px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                
                {/* Workspace Switcher */}
                <div className="relative px-5 py-4 border-b border-zinc-100 dark:border-zinc-850">
                    <div className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Workspaces</div>
                    {activeWorkspace ? (
                        <button 
                            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                            className="flex w-full mt-1.5 items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <span className="truncate">{activeWorkspace.name}</span>
                            <ChevronDown size={15} className="text-zinc-500" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                            className="flex w-full mt-1.5 items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-zinc-850 dark:text-zinc-200 shadow-sm"
                        >
                            <span>Select Workspace</span>
                            <ChevronDown size={15} />
                        </button>
                    )}

                    {/* Workspace Dropdown Panel */}
                    {isWorkspaceOpen && (
                        <div className="absolute left-4 right-4 top-[72px] z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl">
                            <div className="max-h-[180px] overflow-y-auto">
                                {workspacesList && workspacesList.map((ws) => (
                                    <Link
                                        key={ws.id}
                                        href={route('workspace.dashboard', { workspace_slug: ws.slug })}
                                        onClick={() => setIsWorkspaceOpen(false)}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                                            activeWorkspace && activeWorkspace.id === ws.id 
                                                ? 'bg-indigo-50 dark:bg-indigo-950/40 font-semibold text-indigo-650 dark:text-indigo-400' 
                                                : 'text-zinc-700 dark:text-zinc-300'
                                        }`}
                                    >
                                        <span className="truncate">{ws.name}</span>
                                        {activeWorkspace && activeWorkspace.id === ws.id && <Check size={14} />}
                                    </Link>
                                ))}
                            </div>
                            <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                            <button
                                onClick={() => {
                                    setIsWorkspaceOpen(false);
                                    setIsAddWorkspaceOpen(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                            >
                                <Plus size={16} />
                                <span>Create Workspace</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation list */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                    {/* Projects Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Projects</span>
                            <button 
                                onClick={() => setIsAddProjectOpen(true)}
                                className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Plus size={15} />
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            {projectsList && projectsList.map((project) => {
                                const currentUrl = window.location.pathname;
                                const isActive = currentUrl.includes(`/projects/${project.id}`);
                                return (
                                    <Link
                                        key={project.id}
                                        href={route('projects.show', { workspace_slug: workspaceSlug, project: project.id })}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                                            isActive 
                                                ? 'bg-indigo-600 font-semibold text-white shadow-sm' 
                                                : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className={`h-2 w-2 flex-shrink-0 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-500'}`} />
                                            <span className="truncate">{project.name}</span>
                                        </div>
                                        {project.is_private && (
                                            <Lock size={12} className={`flex-shrink-0 ml-1.5 ${isActive ? 'text-indigo-200' : 'text-zinc-400'}`} />
                                        )}
                                    </Link>
                                );
                            })}
                            {(!projectsList || projectsList.length === 0) && (
                                <p className="px-3 py-2 text-xs italic text-zinc-400 dark:text-zinc-500">No projects found</p>
                            )}
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Team Members</span>
                            <button 
                                onClick={() => setIsAddMemberOpen(true)}
                                className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Plus size={15} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {workspaceMembers && workspaceMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-zinc-150 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                            <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white dark:border-zinc-950 ${getStatusDot(member.email)}`} />
                                        </div>
                                        <div className="truncate">
                                            <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{member.name}</div>
                                            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 capitalize">{member.pivot?.role || 'Member'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Time widget at the bottom */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-850">
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-gradient-to-tr from-zinc-50 to-indigo-50/20 dark:from-zinc-900 dark:to-indigo-950/20 p-4">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Clock size={14} className="text-indigo-500 dark:text-indigo-400" />
                            <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">Total Time</span>
                        </div>
                        <div className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">23.7 hours</div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">+2.5%</span>
                            <span className="text-zinc-400 dark:text-zinc-500">from last week</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MAIN WORKSPACE CONTENT */}
            <div className="flex flex-1 flex-col overflow-hidden bg-[#fafafa] dark:bg-zinc-950">
                
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8">
                    
                    {/* Search bar */}
                    <div className="relative w-80">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Search requests..." 
                            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-1.5 pl-9 pr-4 text-sm text-zinc-850 dark:text-zinc-100 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Right action group */}
                    <div className="flex items-center gap-5">
                        <button className="relative text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors">
                            <Bell size={20} />
                            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-600" />
                        </button>
                        <button className="text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors">
                            <Settings size={20} />
                        </button>
                        <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center gap-2.5 hover:opacity-85 transition-opacity focus:outline-none"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-900/40">
                                    {auth.user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hidden sm:inline">{auth.user.name}</span>
                                <ChevronDown size={12} className="text-zinc-400" />
                            </button>

                            {/* Dropdown Card */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-lg shadow-zinc-250/10 dark:shadow-none z-50">
                                    {/* User Details */}
                                    <div className="px-3.5 py-2.5">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{auth.user.name}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium truncate mt-0.5">{auth.user.email}</p>
                                    </div>
                                    <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 my-1.5" />
                                    
                                    {/* Action Links */}
                                    <Link 
                                        href={route('profile.edit')}
                                        className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-left text-xs font-bold text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Yield */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>

            {/* --- MODAL DIALOGS --- */}
            <WorkspaceModal isOpen={isAddWorkspaceOpen} onClose={() => setIsAddWorkspaceOpen(false)} />
            <ProjectModal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} activeWorkspace={activeWorkspace} />
            <InviteModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} activeWorkspace={activeWorkspace} />
        </div>
    );
}
