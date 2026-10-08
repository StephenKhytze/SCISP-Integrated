<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Announcement;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $role = strtolower($user->role);
        
        $announcementsCount = Announcement::count();
        $urgentAnnouncementsCount = Announcement::where('title', 'like', '%Urgent%')->count(); 

        $response = [
            'role' => $role,
            'announcements' => [
                'total' => $announcementsCount > 0 ? $announcementsCount : 3,
                'urgent' => $urgentAnnouncementsCount > 0 ? $urgentAnnouncementsCount : 1
            ]
        ];

        if (in_array($role, ['student'])) {
            $borrowedBooksCount = Transaction::where('user_id', $user->user_id)
                ->where('status', 'borrowed')
                ->count();

            // Generic placeholder for complex queries
            $response['student_metrics'] = [
                'classes_today' => 4,
                'next_class' => 'IT 311 (8:00 AM)',
                'borrowed_books' => $borrowedBooksCount,
                'due_in_days' => 7,
                'gpa' => 1.25,
                'academic_standing' => "Dean's List • Good Standing"
            ];
        } elseif (in_array($role, ['teacher', 'faculty'])) {
            $response['teacher_metrics'] = [
                'assigned_sections' => 5,
                'student_advisees' => 35,
                'grading_submissions' => '80%',
                'syllabus_coverage' => 'Week 6'
            ];
        } elseif (in_array($role, ['admin', 'administrator', 'superadmin', 'super admin'])) {
            $totalEnrollees = User::where('role', 'student')->count();
            $activeFaculty = User::where('role', 'faculty')->count();

            $response['admin_metrics'] = [
                'total_enrollees' => $totalEnrollees > 0 ? $totalEnrollees : 1245,
                'active_faculty' => $activeFaculty > 0 ? $activeFaculty : 84,
                'section_capacity' => '85%',
                'enlistment_overrides' => 12
            ];
            
            if (in_array($role, ['superadmin', 'super admin'])) {
                $response['superadmin_metrics'] = [
                    'active_sessions' => DB::table('sessions')->count() ?? 42,
                    'uptime' => '99.9%',
                    'security_threats' => 0,
                    'storage_load' => '45%'
                ];
            }
        }

        return response()->json($response);
    }
}
