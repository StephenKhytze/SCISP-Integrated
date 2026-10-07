<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no',
        'first_name',
        'middle_name',
        'last_name',
        'birthdate',
        'gender',
        'program',
        'year_level',
        'previous_school',
        'student_id_number',
        'email',
        'contact_number',
        'home_address',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'created_user_id',
    ];

    protected $casts = [
        'birthdate' => 'date:Y-m-d',
        'reviewed_at' => 'datetime',
    ];

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'user_id');
    }

    public function createdUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id', 'user_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
