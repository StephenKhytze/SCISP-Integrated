<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$u = App\Models\User::find(7);
if ($u) {
    $s = App\Models\Student::updateOrCreate(
        ['student_number' => $u->id_number],
        [
            'user_id' => $u->user_id,
            'first_name' => $u->first_name,
            'last_name' => $u->last_name,
            'enrollment_status' => 'Enrolled',
        ]
    );
    App\Models\AcademicRecord::updateOrCreate(
        ['student_id' => $s->student_id],
        [
            'course' => 'Unknown',
            'year_level' => 1,
            'section' => 'Unassigned',
            'school_year' => '2023-2024',
            'semester' => '1st Semester',
        ]
    );
    echo 'Fixed!';
} else {
    echo 'User not found';
}
