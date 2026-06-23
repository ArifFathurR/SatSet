import React, { useState } from 'react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Users, Plus, Shield, UserMinus, Mail } from 'lucide-react';
import InviteModal from '@/Components/Modals/InviteModal';
import Swal from 'sweetalert2';

export default function WorkspaceMembers({ workspace, projectsList, workspacesList, workspaceMembers, auth }) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const { errors } = usePage().props;

    const handleRoleChange = (memberId, role) => {
        router.patch(route('workspace.members.update', { workspace_slug: workspace.slug, member_id: memberId }), { role }, {
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Role updated',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            onError: () => {
                Swal.fire('Error', errors.error || 'Failed to update role.', 'error');
            }
        });
    };

    const handleRemoveMember = (memberId, name) => {
        Swal.fire({
            title: `Remove ${name}?`,
            text: 'They will lose access to all tasks and documents in this workspace.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#71717a',
            confirmButtonText: 'Yes, remove member'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('workspace.members.remove', { workspace_slug: workspace.slug, member_id: memberId }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Removed!',
                            text: 'Member has been removed from this workspace.',
                            icon: 'success',
                            confirmButtonColor: '#4f46e5',
                        });
                    },
                    onError: () => {
                        Swal.fire('Error', errors.error || 'Failed to remove member.', 'error');
                    }
                });
            }
        });
    };

    // Check if the current user is owner or admin of this workspace
    const currentUserRole = workspaceMembers.find(m => m.id === auth.user.id)?.pivot?.role;
    const isManager = currentUserRole === 'owner' || currentUserRole === 'admin';

    return (
        <SatSetLayout 
            activeWorkspace={workspace} 
            projectsList={projectsList} 
            workspacesList={workspacesList} 
            workspaceMembers={workspaceMembers} 
            auth={auth}
        >
            <Head title="Team Members - SatSet" />
            
            <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-950 p-8">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                            <Users size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-zinc-900 dark:text-zinc-50">Team Members</h1>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">Manage access and roles for collaborators in {workspace.name}.</p>
                        </div>
                    </div>

                    {isManager && (
                        <button 
                            onClick={() => setIsInviteOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={14} />
                            <span>Invite Collaborator</span>
                        </button>
                    )}
                </div>

                {/* Members list Table */}
                <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                                <th className="p-4 pl-6">Member</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workspaceMembers && workspaceMembers.map((member) => {
                                const isOwner = workspace.owner_id === member.id;
                                const isSelf = member.id === auth.user.id;

                                return (
                                    <tr 
                                        key={member.id} 
                                        className="border-b border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                    >
                                        {/* Profile */}
                                        <td className="p-4 pl-6 font-bold text-zinc-900 dark:text-zinc-150">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-850 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{member.name} {isSelf && <span className="text-[10px] text-indigo-650 bg-indigo-50 dark:bg-indigo-950/45 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold ml-1">You</span>}</div>
                                                    <div className="text-[10px] font-normal text-zinc-400">Joined via Workspace</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="p-4 text-zinc-600 dark:text-zinc-400 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Mail size={12} className="text-zinc-400" />
                                                {member.email}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="p-4">
                                            {isOwner ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-750 dark:text-indigo-300 text-xs font-bold border border-indigo-100/60 dark:border-indigo-900/30">
                                                    <Shield size={12} />
                                                    <span>Owner</span>
                                                </span>
                                            ) : isManager && !isSelf ? (
                                                <select
                                                    value={member.pivot?.role || 'member'}
                                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="member">Member</option>
                                                    <option value="viewer">Viewer</option>
                                                </select>
                                            ) : (
                                                <span className="capitalize font-semibold text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-350">
                                                    {member.pivot?.role || 'Member'}
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4">
                                            {!isOwner && isManager && !isSelf ? (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id, member.name)}
                                                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 transition-colors p-1"
                                                    title="Remove member"
                                                >
                                                    <UserMinus size={14} />
                                                    <span>Remove</span>
                                                </button>
                                            ) : (
                                                <span className="text-xs text-zinc-400 italic font-medium">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <InviteModal 
                isOpen={isInviteOpen} 
                onClose={() => setIsInviteOpen(false)} 
                activeWorkspace={workspace} 
            />
        </SatSetLayout>
    );
}
