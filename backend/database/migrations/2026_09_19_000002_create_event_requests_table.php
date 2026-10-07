<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->enum('type', ['Hackathon', 'Symposium', 'Career Fair', 'Workshop', 'Seminar']);
            $table->string('title');
            $table->text('description');
            $table->date('event_date');
            $table->string('event_time');
            $table->string('venue');
            $table->string('host');
            $table->unsignedInteger('seats_total');
            $table->enum('status', ['Pending Approval', 'Approved', 'Denied'])->default('Pending Approval');
            // Filled in once staff approve the request and the event is actually created.
            $table->foreignId('event_id')->nullable()->constrained('events', 'event_id')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_requests');
    }
};
