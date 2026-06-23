import React, { useState } from 'react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, FolderPlus } from 'lucide-react';

export default function EmptyProject({ workspace, projectsList, workspacesList, workspaceMembers, auth }) {
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const form = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('projects.store', { workspace_slug: workspace.slug }), {
            onSuccess: () => {
                setIsAddProjectOpen(false);
                form.reset();
            }
        });
    };

    return (
        <SatSetLayout 
            activeWorkspace={workspace} 
            projectsList={projectsList} 
            workspacesList={workspacesList} 
            workspaceMembers={workspaceMembers} 
            auth={auth}
        >
            <Head title="No Projects Found - SatSet" />
            
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa] p-8">
                <div className="flex flex-col items-center max-w-md text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                        <FolderPlus size={28} />
                    </div>
                    <h2 className="mt-6 text-xl font-bold text-zinc-900">Welcome to {workspace.name}!</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        To get started with tracking tasks and drafting documents, create your very first project under this workspace.
                    </p>
                    <button
                        onClick={() => setIsAddProjectOpen(true)}
                        className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all hover:shadow-lg"
                    >
                        <Plus size={16} />
                        <span>Create Project</span>
                    </button>
                </div>
            </div>

            {/* Inline Add Project Modal */}
            {isAddProjectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="w-[420px] rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl animate-in fade-in duration-150">
                        <h3 className="text-lg font-bold text-zinc-950">Add Project</h3>
                        <p className="text-xs text-zinc-500 mt-1">Create a new project dashboard under {workspace.name}.</p>
                        
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase">Project Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="e.g. Marketing Site"
                                    className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {form.errors.name && <span className="text-xs text-red-500 mt-1">{form.errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase font-sans">Description (Optional)</label>
                                <textarea 
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Brief outline of the project scope..."
                                    className="mt-1.5 w-full h-20 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                                />
                                {form.errors.description && <span className="text-xs text-red-500 mt-1">{form.errors.description}</span>}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsAddProjectOpen(false); form.reset(); }}
                                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-650 hover:bg-zinc-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={form.processing}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Add Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SatSetLayout>
    );
}
