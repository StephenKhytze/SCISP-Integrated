<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        Announcement::insert([
            [
                'title' => 'Midterm Examination Schedule for AY 2024-2025 First Semester',
                'category' => 'Academic',
                'source' => 'Office of the Registrar',
                'description' => 'Please be guided that the Midterm Examination period will run from August 18 to August 22, 2026. Make sure your examination permits are validated prior to exam dates.',
                'pinned' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Deadline for Student Organization Membership Renewal',
                'category' => 'Student Affairs',
                'source' => 'Office of Student Affairs',
                'description' => 'All students intending to renew or apply for organization membership must submit their forms on or before August 20, 2026 at the OSA office.',
                'pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Scheduled Portal Maintenance This Weekend',
                'category' => 'General Information',
                'source' => 'IT Services Office',
                'description' => 'The Student Portal will undergo scheduled maintenance on August 8, 2026 from 11:00 PM to 2:00 AM. Some services may be temporarily unavailable during this window.',
                'pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
