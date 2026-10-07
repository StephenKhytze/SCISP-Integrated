<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // An announcement created because an event was posted points back to that event,
        // so deleting the event also removes its announcement.
        Schema::table('announcements', function (Blueprint $table) {
            $table->foreignId('event_id')->nullable()->after('posted_by')
                ->constrained('events', 'event_id')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('event_id');
        });
    }
};
