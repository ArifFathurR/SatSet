<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'workspace_id',
        'name',
        'description',
        'custom_columns',
        'is_private',
        'owner_id',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'custom_columns' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($project) {
            if (empty($project->id)) {
                $project->id = (string) Str::uuid();
            }
        });
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class)->orderBy('position');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
