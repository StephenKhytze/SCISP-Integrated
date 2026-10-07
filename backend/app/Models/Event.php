<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Event extends Model
{
    protected $primaryKey = 'event_id';

    protected $fillable = [
        'type',
        'title',
        'description',
        'event_date',
        'event_time',
        'venue',
        'host',
        'seats_total',
        'requirements',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'archived_at' => 'datetime',
        ];
    }

    /** Not archived, and not yet over (an event stays listed through its own date). */
    public function scopeActive($query)
    {
        return $query->whereNull('archived_at')->whereDate('event_date', '>=', today());
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class, 'event_id', 'event_id');
    }

    public function announcement()
    {
        return $this->hasOne(Announcement::class, 'event_id', 'event_id');
    }

    public function getSeatsTakenAttribute(): int
    {
        return $this->registrations()->whereIn('status', ['Pending Approval', 'Approved'])->count();
    }

    /**
     * Create an event AND its announcement in one go, so an event post shows up
     * in both the Campus Events Desk and the Announcements Feed
     * (plain announcements, like "no classes", stay in the feed only).
     */
    public static function publish(array $data, ?int $postedBy = null): self
    {
        return DB::transaction(function () use ($data, $postedBy) {
            $event = static::create($data);

            Announcement::create([
                'title' => 'New Event: ' . $event->title,
                'category' => 'Events',
                'source' => $event->host,
                'description' => sprintf(
                    '%s Date: %s (%s) at %s. Open the Campus Events Desk to register.',
                    $event->description,
                    $event->event_date->format('F j, Y'),
                    $event->event_time,
                    $event->venue
                ) . ($event->requirements ? ' Requirements: ' . $event->requirements : ''),
                'pinned' => false,
                'posted_by' => $postedBy,
                'event_id' => $event->event_id,
            ]);

            return $event;
        });
    }

    public function toPayload(): array
    {
        return [
            'id' => $this->event_id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'date' => $this->event_date->format('Y-m-d'),
            'time' => $this->event_time,
            'venue' => $this->venue,
            'host' => $this->host,
            'seatsTaken' => $this->seats_taken,
            'seatsTotal' => $this->seats_total,
            'requirements' => $this->requirements,
        ];
    }
}
