<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventType extends Model
{
    protected $primaryKey = 'type_id';

    protected $fillable = [
        'name',
    ];
}
