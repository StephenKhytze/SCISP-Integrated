<?php

namespace Database\Seeders;

use App\Models\EventRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventRequestSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('username', 'DelaCruz_Juan_C1234')->first();

        if (!$student) {
            return;
        }

        // A student-proposed event waiting for a teacher/admin decision.
        EventRequest::create([
            'user_id' => $student->user_id,
            'type' => 'Symposium',
            'title' => 'Techno Week 2026',
            'description' => 'A week of tech talks, mini-contests, and booths organized by the CCS Student Council.',
            'event_date' => '2026-11-12',
            'event_time' => '09:00 AM - 05:00 PM',
            'venue' => 'CCS Quadrangle',
            'host' => 'CCS Student Council',
            'seats_total' => 200,
            'status' => 'Pending Approval',
        ]);
    }
}
