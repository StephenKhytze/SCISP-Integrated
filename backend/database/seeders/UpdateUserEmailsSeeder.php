<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UpdateUserEmailsSeeder extends Seeder
{
    public function run(): void
    {
        $updates = [
            'DelaCruz_Juan_C1234' => [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@abc.edu.ph',
            ],
            'Santos_Maria_F4021' => [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'maria.santos@abc.edu.ph',
            ],
            'Admin_User_00001' => [
                'first_name' => 'Alejandro',
                'last_name' => 'Reyes',
                'email' => 'admin@abc.edu.ph',
            ],
            'SuperAdmin_User_00001' => [
                'first_name' => 'Marco',
                'last_name' => 'Torres',
                'email' => 'superadmin@abc.edu.ph',
            ],
        ];

        foreach ($updates as $username => $data) {
            $user = User::where('username', $username)->first();
            if ($user) {
                $user->update($data);
            }
        }
    }
}
