import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SatSetLayout from '@/Layouts/SatSetLayout';
import { Settings, Save, Trash2, AlertTriangle, Shield, Globe, Code2, NotebookPen } from 'lucide-react';
import Swal from 'sweetalert2';

export default function WorkspaceSettings({ workspace, projectsList, workspaceMembers, auth }) {

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: workspace.name,
        type: workspace.type,
    });

    const [deleteInput, setDeleteInput] = useState('');
    const deleteConfirmText = workspace.name;

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('workspace.update', { workspace_slug: workspace.slug }), {
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Workspace berhasil diperbarui',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const handleDelete = () => {
        if (deleteInput !== deleteConfirmText) return;

        Swal.fire({
            title: 'Hapus Workspace?',
            html: `Semua proyek dan tugas di dalam <strong>${workspace.name}</strong> akan dihapus permanen dan tidak dapat dipulihkan.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#71717a',
            confirmButtonText: 'Ya, hapus sekarang!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('workspace.destroy', { workspace_slug: workspace.slug }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Workspace Dihapus',
                            text: 'Workspace berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#4f46e5',
                        });
                    },
                });
            }
        });
    };

    return (
        <SatSetLayout
            activeWorkspace={workspace}
            workspacesList={[workspace]}
            projectsList={projectsList}
            workspaceMembers={workspaceMembers}
            auth={auth}
        >
            <Head title={`Settings – ${workspace.name}`} />

            <div className="h-full overflow-y-auto p-8 bg-[#fafafa] dark:bg-zinc-950">
                <div className="max-w-2xl space-y-8">

                    {/* Page Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">Pengaturan Workspace</h1>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                                Hanya <span className="text-indigo-600 font-bold">Owner</span> yang dapat mengubah pengaturan ini.
                            </p>
                        </div>
                    </div>

                    {/* Owner Badge */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 px-4 py-3">
                        <Shield size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            Anda adalah <strong>Owner</strong> workspace ini. Perubahan yang dibuat akan berlaku untuk seluruh anggota tim.
                        </p>
                    </div>

                    {/* ─── GENERAL SETTINGS CARD ─── */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Informasi Umum</h2>
                            <p className="text-xs text-zinc-400 mt-0.5">Ubah nama dan tipe workspace.</p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            {/* Workspace Name */}
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                    Nama Workspace
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Tim Produk Kami"
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Workspace Slug (read-only) */}
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                    Slug URL <span className="normal-case font-normal text-zinc-400">(tidak bisa diubah)</span>
                                </label>
                                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/60 px-4 py-2.5">
                                    <Globe size={14} className="text-zinc-400 shrink-0" />
                                    <span className="text-sm font-mono text-zinc-500">/w/{workspace.slug}</span>
                                </div>
                            </div>

                            {/* Workspace Type */}
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                    Tipe Workspace
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Software Dev */}
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'software')}
                                        className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all ${
                                            data.type === 'software'
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                                                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Code2 size={15} className={data.type === 'software' ? 'text-indigo-600' : 'text-zinc-400'} />
                                            <span className={`text-xs font-extrabold uppercase tracking-tight ${data.type === 'software' ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                                Software Dev
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 leading-snug">5 Status: Baru, Rencana, Kerja, Testing, Selesai.</p>
                                    </button>

                                    {/* Casual */}
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'casual')}
                                        className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all ${
                                            data.type === 'casual'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                                                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <NotebookPen size={15} className={data.type === 'casual' ? 'text-emerald-600' : 'text-zinc-400'} />
                                            <span className={`text-xs font-extrabold uppercase tracking-tight ${data.type === 'casual' ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                                Casual Work
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 leading-snug">3 Status: Rencana, Dikerjakan, Selesai. Cocok untuk log harian.</p>
                                    </button>
                                </div>
                                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors disabled:opacity-60"
                                >
                                    <Save size={14} />
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ─── DANGER ZONE CARD ─── */}
                    <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={15} className="text-red-500" />
                                <h2 className="text-sm font-extrabold text-red-700 dark:text-red-400 uppercase tracking-tight">Danger Zone</h2>
                            </div>
                            <p className="text-xs text-red-500/80 dark:text-red-400/70 mt-0.5">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="rounded-xl bg-red-50/60 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 p-4 space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Hapus Workspace Ini</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                        Menghapus workspace akan <strong className="text-red-600">menghapus seluruh proyek, tugas, dan data anggota</strong> di dalamnya secara permanen. Tindakan ini tidak bisa dibatalkan.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                        Ketik <span className="text-red-600 font-black">"{deleteConfirmText}"</span> untuk mengkonfirmasi
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteInput}
                                        onChange={(e) => setDeleteInput(e.target.value)}
                                        placeholder={deleteConfirmText}
                                        className="w-full rounded-lg border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-mono text-zinc-800 dark:text-zinc-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteInput !== deleteConfirmText}
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-500/20"
                                >
                                    <Trash2 size={14} />
                                    Hapus Workspace Permanen
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SatSetLayout>
    );
}
