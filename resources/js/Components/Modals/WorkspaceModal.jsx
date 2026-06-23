import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function WorkspaceModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        type: 'software',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let targetSlug = data.slug;
        if (!targetSlug) {
            targetSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        post(route('workspaces.store'), {
            data: { ...data, slug: targetSlug },
            onSuccess: () => {
                onClose();
                reset();
                Swal.fire({
                    title: 'Workspace Created!',
                    text: `Your workspace "${data.name}" was created successfully.`,
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
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Create Workspace</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Isolate your projects and members in a new workspace.</p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Workspace Name</label>
                        <input 
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    name: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                });
                            }}
                            placeholder="e.g. Acme Studio"
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Slug Route</label>
                        <div className="flex mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden text-sm">
                            <span className="px-3 py-2 text-zinc-400 bg-zinc-100 border-r border-zinc-200 dark:bg-zinc-850 dark:border-zinc-800 select-none">/w/</span>
                            <input 
                                type="text"
                                required
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className="flex-1 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-zinc-100"
                            />
                        </div>
                        {errors.slug && <span className="text-xs text-red-500 mt-1 block">{errors.slug}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Tipe Workspace</label>
                        <div className="grid grid-cols-2 gap-3 mt-1.5">
                            <label className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                data.type === 'software' 
                                    ? 'border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/20' 
                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-305 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    value="software" 
                                    checked={data.type === 'software'} 
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="sr-only" 
                                />
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">💻 Software Dev</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">5 Status: Baru, Rencana, Kerja, Testing, Selesai.</span>
                            </label>
                            
                            <label className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                data.type === 'casual' 
                                    ? 'border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/20' 
                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-305 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    value="casual" 
                                    checked={data.type === 'casual'} 
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="sr-only" 
                                />
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">📝 Casual Work</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">3 Status: Rencana, Dikerjakan, Selesai. Cocok untuk log harian.</span>
                            </label>
                        </div>
                        {errors.type && <span className="text-xs text-red-500 mt-1 block">{errors.type}</span>}
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
                            <span>Create Workspace</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
