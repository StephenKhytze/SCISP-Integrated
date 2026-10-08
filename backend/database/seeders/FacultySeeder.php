<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Faculty;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        // Faculty 1: Stephen Khytze (already created in DatabaseSeeder but we need the Faculty record)
        $user1 = User::where('username', 'KitzGar')->first();
        if ($user1) {
            Faculty::updateOrCreate(
                ['user_id' => $user1->user_id],
                [
                    'first_name' => $user1->first_name,
                    'last_name' => $user1->last_name,
                    'email_address' => $user1->email,
                    'department' => clone_or_default($user1->department, 'Faculty of Computer Studies'),
                    'position' => 'Instructor',
                    'college' => 'College of Computer Studies',
                    'building' => 'Tech Building',
                    'room' => 'Room 402',
                    'office_hours' => 'Mon-Fri 8am-5pm',
                    'specializations' => '[]',
                ]
            );
        }

        // Faculty 2
        $user2 = User::updateOrCreate(
            ['username' => 'msantos'],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'm.santos@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Faculty1234!'),
                'role' => 'faculty',
                'department' => 'College of Computer Studies',
                'id_number' => 'FAC-2024-0102',
                'status' => 'active',
            ]
        );

        Faculty::updateOrCreate(
            ['user_id' => $user2->user_id],
            [
                'first_name' => $user2->first_name,
                'last_name' => $user2->last_name,
                'email_address' => $user2->email,
                'department' => clone_or_default($user2->department, 'College of Computer Studies'),
                'position' => 'Associate Professor',
                'college' => 'College of Computer Studies',
                'building' => 'Main Building',
                'room' => 'Room 101',
                'office_hours' => 'Mon-Fri 8am-5pm',
                'specializations' => '[]',
            ]
        );
    }
}

function clone_or_default($val, $def) {
    return $val ?: $def;
}
