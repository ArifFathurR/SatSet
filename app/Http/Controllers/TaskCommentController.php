<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    /**
     * Store a comment on a task.
     */
    public function store(Request $request, $workspace_slug, Project $project, Task $task)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        TaskComment::create([
            'task_id' => $task->id,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Comment added.');
    }

    /**
     * Delete a comment.
     */
    public function destroy(Request $request, $workspace_slug, Project $project, Task $task, TaskComment $comment)
    {
        // Only comment author or workspace owner/admin can delete comments
        $workspace = $request->attributes->get('workspace');
        $isAuthor = $comment->user_id === Auth::id();
        
        $userRole = $workspace->members()->where('user_id', Auth::id())->first()?->pivot->role;
        $isAdminOrOwner = in_array($userRole, ['owner', 'admin']);

        if (!$isAuthor && !$isAdminOrOwner) {
            abort(403, 'Unauthorized to delete this comment.');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
