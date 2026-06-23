<?php

use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\TaskCommentController;

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect dashboard to workspaces list
    Route::get('/dashboard', function () {
        return redirect()->route('workspaces.index');
    })->name('dashboard');

    // Workspace management
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('/workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');

    // Tenant-isolated routes
    Route::middleware('workspace.tenant')->prefix('w/{workspace_slug}')->group(function () {
        // Workspace main dashboard & utilities
        Route::get('/', [ProjectController::class, 'dashboard'])->name('workspace.dashboard');
        Route::post('/invite', [WorkspaceController::class, 'inviteMember'])->name('workspace.invite');
        
        // Members roster
        Route::get('/members', [WorkspaceController::class, 'membersIndex'])->name('workspace.members');
        Route::patch('/members/{member_id}', [WorkspaceController::class, 'updateMemberRole'])->name('workspace.members.update');
        Route::delete('/members/{member_id}', [WorkspaceController::class, 'removeMember'])->name('workspace.members.remove');

        // Calendar page
        Route::get('/calendar', [WorkspaceController::class, 'calendarIndex'])->name('workspace.calendar');

        // Messages page
        Route::get('/messages', [WorkspaceController::class, 'messagesIndex'])->name('workspace.messages');

        // Workspace Settings (owner only)
        Route::get('/settings', [WorkspaceController::class, 'settingsIndex'])->name('workspace.settings');
        Route::patch('/settings', [WorkspaceController::class, 'update'])->name('workspace.update');
        Route::delete('/settings', [WorkspaceController::class, 'destroy'])->name('workspace.destroy');

        // Project routes
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

        // Task routes
        Route::post('/projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.store');
        Route::patch('/projects/{project}/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::delete('/projects/{project}/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
        Route::patch('/projects/{project}/tasks/{task}/reorder', [TaskController::class, 'updatePosition'])->name('tasks.reorder');

        // Task Comments
        Route::post('/projects/{project}/tasks/{task}/comments', [TaskCommentController::class, 'store'])->name('comments.store');
        Route::delete('/projects/{project}/tasks/{task}/comments/{comment}', [TaskCommentController::class, 'destroy'])->name('comments.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

