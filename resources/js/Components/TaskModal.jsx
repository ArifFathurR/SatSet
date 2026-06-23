import React, { useEffect, useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
    X, Trash2, Bold, Italic, List, ListOrdered, 
    Code, Heading1, Heading2, SquareCode, Save, Send
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function TaskModal({ isOpen, onClose, task, projectId, workspaceSlug, workspaceMembers, defaultStatus }) {
    const isEditing = !!task;
    const { auth } = usePage().props;
    const [newComment, setNewComment] = useState('');

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        title: task ? task.title : '',
        status: task ? task.status : defaultStatus,
        priority: task ? task.priority : 'medium',
        assigned_to: task ? (task.assigned_to || '') : '',
        due_date: task && task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        content: task ? task.content : null,
    });

    // Initialize Tiptap Editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: data.content,
        onUpdate: ({ editor }) => {
            setData('content', editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-zinc dark:prose-invert focus:outline-none max-w-none min-h-[250px] text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed',
            },
        },
    });

    // Sync editor content when active task changes
    useEffect(() => {
        if (editor && task) {
            editor.commands.setContent(task.content || '');
            setData({
                title: task.title,
                status: task.status,
                priority: task.priority,
                assigned_to: task.assigned_to || '',
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                content: task.content,
            });
        } else if (editor && !task) {
            editor.commands.setContent('');
            reset();
        }
    }, [task, editor]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('tasks.update', { workspace_slug: workspaceSlug, project: projectId, task: task.id }), {
                onSuccess: () => {
                    onClose();
                    Swal.fire({
                        title: 'Request Updated!',
                        text: 'Your task has been successfully updated.',
                        icon: 'success',
                        confirmButtonColor: '#4f46e5',
                    });
                }
            });
        } else {
            post(route('tasks.store', { workspace_slug: workspaceSlug, project: projectId }), {
                onSuccess: () => {
                    onClose();
                    Swal.fire({
                        title: 'Request Created!',
                        text: 'A new request has been added to the board.',
                        icon: 'success',
                        confirmButtonColor: '#4f46e5',
                    });
                }
            });
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Delete this task?',
            text: 'This will permanently remove the task and all associated comments.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#71717a',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('tasks.destroy', { workspace_slug: workspaceSlug, project: projectId, task: task.id }), {
                    onSuccess: () => {
                        onClose();
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your request has been deleted.',
                            icon: 'success',
                            confirmButtonColor: '#4f46e5'
                        });
                    }
                });
            }
        });
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        router.post(
            route('comments.store', { workspace_slug: workspaceSlug, project: projectId, task: task.id }),
            { content: newComment },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewComment('');
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Comment added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        );
    };

    const handleDeleteComment = (commentId) => {
        Swal.fire({
            title: 'Delete comment?',
            text: 'This comment will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#71717a',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    route('comments.destroy', { 
                        workspace_slug: workspaceSlug, 
                        project: projectId, 
                        task: task.id, 
                        comment: commentId 
                    }),
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'Comment deleted',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    }
                );
            }
        });
    };

    // Render Editor Toolbar helper
    const Toolbar = () => {
        if (!editor) return null;

        const btnClass = (active) => 
            `p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 ${
                active ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 font-bold' : ''
            }`;

        return (
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-150 dark:border-zinc-800 pb-3 mb-4">
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    className={btnClass(editor.isActive('bold'))}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    className={btnClass(editor.isActive('italic'))}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()} 
                    className={btnClass(editor.isActive('code'))}
                    title="Inline Code"
                >
                    <Code size={16} />
                </button>
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                    className={btnClass(editor.isActive('heading', { level: 1 }))}
                    title="Heading 1"
                >
                    <Heading1 size={16} />
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                    className={btnClass(editor.isActive('heading', { level: 2 }))}
                    title="Heading 2"
                >
                    <Heading2 size={16} />
                </button>
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    className={btnClass(editor.isActive('bulletList'))}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                    className={btnClass(editor.isActive('orderedList'))}
                    title="Ordered List"
                >
                    <ListOrdered size={16} />
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                    className={btnClass(editor.isActive('codeBlock'))}
                    title="Code Block"
                >
                    <SquareCode size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="max-w-4xl w-[90vw] h-[85vh] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl flex overflow-hidden flex-col animate-in fade-in duration-200 text-zinc-850 dark:text-zinc-100">
                
                {/* Modal Header */}
                <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-white dark:bg-zinc-950">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        {isEditing ? 'Edit Request / Note' : 'Add New Request'}
                    </span>
                    <button 
                        onClick={onClose} 
                        className="rounded-lg p-1.5 text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
                    
                    {/* Left Panel: Content & Tiptap Canvas + Comments Section */}
                    <div className="flex flex-1 flex-col overflow-y-auto p-8 bg-white dark:bg-zinc-950">
                        {/* Title input */}
                        <div>
                            <input 
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Request Title"
                                className="w-full border-0 p-0 text-2xl font-black text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-350 bg-transparent focus:ring-0 outline-none leading-none mb-1"
                            />
                            {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                        </div>
                        
                        <div className="my-5 border-t border-zinc-100 dark:border-zinc-850" />
                        
                        {/* Editor Toolbar & Canvas */}
                        <div className="flex flex-col min-h-[300px]">
                            <Toolbar />
                            <div className="flex-1 custom-editor">
                                <EditorContent editor={editor} />
                            </div>
                        </div>

                        {/* Comments Section (Only when editing a task) */}
                        {isEditing && (
                            <div className="mt-8 border-t border-zinc-150 dark:border-zinc-800 pt-6">
                                <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-4">
                                    Comments ({task.comments ? task.comments.length : 0})
                                </h3>

                                {/* Post Comment Form */}
                                <div className="flex gap-3 items-start mb-6">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300 text-xs border border-indigo-200 dark:border-indigo-900 flex-shrink-0">
                                        {auth.user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                        <input 
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-850 dark:text-zinc-150 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddComment}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Stream */}
                                <div className="space-y-4">
                                    {task.comments && task.comments.map((comment) => {
                                        const isCommentAuthor = comment.user_id === auth.user.id;
                                        return (
                                            <div key={comment.id} className="flex gap-3 items-start text-xs group">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-350 flex-shrink-0">
                                                    {comment.user ? comment.user.name.split(' ').map(n => n[0]).join('') : '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                            {comment.user ? comment.user.name : 'Unknown User'}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400">
                                                            {new Date(comment.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-zinc-650 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-150 dark:border-zinc-800/80">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                {isCommentAuthor && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-zinc-350 hover:text-red-600 transition-colors self-center p-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 opacity-0 group-hover:opacity-100"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {(!task.comments || task.comments.length === 0) && (
                                        <p className="text-xs text-zinc-400 italic text-center py-2">No comments yet. Start the conversation!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Settings Sidebar */}
                    <div className="w-[280px] bg-zinc-50 dark:bg-zinc-900/40 border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6">
                        
                        <div className="space-y-5">
                            {/* Status */}
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Status</label>
                                <select 
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="backlog">Baru</option>
                                    <option value="todo">Rencana</option>
                                    <option value="progress">Dikerjakan</option>
                                    <option value="review">Testing</option>
                                    <option value="done">Selesai</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Priority</label>
                                <select 
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Assignee */}
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Assignee</label>
                                <select 
                                    value={data.assigned_to}
                                    onChange={(e) => setData('assigned_to', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="">Unassigned</option>
                                    {workspaceMembers && workspaceMembers.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Due Date</label>
                                <input 
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-750 dark:text-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Panel footer buttons */}
                        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-5 mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-650/10 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={13} />
                                <span>Save Request</span>
                            </button>
                            
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs font-bold text-red-650 dark:text-red-400 transition-colors hover:bg-red-100/70"
                                >
                                    <Trash2 size={13} />
                                    <span>Delete Request</span>
                                </button>
                            )}
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
