<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users (Alison Hoper + Team)
        $alison = User::create([
            'name' => 'Alison Hoper',
            'email' => 'alison@example.com',
            'password' => Hash::make('password'),
            'uuid' => (string) Str::uuid(),
        ]);

        $karen = User::create([
            'name' => 'Karen Smith',
            'email' => 'karen@example.com',
            'password' => Hash::make('password'),
            'uuid' => (string) Str::uuid(),
        ]);

        $steve = User::create([
            'name' => 'Steve Mcconnell',
            'email' => 'steve@example.com',
            'password' => Hash::make('password'),
            'uuid' => (string) Str::uuid(),
        ]);

        $sarah = User::create([
            'name' => 'Sarah Green',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'uuid' => (string) Str::uuid(),
        ]);

        $brad = User::create([
            'name' => 'Brad Smith',
            'email' => 'brad@example.com',
            'password' => Hash::make('password'),
            'uuid' => (string) Str::uuid(),
        ]);

        // 2. Create Workspaces
        $reqTracker = Workspace::create([
            'name' => 'ReqTracker',
            'slug' => 'reqtracker',
            'owner_id' => $alison->id,
        ]);

        $webPlatform = Workspace::create([
            'name' => 'Web Platform',
            'slug' => 'web-platform',
            'owner_id' => $alison->id,
        ]);

        $mobileApp = Workspace::create([
            'name' => 'Mobile App',
            'slug' => 'mobile-app',
            'owner_id' => $alison->id,
        ]);

        $backendApi = Workspace::create([
            'name' => 'Backend API',
            'slug' => 'backend-api',
            'owner_id' => $alison->id,
        ]);

        // Attach members to ReqTracker Workspace
        $reqTracker->members()->attach([
            $alison->id => ['role' => 'owner'],
            $karen->id => ['role' => 'admin'],
            $steve->id => ['role' => 'member'],
            $sarah->id => ['role' => 'member'],
            $brad->id => ['role' => 'viewer'],
        ]);

        // Attach members to other workspaces
        $webPlatform->members()->attach([
            $alison->id => ['role' => 'owner'],
            $karen->id => ['role' => 'member'],
        ]);
        $mobileApp->members()->attach([
            $alison->id => ['role' => 'owner'],
            $steve->id => ['role' => 'member'],
        ]);
        $backendApi->members()->attach([
            $alison->id => ['role' => 'owner'],
            $sarah->id => ['role' => 'member'],
        ]);

        // 3. Create Projects under ReqTracker
        $projectWeb = Project::create([
            'workspace_id' => $reqTracker->id,
            'name' => 'ReqTracker Dashboard',
            'description' => 'Core request tracking board and dashboard system.',
        ]);

        $projectClient = Project::create([
            'workspace_id' => $reqTracker->id,
            'name' => 'Client Portal',
            'description' => 'Portal for clients to view and request feature status updates.',
        ]);

        // 4. Create tasks for projectWeb
        $tasksData = [
            [
                'title' => 'Dark Mode Toggle',
                'status' => 'backlog',
                'priority' => 'medium',
                'assigned_to' => $karen->id,
                'position' => 0,
                'due_date' => now()->addDays(3),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Dark Mode Toggle Design & Spec']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Create low-fidelity designs that outline the basic structure and layout of the product or service. Focus on readability and standard color shifts between dark and light themes.']
                            ]
                        ],
                        [
                            'type' => 'bulletList',
                            'content' => [
                                [
                                    'type' => 'listItem',
                                    'content' => [[
                                        'type' => 'paragraph',
                                        'content' => [['type' => 'text', 'text' => 'Implement Tailwind dark: variants across all custom components.']]
                                    ]]
                                ],
                                [
                                    'type' => 'listItem',
                                    'content' => [[
                                        'type' => 'paragraph',
                                        'content' => [['type' => 'text', 'text' => 'Store active theme in localStorage and synchronize on reload.']]
                                    ]]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Export to Excel',
                'status' => 'backlog',
                'priority' => 'low',
                'assigned_to' => $steve->id,
                'position' => 1,
                'due_date' => now()->addDays(5),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Excel Report Generation']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Create a concept based on the research and insights gathered during the discovery phase of the project. Need support for multi-column grouping and format exports.']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Customer Journey Mapping',
                'status' => 'progress',
                'priority' => 'high',
                'assigned_to' => $sarah->id,
                'position' => 0,
                'due_date' => now()->addDays(1),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Customer Journey Maps']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Identify the key touchpoints and pain points in the customer journey, and to develop strategies to improve the overall customer experience.']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Persona development',
                'status' => 'progress',
                'priority' => 'medium',
                'assigned_to' => $brad->id,
                'position' => 1,
                'due_date' => now()->addDays(2),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'User Personas']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Create user personas based on the research data to represent different user groups and their characteristics, goals, and behaviors.']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Competitor research',
                'status' => 'review',
                'priority' => 'low',
                'assigned_to' => $steve->id,
                'position' => 0,
                'due_date' => now()->addDays(4),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Competitor Analysis']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Research competitors and identify weakness and strengths of each of them. Comparing their product features, pricing, and UX layouts.']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Fix Login Loop',
                'status' => 'done',
                'priority' => 'high',
                'assigned_to' => $karen->id,
                'position' => 0,
                'due_date' => now()->subDays(2),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Login Loop Debugging Report']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Create a brand identity system that includes logos, typography, color palette, and brand guidelines to fix the redirect loop on Session timeout.']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Header alignment issue',
                'status' => 'done',
                'priority' => 'medium',
                'assigned_to' => $steve->id,
                'position' => 1,
                'due_date' => now()->subDays(1),
                'content' => [
                    'type' => 'doc',
                    'content' => [
                        [
                            'type' => 'heading',
                            'attrs' => ['level' => 1],
                            'content' => [['type' => 'text', 'text' => 'Header UI Alignment']]
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => 'Create a branded materials such as business cards, flyers, brochures, and social media graphics to ensure pixel-perfect alignment.']
                            ]
                        ]
                    ]
                ]
            ],
        ];

        foreach ($tasksData as $taskData) {
            Task::create([
                'project_id' => $projectWeb->id,
                'title' => $taskData['title'],
                'status' => $taskData['status'],
                'priority' => $taskData['priority'],
                'assigned_to' => $taskData['assigned_to'],
                'position' => $taskData['position'],
                'due_date' => $taskData['due_date'],
                'content' => $taskData['content'],
            ]);
        }
    }
}
