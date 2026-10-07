<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const DEFAULT_TYPES = ['Hackathon', 'Symposium', 'Career Fair', 'Workshop', 'Seminar'];

    public function up(): void
    {
        // Admins can add new campus event categories, so types are no longer a fixed enum.
        Schema::create('event_types', function (Blueprint $table) {
            $table->id('type_id');
            $table->string('name', 60)->unique();
            $table->timestamps();
        });

        $now = now();
        DB::table('event_types')->insert(array_map(
            fn (string $name) => ['name' => $name, 'created_at' => $now, 'updated_at' => $now],
            self::DEFAULT_TYPES
        ));

        DB::statement('ALTER TABLE events MODIFY type VARCHAR(60) NOT NULL');
        DB::statement('ALTER TABLE event_requests MODIFY type VARCHAR(60) NOT NULL');

        // Extra needs for the event, e.g. "2 electric fans, 30 extra chairs".
        Schema::table('events', function (Blueprint $table) {
            $table->text('requirements')->nullable()->after('seats_total');
        });
        Schema::table('event_requests', function (Blueprint $table) {
            $table->text('requirements')->nullable()->after('seats_total');
        });
    }

    public function down(): void
    {
        Schema::table('events', fn (Blueprint $table) => $table->dropColumn('requirements'));
        Schema::table('event_requests', fn (Blueprint $table) => $table->dropColumn('requirements'));

        DB::statement("ALTER TABLE events MODIFY type ENUM('Hackathon','Symposium','Career Fair','Workshop','Seminar') NOT NULL");
        DB::statement("ALTER TABLE event_requests MODIFY type ENUM('Hackathon','Symposium','Career Fair','Workshop','Seminar') NOT NULL");

        Schema::dropIfExists('event_types');
    }
};
