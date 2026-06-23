import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { LayoutGrid, Plus, Compass } from 'lucide-react';

export default function WorkspaceIndex({ workspaces, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        post(route('workspaces.store'));
    };

    return (
        <div className="flex min-h-screen w-screen bg-[#fafafa] font-sans items-center justify-center p-6 text-zinc-900">
            <Head title="Choose Workspace - SatSet" />

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left info column */}
                <div className="space-y-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-extrabold text-white shadow-lg shadow-indigo-600/20">
                        SS
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-950">Setup your Workspace</h1>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            SatSet is a hybrid kanban project tracker and document tool. Select an existing workspace or configure a new space for your team.
                        </p>
                    </div>

                    {/* Workspaces list if any */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Workspaces</h3>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                            {workspaces && workspaces.map((ws) => (
                                <Link
                                    key={ws.id}
                                    href={route('workspace.dashboard', { workspace_slug: ws.slug })}
                                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-350 hover:bg-zinc-50/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <Compass size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-800">{ws.name}</div>
                                            <div className="text-xs text-zinc-400">/w/{ws.slug}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Open Dashboard</span>
                                </Link>
                            ))}

                            {(!workspaces || workspaces.length === 0) && (
                                <p className="text-xs text-zinc-400 italic">No workspaces found. Create one on the right to start.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right creation column */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-zinc-900">Create a New Workspace</h2>
                    <p className="text-xs text-zinc-500 mt-1">Get started by filling in the details below.</p>
                    
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase">Workspace Name</label>
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
                                placeholder="e.g. Acme Agency"
                                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase">Slug URL</label>
                            <div className="flex mt-1.5 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden text-sm">
                                <span className="px-3.5 py-2.5 text-zinc-400 bg-zinc-100 border-r border-zinc-200 select-none">/w/</span>
                                <input 
                                    type="text"
                                    required
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="flex-1 bg-transparent px-3.5 py-2.5 outline-none font-semibold text-zinc-700"
                                />
                            </div>
                            {errors.slug && <span className="text-xs text-red-500 mt-1">{errors.slug}</span>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Plus size={16} />
                            <span>Create Workspace</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
