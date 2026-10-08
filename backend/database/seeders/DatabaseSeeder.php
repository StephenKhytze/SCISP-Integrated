<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Student Account
        $studentUser = User::updateOrCreate(
            ['username' => 'Tennywoop1214'],
            [
                'first_name' => 'Kirsten Eve',
                'last_name' => 'Estiva',
                'email' => 'kirsten.estiva@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Student1234!'),
                'role' => 'student',
                'department' => 'BS Information Technology',
                'id_number' => '2024-01214',
                'status' => 'active',
            ]
        );

        $student = \App\Models\Student::updateOrCreate(
            ['student_number' => '2024-01214'],
            [
                'user_id' => $studentUser->id,
                'first_name' => 'Kirsten Eve',
                'last_name' => 'Estiva',
                'email_address' => 'kirsten.estiva@abc.edu.ph',
                'gender' => 'Female',
                'civil_status' => 'Single',
                'date_of_birth' => '2000-12-14',
                'enrollment_status' => 'Enrolled',
                'contact_number' => '+63 912 345 6789',
                'address' => '123 Test Street, Manila',
            ]
        );

        \App\Models\AcademicRecord::updateOrCreate(
            ['student_id' => $student->student_id],
            [
                'department' => 'College of Computer Studies',
                'course' => 'BSIT',
                'year_level' => 3,
                'section' => 'Section 3A',
                'school_year' => '2023-2024',
                'semester' => '1st Semester',
            ]
        );

        // 2. Faculty Account
        User::updateOrCreate(
            ['username' => 'KitzGar'],
            [
                'first_name' => 'Stephen',
                'last_name' => 'Khytze',
                'email' => 'stephen.khytze@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Faculty1234!'),
                'role' => 'faculty',
                'department' => 'Faculty of Computer Studies',
                'id_number' => 'FAC-2024-0101',
                'status' => 'active',
            ]
        );

        // 3. Administrator Account
        User::updateOrCreate(
            ['username' => 'Nick'],
            [
                'first_name' => 'Josef',
                'last_name' => 'Nicholas',
                'email' => 'josef.nicholas@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin1234!'),
                'role' => 'administrator',
                'department' => 'Office of the Dean',
                'id_number' => 'ADM-2024-001',
                'status' => 'active',
            ]
        );

        // 4. Superadmin Account
        User::updateOrCreate(
            ['username' => 'superadmin'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'superadmin@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('SuperAdmin1234!'),
                'role' => 'superadmin',
                'department' => 'IT Infrastructure & Security',
                'id_number' => 'SA-2024-001',
                'status' => 'active',
            ]
        );

        // Additional Seeders
        $this->call([
            LibrarySeeder::class,
            SubjectSeeder::class,
            FacultySeeder::class,
            IntegrationDemoSeeder::class,
            ScheduleSeeder::class,
        ]);
    }
}
