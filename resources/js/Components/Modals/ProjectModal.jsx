import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProjectModal({ isOpen, onClose, activeWorkspace }) {
    if (!isOpen || !activeWorkspace) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        is_private: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.store', { workspace_slug: activeWorkspace.slug }), {
            onSuccess: () => {
                onClose();
                reset();
                Swal.fire({
                    title: 'Project Added!',
                    text: `Project "${data.name}" was created successfully.`,
                    icon: 'success',
                    confirmButtonColor: '#4f46e5',
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="w-[420px] rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 p-6 shadow-2xl animate-in fade-in duration-150">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Add Project</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Create a new project dashboard under {activeWorkspace.name}.</p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Project Name</label>
                        <input 
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Marketing Site"
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Description (Optional)</label>
                        <textarea 
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief outline of the project scope..."
                            className="mt-1.5 w-full h-20 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                        {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>}
                    </div>

                    <div>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            <input 
                                type="checkbox"
                                checked={data.is_private}
                                onChange={(e) => setData('is_private', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-600"
                            />
                            <div>
                                <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Private Project</span>
                                <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Only you can view and access this project dashboard.</span>
                            </div>
                        </label>
                        {errors.is_private && <span className="text-xs text-red-500 mt-1 block">{errors.is_private}</span>}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="rounded-lg border border-zinc-200 dark:border-zinc-800 dark:text-zinc-350 dark:hover:bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-650 hover:bg-zinc-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <Plus size={15} />
                            <span>Add Project</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
