import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ column, tasks, onAddTaskClick, onTaskClick }) {
    return (
        <div className="flex h-full w-[280px] flex-col rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 p-4">
            
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-800 dark:text-zinc-200">
                    <div className={`h-2.5 w-2.5 rounded-full ${column.color.split(' ')[0]}`} />
                    <span>{column.name}</span>
                    <span className="ml-1 rounded-full bg-zinc-250 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-550 dark:text-zinc-400">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Add New Request Button */}
            <button 
                onClick={onAddTaskClick}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-250 dark:border-zinc-850 bg-white dark:bg-zinc-950 py-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-indigo-300"
            >
                <Plus size={14} />
                <span>Add New Request</span>
            </button>

            {/* Droppable container */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-3 min-h-[150px] transition-all rounded-lg p-0.5 ${
                            snapshot.isDraggingOver ? 'bg-zinc-100/50 dark:bg-zinc-900/40' : ''
                        }`}
                    >
                        {tasks.map((task, index) => (
                            <KanbanCard 
                                key={task.id} 
                                task={task} 
                                index={index} 
                                onClick={() => onTaskClick(task)}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
