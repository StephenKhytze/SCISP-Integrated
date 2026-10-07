<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementCategory extends Model
{
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'name',
    ];
}
