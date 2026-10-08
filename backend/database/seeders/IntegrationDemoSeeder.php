<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class IntegrationDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->error('Do not run demo seeder in production!');
            return;
        }

        $this->call([
            MockPersonaSeeder::class,
            StudentSeeder::class,
            TeachingLoadSeeder::class,
            AnnouncementSeeder::class,
            EventSeeder::class,
            EventRegistrationSeeder::class,
            EventRequestSeeder::class,
        ]);

        $sqlPath = base_path('../sample-data/library/library_books.sql');
        if (File::exists($sqlPath)) {
            $this->command->info('Importing library sample data...');
            DB::unprepared(File::get($sqlPath));
        }
    }
}
