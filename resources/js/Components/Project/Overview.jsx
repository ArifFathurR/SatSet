import React from 'react';
import { Calendar, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export default function ProjectOverview({ project, tasks }) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const pending = total - completed;

    // Filter tasks with due dates and sort by nearest
    const upcomingDeadlines = tasks
        .filter(t => t.due_date && t.status !== 'done')
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 4);

    return (
        <div className="h-full w-full overflow-y-auto p-8 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/20">
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* 1. Project Info Card */}
                <div className="md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 mb-3">
                            <Compass size={18} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">About Project</h3>
                        </div>
                        <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50">{project.name}</h2>
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {project.description || 'No description provided for this project. Update settings to describe its scope.'}
                        </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-850 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{total}</div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase">Total Tasks</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-emerald-650 dark:text-emerald-450">{completed}</div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase">Completed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-indigo-650 dark:text-indigo-400">{pending}</div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase">Pending</div>
                        </div>
                    </div>
                </div>

                {/* 2. Timeline Card */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 mb-4">
                        <Calendar size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Upcoming Deadlines</h3>
                    </div>

                    <div className="space-y-3.5">
                        {upcomingDeadlines.map((task) => (
                            <div key={task.id} className="flex items-start gap-2.5 text-xs">
                                <div className="mt-0.5 text-amber-500">
                                    <AlertCircle size={14} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-zinc-800 dark:text-zinc-250 truncate leading-snug">
                                        {task.title}
                                    </div>
                                    <div className="text-[10px] text-zinc-400 mt-0.5">
                                        Due {new Date(task.due_date).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {upcomingDeadlines.length === 0 && (
                            <p className="text-xs text-zinc-400 italic text-center py-6">No upcoming deadlines found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
