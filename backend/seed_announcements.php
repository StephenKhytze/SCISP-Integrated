<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// 1. Ensure categories exist
$categories = ['Academic', 'Event', 'Administrative', 'Emergency', 'General'];
foreach ($categories as $cat) {
    DB::table('announcement_categories')->updateOrInsert(
        ['name' => $cat],
        ['name' => $cat]
    );
}

// 2. Fetch admin user for posted_by
$admin = DB::table('users')->where('username', 'Nick')->first();
$adminId = $admin ? $admin->user_id ?? clone $admin->id : 1;

// 3. Clear existing announcements (optional, but good for clean demo)
DB::table('announcements')->truncate();

// 4. Seed new announcements
$announcements = [
    [
        'title' => 'Midterm Examinations Schedule',
        'category' => 'Academic',
        'source' => 'Office of the Registrar',
        'description' => 'Please be advised that the midterm examinations will be held from October 15 to October 20. Ensure you have settled all necessary balances before the examination week.',
        'pinned' => 1,
        'posted_by' => $adminId,
        'created_at' => Carbon::now()->subDays(2),
        'updated_at' => Carbon::now()->subDays(2),
    ],
    [
        'title' => 'College Intramurals 2024',
        'category' => 'Event',
        'source' => 'Student Council',
        'description' => 'Get ready for the annual College Intramurals! Sign up for your favorite sports starting next Monday. Let the best department win!',
        'pinned' => 0,
        'posted_by' => $adminId,
        'created_at' => Carbon::now()->subDays(5),
        'updated_at' => Carbon::now()->subDays(5),
    ],
    [
        'title' => 'System Maintenance downtime',
        'category' => 'Administrative',
        'source' => 'IT Department',
        'description' => 'The integrated portal will undergo scheduled maintenance this Sunday from 12:00 AM to 4:00 AM. Access will be temporarily unavailable.',
        'pinned' => 0,
        'posted_by' => $adminId,
        'created_at' => Carbon::now()->subHours(12),
        'updated_at' => Carbon::now()->subHours(12),
    ],
    [
        'title' => 'Typhoon Class Suspension',
        'category' => 'Emergency',
        'source' => 'Office of the President',
        'description' => 'Due to inclement weather conditions brought by the typhoon, all classes on all levels are suspended today. Stay safe everyone.',
        'pinned' => 1,
        'posted_by' => $adminId,
        'created_at' => Carbon::now()->subHours(2),
        'updated_at' => Carbon::now()->subHours(2),
    ]
];

DB::table('announcements')->insert($announcements);

echo "Announcements seeded successfully!\n";
