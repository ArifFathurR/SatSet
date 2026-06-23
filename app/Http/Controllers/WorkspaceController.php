<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspaceRequest;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    /**
     * Show selection / listing of workspaces.
     */
    public function index()
    {
        $user = Auth::user();
        
        $ownedWorkspaces = Workspace::where('owner_id', $user->id)->get();
        $joinedWorkspaces = $user->joinedWorkspaces()->get();
        
        $allWorkspaces = $ownedWorkspaces->merge($joinedWorkspaces)->unique('id');

        // If user already has a workspace, redirect to the first one's board
        if ($allWorkspaces->count() > 0) {
            $firstWorkspace = $allWorkspaces->first();
            return redirect()->route('workspace.dashboard', ['workspace_slug' => $firstWorkspace->slug]);
        }

        return Inertia::render('Workspace/Index', [
            'workspaces' => $allWorkspaces,
        ]);
    }

    /**
     * Store a new workspace.
     */
    public function store(StoreWorkspaceRequest $request)
    {
        $validated = $request->validated();
        
        $workspace = DB::transaction(function () use ($validated) {
            $workspace = Workspace::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'owner_id' => Auth::id(),
            ]);

            // Add owner to workspace_users pivot
            $workspace->members()->attach(Auth::id(), ['role' => 'owner']);

            return $workspace;
        });

        return redirect()->route('workspace.dashboard', ['workspace_slug' => $workspace->slug])
            ->with('success', 'Workspace created successfully.');
    }

    /**
     * Invite member to workspace.
     */
    public function inviteMember(Request $request, $workspace_slug)
    {
        $workspace = Workspace::where('slug', $workspace_slug)->firstOrFail();
        
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'role' => ['required', 'string', 'in:admin,member,viewer'],
        ]);

        $userToInvite = \App\Models\User::where('email', $request->email)->first();

        // Check if already in workspace
        if ($workspace->members()->where('user_id', $userToInvite->id)->exists()) {
            return back()->withErrors(['email' => 'User is already a member of this workspace.']);
        }

        $workspace->members()->attach($userToInvite->id, ['role' => $request->role]);

        return back()->with('success', 'Member added successfully.');
    }

    /**
     * Show workspace members management view.
     */
    public function membersIndex(Request $request, $workspace_slug)
    {
        $workspace = $request->attributes->get('workspace');
        $projects = $request->attributes->get('projects');
        $workspaceMembers = $request->attributes->get('workspaceMembers');

        return Inertia::render('Workspace/Members', [
            'workspace' => $workspace,
            'projectsList' => $projects,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }

    /**
     * Update a workspace member's role.
     */
    public function updateMemberRole(Request $request, $workspace_slug, $member_id)
    {
        $workspace = $request->attributes->get('workspace');
        
        $request->validate([
            'role' => ['required', 'string', 'in:admin,member,viewer'],
        ]);

        // Prevent modifying owner role
        if ($workspace->owner_id == $member_id) {
            return back()->withErrors(['error' => 'Cannot modify owner role.']);
        }

        $workspace->members()->updateExistingPivot($member_id, [
            'role' => $request->role,
        ]);

        return back()->with('success', 'Member role updated successfully.');
    }

    /**
     * Remove a member from the workspace.
     */
    public function removeMember(Request $request, $workspace_slug, $member_id)
    {
        $workspace = $request->attributes->get('workspace');

        if ($workspace->owner_id == $member_id) {
            return back()->withErrors(['error' => 'Cannot remove the owner of the workspace.']);
        }

        $workspace->members()->detach($member_id);

        return back()->with('success', 'Member removed successfully.');
    }

    /**
     * Show calendar view of all tasks in this workspace.
     */
    public function calendarIndex(Request $request, $workspace_slug)
    {
        $workspace = $request->attributes->get('workspace');
        $projects = $request->attributes->get('projects');
        $workspaceMembers = $request->attributes->get('workspaceMembers');

        // Load tasks across all workspace projects
        $projectIds = $projects->pluck('id');
        $tasks = \App\Models\Task::whereIn('project_id', $projectIds)
            ->whereNotNull('due_date')
            ->with('assignee')
            ->get();

        return Inertia::render('Workspace/Calendar', [
            'workspace' => $workspace,
            'projectsList' => $projects,
            'workspaceMembers' => $workspaceMembers,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Render chat rooms / messages page.
     */
    public function messagesIndex(Request $request, $workspace_slug)
    {
        $workspace = $request->attributes->get('workspace');
        $projects = $request->attributes->get('projects');
        $workspaceMembers = $request->attributes->get('workspaceMembers');

        return Inertia::render('Workspace/Messages', [
            'workspace' => $workspace,
            'projectsList' => $projects,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }
}
