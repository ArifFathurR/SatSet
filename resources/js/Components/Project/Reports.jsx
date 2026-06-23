import React from 'react';
import { BarChart3, PieChart, Layers, ShieldAlert } from 'lucide-react';

export default function ProjectReports({ tasks }) {
    const total = tasks.length;
    
    // Status breakdowns
    const backlog = tasks.filter(t => t.status === 'backlog').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;

    // Priority breakdowns
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    // Percent helpers
    const pct = (val) => {
        if (total === 0) return 0;
        return Math.round((val / total) * 100);
    };

    return (
        <div className="h-full w-full overflow-y-auto p-8 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/20">
            
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. Task Status Distribution */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 mb-6">
                        <BarChart3 size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Status Distribution</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Baru (Backlog)', count: backlog, color: 'bg-red-500' },
                            { name: 'Rencana (Todo)', count: todo, color: 'bg-amber-500' },
                            { name: 'Dikerjakan (In Progress)', count: progress, color: 'bg-indigo-600' },
                            { name: 'Testing (Review)', count: review, color: 'bg-purple-500' },
                            { name: 'Selesai (Done)', count: done, color: 'bg-emerald-500' }
                        ].map((stat, idx) => {
                            const percent = pct(stat.count);
                            return (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        <span>{stat.name}</span>
                                        <span className="font-black text-zinc-900 dark:text-zinc-50">{stat.count} ({percent}%)</span>
                                    </div>
                                    <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                        <div 
                                            className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Priority Distribution */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 mb-6">
                        <ShieldAlert size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Priority Distribution</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'High Priority', count: high, color: 'bg-rose-500' },
                            { name: 'Medium Priority', count: medium, color: 'bg-amber-500' },
                            { name: 'Low Priority', count: low, color: 'bg-emerald-500' }
                        ].map((prio, idx) => {
                            const percent = pct(prio.count);
                            return (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        <span>{prio.name}</span>
                                        <span className="font-black text-zinc-900 dark:text-zinc-50">{prio.count} ({percent}%)</span>
                                    </div>
                                    <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                        <div 
                                            className={`h-full ${prio.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
