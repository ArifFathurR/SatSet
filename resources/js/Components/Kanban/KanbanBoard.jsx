import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

const COLUMNS = [
    { id: 'backlog', name: 'Baru', color: 'bg-red-500 border-red-500 text-red-500' },
    { id: 'todo', name: 'Rencana', color: 'bg-amber-500 border-amber-500 text-amber-500' },
    { id: 'progress', name: 'Dikerjakan', color: 'bg-indigo-500 border-indigo-500 text-indigo-500' },
    { id: 'review', name: 'Testing', color: 'bg-purple-500 border-purple-500 text-purple-500' },
    { id: 'done', name: 'Selesai', color: 'bg-emerald-500 border-emerald-500 text-emerald-500' }
];

export default function KanbanBoard({ tasks, onDragEnd, onAddTaskClick, onTaskClick, columns = COLUMNS }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full w-full gap-5 overflow-x-auto p-8 items-start">
                {columns.map((column) => {
                    const columnTasks = tasks
                        .filter(task => task.status === column.id)
                        .sort((a, b) => a.position - b.position);

                    return (
                        <KanbanColumn 
                            key={column.id} 
                            column={column} 
                            tasks={columnTasks} 
                            onAddTaskClick={() => onAddTaskClick(column.id)}
                            onTaskClick={onTaskClick}
                        />
                    );
                })}
            </div>
        </DragDropContext>
    );
}
export { COLUMNS };
