import React, { useState, useEffect } from 'react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Head, router } from '@inertiajs/react';
import { 
    CheckCircle2, ChevronRight, Table as TableIcon, User 
} from 'lucide-react';
import TaskModal from '@/Components/TaskModal';
import ProjectHeader from '@/Components/Project/ProjectHeader';
import KanbanBoard, { COLUMNS } from '@/Components/Kanban/KanbanBoard';
import ProjectOverview from '@/Components/Project/Overview';
import ProjectReports from '@/Components/Project/Reports';

export default function ProjectShow({ workspace, projectsList, workspacesList, workspaceMembers, project, tasks: initialTasks, auth }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [viewMode, setViewMode] = useState('board'); // board, table, list
    const [activeTab, setActiveTab] = useState('requests'); // overview, requests, reports, messages
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [addTaskStatus, setAddTaskStatus] = useState('backlog');

    // Sync task state when props change
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    // Calculate completion progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Drag End Handler
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Perform optimistic UI updates
        const updatedTasks = Array.from(tasks);
        const taskToMove = updatedTasks.find(t => t.id === draggableId);
        
        if (!taskToMove) return;

        // Remove from source column
        const sourceTasks = updatedTasks
            .filter(t => t.status === source.droppableId)
            .sort((a, b) => a.position - b.position);
        sourceTasks.splice(source.index, 1);

        // Add to destination column
        const destTasks = updatedTasks
            .filter(t => t.status === destination.droppableId)
            .sort((a, b) => a.position - b.position);
        
        if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, taskToMove);
            sourceTasks.forEach((t, index) => {
                t.position = index;
            });
        } else {
            destTasks.splice(destination.index, 0, taskToMove);
            taskToMove.status = destination.droppableId;
            
            sourceTasks.forEach((t, index) => {
                t.position = index;
            });
            destTasks.forEach((t, index) => {
                t.position = index;
            });
        }

        setTasks(updatedTasks);

        // Update database in background
        router.patch(
            route('tasks.reorder', { 
                workspace_slug: workspace.slug, 
                project: project.id, 
                task: draggableId 
            }), 
            {
                status: destination.droppableId,
                position: destination.index
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleOpenTask = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCreateTaskOpen = (status) => {
        setAddTaskStatus(status);
        setSelectedTask(null); // Indicates new task
        setIsTaskModalOpen(true);
    };

    // Helper to render priority tags
    const renderPriorityBadge = (priority) => {
        let colors = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-350 dark:border-zinc-700';
        if (priority === 'high') colors = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/50';
        else if (priority === 'medium') colors = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50';
        else if (priority === 'low') colors = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50';

        return (
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${colors}`}>
                {priority}
            </span>
        );
    };

    return (
        <SatSetLayout 
            activeWorkspace={workspace} 
            projectsList={projectsList} 
            workspacesList={workspacesList} 
            workspaceMembers={workspaceMembers} 
            auth={auth}
        >
            <Head title={`${project.name} - SatSet`} />
            
            <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100">
                
                {/* 1. PROJECT DASHBOARD HEADER */}
                <ProjectHeader 
                    projectName={project.name}
                    completionPercentage={completionPercentage}
                    workspaceMembers={workspaceMembers}
                    onAddMemberClick={() => router.get(route('workspace.members', { workspace_slug: workspace.slug }))}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* 2. TAB CONTENT PANELS */}
                <div className="flex-1 overflow-hidden bg-[#fafafa] dark:bg-zinc-950/20">
                    {activeTab === 'requests' && (
                        <>
                            {/* BOARD VIEW */}
                            {viewMode === 'board' && (
                                <KanbanBoard 
                                    tasks={tasks}
                                    onDragEnd={onDragEnd}
                                    onAddTaskClick={handleCreateTaskOpen}
                                    onTaskClick={handleOpenTask}
                                />
                            )}

                            {/* TABLE VIEW */}
                            {viewMode === 'table' && (
                                <div className="h-full w-full overflow-auto p-8">
                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                                                    <th className="p-4 pl-6">Title</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4">Priority</th>
                                                    <th className="p-4">Assignee</th>
                                                    <th className="p-4">Due Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tasks.map((task) => (
                                                    <tr 
                                                        key={task.id} 
                                                        onClick={() => handleOpenTask(task)}
                                                        className="border-b border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 cursor-pointer transition-colors"
                                                    >
                                                        <td className="p-4 pl-6 font-bold text-zinc-900 dark:text-zinc-150">{task.title}</td>
                                                        <td className="p-4">
                                                            <span className="capitalize font-semibold text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                                                                {COLUMNS.find(c => c.id === task.status)?.name || task.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">{renderPriorityBadge(task.priority)}</td>
                                                        <td className="p-4">
                                                            {task.assignee ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                                                                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-350">{task.assignee.name}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-xs text-zinc-500 dark:text-zinc-450">
                                                            {task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID') : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* LIST VIEW */}
                            {viewMode === 'list' && (
                                <div className="h-full w-full overflow-auto p-8 space-y-6">
                                    {COLUMNS.map((column) => {
                                        const columnTasks = tasks.filter(t => t.status === column.id);
                                        return (
                                            <div key={column.id} className="space-y-2">
                                                <h3 className="flex items-center gap-2 font-bold text-sm text-zinc-800 dark:text-zinc-200 px-2">
                                                    <div className={`h-2.5 w-2.5 rounded-full ${column.color.split(' ')[0]}`} />
                                                    <span>{column.name}</span>
                                                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-550">({columnTasks.length})</span>
                                                </h3>
                                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                                                    {columnTasks.map((task) => (
                                                        <div 
                                                            key={task.id}
                                                            onClick={() => handleOpenTask(task)}
                                                            className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 last:border-0 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <CheckCircle2 size={16} className={task.status === 'done' ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-700'} />
                                                                <span className="font-bold text-sm text-zinc-850 dark:text-zinc-200">{task.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {renderPriorityBadge(task.priority)}
                                                                {task.assignee && (
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-650 dark:text-zinc-350" title={task.assignee.name}>
                                                                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                )}
                                                                <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {columnTasks.length === 0 && (
                                                        <p className="p-4 text-xs italic text-zinc-400 dark:text-zinc-500 text-center">No tasks in this section</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'overview' && (
                        <ProjectOverview project={project} tasks={tasks} />
                    )}

                    {activeTab === 'reports' && (
                        <ProjectReports tasks={tasks} />
                    )}

                    {activeTab === 'messages' && (
                        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-950/20">
                            <div className="max-w-sm">
                                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Workspace Message Board</h3>
                                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    Project chat rooms have been centralized for this workspace. Click the Chat message icon in the far-left sidebar to open the Slack-style messaging workspace!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Task Details Modal (Tiptap Canvas) */}
                {isTaskModalOpen && (
                    <TaskModal 
                        isOpen={isTaskModalOpen}
                        onClose={() => setIsTaskModalOpen(false)}
                        task={selectedTask}
                        projectId={project.id}
                        workspaceSlug={workspace.slug}
                        workspaceMembers={workspaceMembers}
                        defaultStatus={addTaskStatus}
                    />
                )}
            </div>
        </SatSetLayout>
    );
}
