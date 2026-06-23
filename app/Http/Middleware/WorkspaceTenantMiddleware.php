<?php

namespace App\Http\Middleware;

use App\Models\Workspace;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceTenantMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $slug = $request->route('workspace_slug');
        if (!$slug) {
            abort(404);
        }

        // Fetch workspace
        $workspace = Workspace::where('slug', $slug)->first();
        if (!$workspace) {
            abort(404, 'Workspace not found.');
        }

        // Check if user is member of this workspace
        $isMember = $workspace->members()->where('user_id', $user->id)->exists();
        if (!$isMember) {
            abort(403, 'You do not have access to this workspace.');
        }

        // Fetch user's workspaces list for the sidebar switcher
        $ownedWorkspaces = Workspace::where('owner_id', $user->id)->get();
        $joinedWorkspaces = $user->joinedWorkspaces()->get();
        $workspacesList = $ownedWorkspaces->merge($joinedWorkspaces)->unique('id')->values();

        // Projects list inside active workspace
        $projectsList = $workspace->projects()->get();

        // Workspace members list for assignment & sidebar
        $workspaceMembers = $workspace->members()->get();

        // Share data globally with Inertia
        Inertia::share([
            'auth' => [
                'user' => $user,
            ],
            'activeWorkspace' => $workspace,
            'workspacesList' => $workspacesList,
            'projectsList' => $projectsList,
            'workspaceMembers' => $workspaceMembers,
        ]);

        // Attach objects to request attributes for access inside controllers
        $request->attributes->set('workspace', $workspace);
        $request->attributes->set('projects', $projectsList);
        $request->attributes->set('workspaceMembers', $workspaceMembers);

        return $next($request);
    }
}
