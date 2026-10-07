<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Student Account
        User::updateOrCreate(
            ['username' => 'Tennywoop1214'],
            [
                'first_name' => 'Kirsten Eve',
                'last_name' => 'Estiva',
                'email' => 'kirsten.estiva@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Student1234!'),
                'role' => 'student',
                'department' => 'BS Information Technology',
                'id_number' => '2024-01214',
                'status' => 'active',
            ]
        );

        // 2. Faculty Account
        User::updateOrCreate(
            ['username' => 'KitzGar'],
            [
                'first_name' => 'Stephen',
                'last_name' => 'Khytze',
                'email' => 'stephen.khytze@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Faculty1234!'),
                'role' => 'faculty',
                'department' => 'Faculty of Computer Studies',
                'id_number' => 'FAC-2024-0101',
                'status' => 'active',
            ]
        );

        // 3. Administrator Account
        User::updateOrCreate(
            ['username' => 'Nick'],
            [
                'first_name' => 'Josef',
                'last_name' => 'Nicholas',
                'email' => 'josef.nicholas@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin1234!'),
                'role' => 'administrator',
                'department' => 'Office of the Dean',
                'id_number' => 'ADM-2024-001',
                'status' => 'active',
            ]
        );

        // 4. Superadmin Account
        User::updateOrCreate(
            ['username' => 'superadmin'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'superadmin@abc.edu.ph',
                'password' => \Illuminate\Support\Facades\Hash::make('SuperAdmin1234!'),
                'role' => 'superadmin',
                'department' => 'IT Infrastructure & Security',
                'id_number' => 'SA-2024-001',
                'status' => 'active',
            ]
        );
    }
}
