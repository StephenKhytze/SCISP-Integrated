<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const DEFAULT_CATEGORIES = ['Academic', 'Student Affairs', 'Events', 'General Information'];

    public function up(): void
    {
        // Admins can add announcement categories, so they are no longer a fixed enum.
        Schema::create('announcement_categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('name', 60)->unique();
            $table->timestamps();
        });

        $now = now();
        DB::table('announcement_categories')->insert(array_map(
            fn (string $name) => ['name' => $name, 'created_at' => $now, 'updated_at' => $now],
            self::DEFAULT_CATEGORIES
        ));

        DB::statement('ALTER TABLE announcements MODIFY category VARCHAR(60) NOT NULL');
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE announcements MODIFY category ENUM('Academic','Student Affairs','Events','General Information') NOT NULL");
        Schema::dropIfExists('announcement_categories');
    }
};
