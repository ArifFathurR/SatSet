<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Dashboard redirect/view for a workspace slug (loads the first project).
     */
    public function dashboard(Request $request, $workspace_slug)
    {
        // Workspace Tenant Middleware has already attached the workspace, projects, and members to the request attributes
        $workspace = $request->attributes->get('workspace');
        $projects = $request->attributes->get('projects');

        if ($projects->count() > 0) {
            $firstProject = $projects->first();
            return redirect()->route('projects.show', [
                'workspace_slug' => $workspace->slug,
                'project' => $firstProject->id
            ]);
        }

        // Return empty projects state
        return Inertia::render('Project/Empty', [
            'workspace' => $workspace,
            'projects' => $projects,
        ]);
    }

    /**
     * Render the Kanban board for a specific project.
     */
    public function show(Request $request, $workspace_slug, Project $project)
    {
        $workspace = $request->attributes->get('workspace');
        $projects = $request->attributes->get('projects');
        $workspaceMembers = $request->attributes->get('workspaceMembers');

        // Check if project belongs to workspace
        if ($project->workspace_id !== $workspace->id) {
            abort(404);
        }

        // Load tasks with assignee and comments relation
        $tasks = $project->tasks()->with(['assignee', 'comments.user'])->get();

        return Inertia::render('Project/Show', [
            'workspace' => $workspace,
            'projects' => $projects,
            'workspaceMembers' => $workspaceMembers,
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Store a new project.
     */
    public function store(StoreProjectRequest $request, $workspace_slug)
    {
        $workspace = $request->attributes->get('workspace');
        $validated = $request->validated();

        $project = Project::create([
            'workspace_id' => $workspace->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('projects.show', [
            'workspace_slug' => $workspace->slug,
            'project' => $project->id
        ])->with('success', 'Project created successfully.');
    }
}
