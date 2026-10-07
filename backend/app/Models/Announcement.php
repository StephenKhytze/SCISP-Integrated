<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $primaryKey = 'announcement_id';

    protected $fillable = [
        'title',
        'category',
        'source',
        'description',
        'pinned',
        'posted_by',
        'event_id',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'pinned' => 'boolean',
            'archived_at' => 'datetime',
        ];
    }

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by', 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    /** Not archived, and if it belongs to an event, that event is still active. */
    public function scopeActive($query)
    {
        return $query->whereNull('archived_at')->where(function ($q) {
            $q->whereNull('event_id')
                ->orWhereHas('event', fn ($e) => $e->active());
        });
    }
}
