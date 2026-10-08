<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

$student = User::where('username', 'Tennywoop1214')->first();
$faculty = User::where('username', 'KitzGar')->first();

if ($student && $faculty) {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    $subject = DB::table('subjects')->where('subject_code', 'IT 311')->first();
    $subjectId = $subject ? $subject->subject_id : DB::table('subjects')->insertGetId([
        'subject_code' => 'IT 311',
        'subject_name' => 'Advanced Database Systems',
        'category' => 'Major',
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);

    $room = DB::table('rooms')->where('room_code', 'LAB1')->first();
    $roomId = $room ? $room->room_id : DB::table('rooms')->insertGetId([
        'room_code' => 'LAB1',
        'room_name' => 'Lab 1',
        'building' => 'Main Building',
        'room_type' => 'Laboratory',
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);

    $section = DB::table('course_sections')->where('name', 'BSIT 3-A')->first();
    $sectionId = $section ? $section->section_id : DB::table('course_sections')->insertGetId([
        'teacher_id' => 2,
        'name' => 'BSIT 3-A',
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);

    $enrolled = DB::table('course_section_students')
        ->where('section_id', $sectionId)
        ->where('student_id', $student->user_id)
        ->exists();
    if (!$enrolled) {
        DB::table('course_section_students')->insert([
            'section_id' => $sectionId,
            'student_id' => $student->user_id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }

    DB::table('schedules')->insert([
        'subject_id' => $subjectId,
        'faculty_id' => 1,
        'room_id' => $roomId,
        'section' => 'BSIT 3-A',
        'day' => 'Monday',
        'start_time' => '08:00:00',
        'end_time' => '10:00:00',
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);
    
    DB::table('schedules')->insert([
        'subject_id' => $subjectId,
        'faculty_id' => 1,
        'room_id' => $roomId,
        'section' => 'BSIT 3-A',
        'day' => 'Wednesday',
        'start_time' => '10:00:00',
        'end_time' => '12:00:00',
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);

    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    
    echo "Kirsten's schedule seeded successfully!\n";
} else {
    echo "Student or Faculty not found!\n";
}
