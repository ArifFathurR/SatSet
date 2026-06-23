import React, { useState } from 'react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User } from 'lucide-react';
import TaskModal from '@/Components/TaskModal';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WorkspaceCalendar({ workspace, projectsList, workspacesList, workspaceMembers, tasks, auth }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Calculate calendar days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const prevMonthDays = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        prevMonthDays.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            date: new Date(year, month - 1, daysInPrevMonth - i)
        });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i)
        });
    }

    const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = [];
    for (let i = 1; i <= remainingCells; i++) {
        nextMonthDays.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i)
        });
    }

    const calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    // Filter tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const handleTaskClick = (task, e) => {
        e.stopPropagation();
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    return (
        <SatSetLayout 
            activeWorkspace={workspace} 
            projectsList={projectsList} 
            workspacesList={workspacesList} 
            workspaceMembers={workspaceMembers} 
            auth={auth}
        >
            <Head title="Calendar - SatSet" />
            
            <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-950 p-8">
                
                {/* Calendar Header Tools */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-zinc-900 dark:text-zinc-50">Workspace Calendar</h1>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">Track deadlines across all projects in {workspace.name}.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1.5 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                        <button 
                            onClick={handlePrevMonth}
                            className="p-1 rounded hover:bg-white dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200 min-w-[120px] text-center select-none">
                            {MONTH_NAMES[month]} {year}
                        </span>
                        <button 
                            onClick={handleNextMonth}
                            className="p-1 rounded hover:bg-white dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid Container */}
                <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900/30 flex flex-col shadow-sm">
                    {/* Days of Week headers */}
                    <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/65 py-2">
                        {DAY_NAMES.map(day => (
                            <div key={day} className="text-center text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Cells Grid */}
                    <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-zinc-200 dark:divide-zinc-800 border-l border-t border-transparent">
                        {calendarDays.map((cell, index) => {
                            const dateTasks = getTasksForDate(cell.date);
                            const isToday = new Date().toDateString() === cell.date.toDateString();

                            return (
                                <div 
                                    key={index}
                                    className={`p-2 flex flex-col justify-between min-h-[90px] transition-all bg-white dark:bg-zinc-950 ${
                                        cell.isCurrentMonth ? '' : 'bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-350 dark:text-zinc-600'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${
                                            isToday 
                                                ? 'bg-indigo-650 text-white shadow-sm shadow-indigo-500/20' 
                                                : cell.isCurrentMonth ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-350 dark:text-zinc-650'
                                        }`}>
                                            {cell.day}
                                        </span>
                                        {dateTasks.length > 0 && (
                                            <span className="text-[9px] font-extrabold text-indigo-550 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded-full border border-indigo-100/60 dark:border-indigo-900/30">
                                                {dateTasks.length} task{dateTasks.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    {/* Small task list inside grid cell */}
                                    <div className="mt-2 flex-1 overflow-y-auto space-y-1 pr-0.5 max-h-[85px] custom-scrollbar">
                                        {dateTasks.map(task => {
                                            let priorityColor = 'border-l-zinc-300';
                                            if (task.priority === 'high') priorityColor = 'border-l-rose-500 bg-rose-50/30 dark:bg-rose-950/10 text-rose-700 dark:text-rose-300';
                                            else if (task.priority === 'medium') priorityColor = 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10 text-amber-700 dark:text-amber-300';
                                            else if (task.priority === 'low') priorityColor = 'border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-300';

                                            return (
                                                <div 
                                                    key={task.id}
                                                    onClick={(e) => handleTaskClick(task, e)}
                                                    className={`text-[9px] font-bold py-1 px-1.5 rounded border border-zinc-200 dark:border-zinc-800 border-l-3 truncate cursor-pointer transition-all hover:shadow-sm ${priorityColor}`}
                                                >
                                                    {task.title}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Task modal editing trigger */}
            {isTaskModalOpen && (
                <TaskModal 
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    task={selectedTask}
                    projectId={selectedTask?.project_id}
                    workspaceSlug={workspace.slug}
                    workspaceMembers={workspaceMembers}
                    defaultStatus={selectedTask?.status}
                />
            )}
        </SatSetLayout>
    );
}
