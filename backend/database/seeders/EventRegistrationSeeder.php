<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('username', 'DelaCruz_Juan_C1234')->first();

        if (!$student) {
            return;
        }

        $hackathon = Event::where('title', 'like', 'Annual College Hackathon%')->first();
        $symposium = Event::where('title', 'like', 'Cybersecurity & Ethical Hacking%')->first();
        $careerFair = Event::where('title', 'like', 'Graduate Career Fair%')->first();

        $rows = [];

        if ($careerFair) {
            $rows[] = [
                'event_id' => $careerFair->event_id,
                'user_id' => $student->user_id,
                'ticket_code' => 'TCK-CAR-6940',
                'status' => 'Cancelled',
                'registered_on' => '2026-08-04 10:51:00',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if ($hackathon) {
            $rows[] = [
                'event_id' => $hackathon->event_id,
                'user_id' => $student->user_id,
                'ticket_code' => 'TCK-HK2026-88',
                'status' => 'Approved',
                'registered_on' => '2026-08-01 10:30:00',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if ($symposium) {
            $rows[] = [
                'event_id' => $symposium->event_id,
                'user_id' => $student->user_id,
                'ticket_code' => 'TCK-SEC2026-12',
                'status' => 'Pending Approval',
                'registered_on' => '2026-08-02 14:15:00',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if ($rows) {
            EventRegistration::insert($rows);
        }
    }
}
