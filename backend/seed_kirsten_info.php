<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

$studentUser = User::where('username', 'Tennywoop1214')->first();
if ($studentUser) {
    $student = Student::where('user_id', $studentUser->id)->first();
    
    if ($student) {
        // Seed Emergency Contact
        $contact = DB::table('emergency_contacts')->where('student_id', $student->student_id)->first();
        if (!$contact) {
            DB::table('emergency_contacts')->insert([
                'student_id' => $student->student_id,
                'contact_name' => 'Maria Estiva',
                'contact_number' => '+63 999 111 2222',
                'relationship' => 'Mother',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            echo "Emergency Contact seeded!\n";
        } else {
            echo "Emergency Contact already exists!\n";
        }

        // Seed some Grades
        $academic = DB::table('academic_records')->where('student_id', $student->student_id)->first();
        if ($academic) {
            $grade = DB::table('grades')->where('academic_record_id', $academic->id)->first();
            if (!$grade) {
                DB::table('grades')->insert([
                    'academic_record_id' => $academic->id,
                    'subject_code' => 'IT 311',
                    'prelims' => '1.50',
                    'midterms' => '1.25',
                    'finals' => '1.00',
                    'final_grade' => '1.25',
                    'status' => 'Passed',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
                echo "Grade seeded!\n";
            } else {
                echo "Grade already exists!\n";
            }
        }
    }
}
