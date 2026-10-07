<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();

            // Section 1: Personal Details
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable();

            // Section 2: Academic Information
            $table->string('program');
            $table->string('year_level');
            $table->string('previous_school')->nullable();
            $table->string('student_id_number')->nullable();

            // Section 3: Contact & Delivery
            $table->string('email');
            $table->string('contact_number')->nullable();
            $table->text('home_address')->nullable();

            // Workflow & Decision Tracking
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->unsignedBigInteger('created_user_id')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('reviewed_by')->references('user_id')->on('users')->nullOnDelete();
            $table->foreign('created_user_id')->references('user_id')->on('users')->nullOnDelete();
            
            $table->index(['email', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_registrations');
    }
};
