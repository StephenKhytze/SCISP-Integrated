<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $primaryKey = 'registration_id';

    protected $fillable = [
        'event_id',
        'user_id',
        'ticket_code',
        'status',
        'registered_on',
    ];

    protected function casts(): array
    {
        return [
            'registered_on' => 'datetime',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
