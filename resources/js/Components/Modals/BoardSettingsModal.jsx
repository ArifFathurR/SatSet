import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

// Standard colors available for columns
const COLOR_OPTIONS = [
    { value: 'bg-zinc-500 border-zinc-500 text-zinc-500', label: 'Gray' },
    { value: 'bg-red-500 border-red-500 text-red-500', label: 'Red' },
    { value: 'bg-orange-500 border-orange-500 text-orange-500', label: 'Orange' },
    { value: 'bg-amber-500 border-amber-500 text-amber-500', label: 'Yellow' },
    { value: 'bg-emerald-500 border-emerald-500 text-emerald-500', label: 'Green' },
    { value: 'bg-cyan-500 border-cyan-500 text-cyan-500', label: 'Cyan' },
    { value: 'bg-blue-500 border-blue-500 text-blue-500', label: 'Blue' },
    { value: 'bg-indigo-500 border-indigo-500 text-indigo-500', label: 'Indigo' },
    { value: 'bg-violet-500 border-violet-500 text-violet-500', label: 'Violet' },
    { value: 'bg-pink-500 border-pink-500 text-pink-500', label: 'Pink' },
];

export default function BoardSettingsModal({ isOpen, onClose, project, activeColumns, workspaceSlug }) {
    if (!isOpen) return null;

    const { data, setData, patch, processing } = useForm({
        custom_columns: project.custom_columns || activeColumns.map(c => ({ ...c }))
    });

    const handleAddColumn = () => {
        setData('custom_columns', [
            ...data.custom_columns,
            { 
                id: `col_${Date.now()}`, 
                name: 'New Column', 
                color: COLOR_OPTIONS[0].value 
            }
        ]);
    };

    const handleRemoveColumn = (indexToRemove) => {
        if (data.custom_columns.length <= 1) {
            Swal.fire('Error', 'You must have at least one column.', 'error');
            return;
        }
        setData('custom_columns', data.custom_columns.filter((_, index) => index !== indexToRemove));
    };

    const handleChangeColumn = (index, field, value) => {
        const newColumns = [...data.custom_columns];
        newColumns[index][field] = value;
        setData('custom_columns', newColumns);
    };

    const moveColumn = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newColumns = [...data.custom_columns];
            [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
            setData('custom_columns', newColumns);
        } else if (direction === 'down' && index < data.custom_columns.length - 1) {
            const newColumns = [...data.custom_columns];
            [newColumns[index + 1], newColumns[index]] = [newColumns[index], newColumns[index + 1]];
            setData('custom_columns', newColumns);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('projects.update', { workspace_slug: workspaceSlug, project: project.id }), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                Swal.fire({
                    title: 'Columns Updated',
                    text: 'The board has been updated with your custom columns.',
                    icon: 'success',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        });
    };

    const handleResetToDefault = () => {
        patch(route('projects.update', { workspace_slug: workspaceSlug, project: project.id }), {
            data: { custom_columns: null },
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="w-[500px] max-h-[85vh] flex flex-col rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-2xl animate-in fade-in duration-150">
                
                <div className="flex justify-between items-center p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Board Settings</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Customize the Kanban columns for {project.name}.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6 space-y-4">
                    <div className="space-y-3">
                        {data.custom_columns.map((column, index) => (
                            <div key={column.id} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2">
                                <div className="flex flex-col gap-1 text-zinc-400">
                                    <button type="button" onClick={() => moveColumn(index, 'up')} disabled={index === 0} className="hover:text-zinc-700 disabled:opacity-30">
                                        <GripVertical size={14} className="rotate-90" />
                                    </button>
                                    <button type="button" onClick={() => moveColumn(index, 'down')} disabled={index === data.custom_columns.length - 1} className="hover:text-zinc-700 disabled:opacity-30">
                                        <GripVertical size={14} className="rotate-90" />
                                    </button>
                                </div>
                                
                                <div className="flex-1 flex items-center gap-3">
                                    <input 
                                        type="text"
                                        value={column.name}
                                        onChange={(e) => handleChangeColumn(index, 'name', e.target.value)}
                                        className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                        placeholder="Column Name"
                                    />
                                    <select
                                        value={column.color}
                                        onChange={(e) => handleChangeColumn(index, 'color', e.target.value)}
                                        className="w-32 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                                    >
                                        {COLOR_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveColumn(index)}
                                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                    title="Remove column"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        type="button" 
                        onClick={handleAddColumn}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                        <Plus size={16} />
                        Add New Column
                    </button>
                </div>

                <div className="flex justify-between items-center p-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-xl">
                    <button 
                        type="button"
                        onClick={handleResetToDefault}
                        className="text-xs font-semibold text-zinc-500 hover:text-red-500 underline decoration-zinc-300 underline-offset-4"
                    >
                        Reset to Defaults
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-650 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            Save Columns
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
