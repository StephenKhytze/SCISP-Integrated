<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Faculty;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $studentUser = User::where('username', 'Tennywoop1214')->first();
        $facultyUser = User::where('username', 'KitzGar')->first();
        
        if (!$studentUser || !$facultyUser) return;
        
        $faculty = Faculty::where('user_id', $facultyUser->user_id)->first();
        if (!$faculty) return;

        $subject1 = DB::table('subjects')->where('subject_code', 'IT-301')->first() ?? DB::table('subjects')->first();
        $subject2 = DB::table('subjects')->where('subject_code', 'IT-302')->first() ?? DB::table('subjects')->skip(1)->first();

        if (!$subject1 || !$subject2) return;

        $sectionName = 'Section 3A';
        $today = date('l');

        // 1. Create Course Section
        $sectionId = DB::table('course_sections')->insertGetId([
            'teacher_id' => $facultyUser->user_id,
            'name' => $sectionName,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Enroll Student in Section
        DB::table('course_section_students')->insert([
            'section_id' => $sectionId,
            'student_id' => $studentUser->user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Create Schedules for Today so they appear in Dashboard
        DB::table('schedules')->insert([
            [
                'subject_id' => $subject1->subject_id,
                'faculty_id' => $faculty->faculty_id,
                'room' => 'Lab 402',
                'level' => 'College',
                'year' => '3rd Year',
                'section' => $sectionName,
                'day' => $today,
                'start_time' => '08:00:00',
                'end_time' => '10:30:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subject_id' => $subject2->subject_id,
                'faculty_id' => $faculty->faculty_id,
                'room' => 'Room 305',
                'level' => 'College',
                'year' => '3rd Year',
                'section' => $sectionName,
                'day' => $today,
                'start_time' => '13:00:00',
                'end_time' => '14:30:00',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
