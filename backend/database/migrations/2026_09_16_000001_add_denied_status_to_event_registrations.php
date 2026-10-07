<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(
            "ALTER TABLE event_registrations MODIFY status ENUM('Pending Approval', 'Approved', 'Denied', 'Cancelled') NOT NULL DEFAULT 'Pending Approval'"
        );
    }

    public function down(): void
    {
        DB::statement(
            "ALTER TABLE event_registrations MODIFY status ENUM('Pending Approval', 'Approved', 'Cancelled') NOT NULL DEFAULT 'Pending Approval'"
        );
    }
};
