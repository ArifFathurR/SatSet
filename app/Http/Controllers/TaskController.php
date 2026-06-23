<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskPositionRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Store a new task in a project.
     */
    public function store(StoreTaskRequest $request, $workspace_slug, Project $project)
    {
        $validated = $request->validated();
        $status = $validated['status'] ?? 'backlog';

        // Calculate max position in that status
        $maxPosition = Task::where('project_id', $project->id)
            ->where('status', $status)
            ->max('position');

        $position = is_null($maxPosition) ? 0 : $maxPosition + 1;

        $task = Task::create([
            'project_id' => $project->id,
            'title' => $validated['title'],
            'status' => $status,
            'priority' => $validated['priority'] ?? 'medium',
            'assigned_to' => $validated['assigned_to'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'content' => $validated['content'] ?? null,
            'position' => $position,
        ]);

        return back()->with('success', 'Task created successfully.');
    }

    /**
     * Update an existing task's attributes or editor content.
     */
    public function update(StoreTaskRequest $request, $workspace_slug, Project $project, Task $task)
    {
        $validated = $request->validated();

        $task->update([
            'title' => $validated['title'],
            'status' => $validated['status'] ?? $task->status,
            'priority' => $validated['priority'] ?? $task->priority,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'content' => $validated['content'] ?? null,
        ]);

        return back()->with('success', 'Task updated successfully.');
    }

    /**
     * Delete a task.
     */
    public function destroy(Request $request, $workspace_slug, Project $project, Task $task)
    {
        DB::transaction(function () use ($task, $project) {
            // Shift down tasks that were after this one in the same status column
            Task::where('project_id', $project->id)
                ->where('status', $task->status)
                ->where('position', '>', $task->position)
                ->decrement('position');

            $task->delete();
        });

        return back()->with('success', 'Task deleted successfully.');
    }

    /**
     * Reorder tasks via Drag and Drop.
     */
    public function updatePosition(UpdateTaskPositionRequest $request, $workspace_slug, Project $project, Task $task)
    {
        $validated = $request->validated();
        $newStatus = $validated['status'];
        $newPosition = $validated['position'];

        $oldStatus = $task->status;
        $oldPosition = $task->position;

        DB::transaction(function () use ($task, $project, $oldStatus, $oldPosition, $newStatus, $newPosition) {
            if ($oldStatus === $newStatus) {
                if ($oldPosition === $newPosition) {
                    return;
                }

                // Dragging in the same column
                if ($newPosition > $oldPosition) {
                    Task::where('project_id', $project->id)
                        ->where('status', $newStatus)
                        ->whereBetween('position', [$oldPosition + 1, $newPosition])
                        ->decrement('position');
                } else {
                    Task::where('project_id', $project->id)
                        ->where('status', $newStatus)
                        ->whereBetween('position', [$newPosition, $oldPosition - 1])
                        ->increment('position');
                }
            } else {
                // Dragging to a different column
                // Shift down items in old column
                Task::where('project_id', $project->id)
                    ->where('status', $oldStatus)
                    ->where('position', '>', $oldPosition)
                    ->decrement('position');

                // Shift up items in new column
                Task::where('project_id', $project->id)
                    ->where('status', $newStatus)
                    ->where('position', '>=', $newPosition)
                    ->increment('position');
            }

            $task->update([
                'status' => $newStatus,
                'position' => $newPosition,
            ]);
        });

        return back()->with('success', 'Task position updated.');
    }
}
