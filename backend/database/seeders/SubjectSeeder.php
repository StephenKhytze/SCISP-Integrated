<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::updateOrCreate(
            ['code' => 'BSIT'],
            [
                'name' => 'Bachelor of Science in Information Technology',
                'education_level' => 'college',
            ]
        );

        Subject::updateOrCreate(
            ['subject_code' => 'IT311'],
            [
                'course_id' => $course->course_id,
                'subject_name' => 'Web Development with React & Laravel',
                'description' => 'Web Development with React & Laravel',
                'category' => 'major',
                'year_label' => '3rd Year',
            ]
        );

        Subject::updateOrCreate(
            ['subject_code' => 'IT312'],
            [
                'course_id' => $course->course_id,
                'subject_name' => 'Information Assurance and Security',
                'description' => 'Information Assurance and Security',
                'category' => 'major',
                'year_label' => '3rd Year',
            ]
        );

        Subject::updateOrCreate(
            ['subject_code' => 'IT313'],
            [
                'course_id' => $course->course_id,
                'subject_name' => 'Systems Integration and Architecture',
                'description' => 'Systems Integration and Architecture',
                'category' => 'major',
                'year_label' => '3rd Year',
            ]
        );

        Subject::updateOrCreate(
            ['subject_code' => 'CS101'],
            [
                'course_id' => $course->course_id,
                'subject_name' => 'Introduction to Computing',
                'description' => 'Introduction to Computing',
                'category' => 'minor',
                'year_label' => '1st Year',
            ]
        );
    }
}
