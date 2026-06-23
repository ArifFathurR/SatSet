import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function InviteModal({ isOpen, onClose, activeWorkspace }) {
    if (!isOpen || !activeWorkspace) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'member',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('workspace.invite', { workspace_slug: activeWorkspace.slug }), {
            onSuccess: () => {
                onClose();
                reset();
                Swal.fire({
                    title: 'Invitation Sent!',
                    text: `User "${data.email}" has been added to the workspace.`,
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
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Add Team Member</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Invite a registered user to the {activeWorkspace.name} workspace.</p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">User Email</label>
                        <input 
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="collaborator@example.com"
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Role Level</label>
                        <select 
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="admin">Admin (Manage settings, members, tasks)</option>
                            <option value="member">Member (Create and edit tasks/documents)</option>
                            <option value="viewer">Viewer (View-only permission)</option>
                        </select>
                        {errors.role && <span className="text-xs text-red-500 mt-1 block">{errors.role}</span>}
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
                            <UserPlus size={15} />
                            <span>Add Member</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
