import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, Paperclip, User } from 'lucide-react';

export default function KanbanCard({ task, index, onClick }) {
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

    // Helper to retrieve category tag for visual aesthetic matching mockup
    const getMockTag = (title) => {
        if (title.toLowerCase().includes('design') || title.toLowerCase().includes('toggle')) return { label: 'Design', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50' };
        if (title.toLowerCase().includes('excel') || title.toLowerCase().includes('report')) return { label: 'Data & Report', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/50' };
        if (title.toLowerCase().includes('journey') || title.toLowerCase().includes('persona') || title.toLowerCase().includes('competitor')) return { label: 'SaaS', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/50' };
        if (title.toLowerCase().includes('login') || title.toLowerCase().includes('loop') || title.toLowerCase().includes('align')) return { label: 'Bug', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/50' };
        return { label: 'Core', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50' };
    };

    // Render plain text preview from Tiptap JSON content structure
    const getContentPreview = (content) => {
        if (!content) return 'No description provided...';
        try {
            if (typeof content === 'string') {
                return content.replace(/<[^>]*>/g, '').substring(0, 100);
            }
            if (content.content && content.content[1]) {
                return content.content[1].content?.[0]?.text || content.content[0].content?.[0]?.text || 'No description...';
            }
            if (content.content && content.content[0]) {
                return content.content[0].content?.[0]?.text || 'No description...';
            }
            return 'Document notes inside...';
        } catch (e) {
            return 'Document notes inside...';
        }
    };

    const tag = getMockTag(task.title);
    const commentsCount = task.comments ? task.comments.length : 0;

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    className={`flex flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-4 shadow-sm transition-all hover:border-zinc-450 hover:shadow duration-200 cursor-grab active:cursor-grabbing select-none ${
                        snapshot.isDragging ? 'shadow-md ring-1 ring-indigo-500/10 dark:bg-zinc-900' : ''
                    }`}
                >
                    {/* Card Category Badge & Priority */}
                    <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tag.color}`}>
                            {tag.label}
                        </span>
                        {renderPriorityBadge(task.priority)}
                    </div>

                    {/* Card Title */}
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {task.title}
                    </h4>

                    {/* Description preview */}
                    <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {getContentPreview(task.content)}
                    </p>

                    {/* Footer: User avatar & Indicators */}
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850 pt-3">
                        <div className="flex items-center gap-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 border border-white dark:border-zinc-900">
                                {task.assignee ? task.assignee.name.split(' ').map(n => n[0]).join('') : <User size={10} />}
                            </div>
                            {task.assignee && (
                                <span className="text-[10px] font-medium text-zinc-400">{task.assignee.name.split(' ')[0]}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5 text-zinc-400">
                            <div className="flex items-center gap-1 text-[10px]">
                                <MessageSquare size={11} />
                                <span>{commentsCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                                <Paperclip size={11} />
                                <span>1</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
