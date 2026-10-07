<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRequest extends Model
{
    protected $primaryKey = 'request_id';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'description',
        'event_date',
        'event_time',
        'venue',
        'host',
        'seats_total',
        'requirements',
        'status',
        'event_id',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /** The fields that describe the event itself (used when a request is approved). */
    public function eventData(): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'event_date' => $this->event_date,
            'event_time' => $this->event_time,
            'venue' => $this->venue,
            'host' => $this->host,
            'seats_total' => $this->seats_total,
            'requirements' => $this->requirements,
        ];
    }

    public function toPayload(bool $withStudent = false): array
    {
        $data = [
            'id' => $this->request_id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'date' => $this->event_date->format('Y-m-d'),
            'time' => $this->event_time,
            'venue' => $this->venue,
            'host' => $this->host,
            'seatsTotal' => $this->seats_total,
            'requirements' => $this->requirements,
            'status' => $this->status,
            'eventId' => $this->event_id,
            'requestedOn' => $this->created_at->format('Y-m-d H:i'),
        ];

        if ($withStudent) {
            $data['studentUsername'] = $this->user?->username;
        }

        return $data;
    }
}
