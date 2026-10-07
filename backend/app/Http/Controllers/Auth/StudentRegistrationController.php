<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\StudentRegistrationApprovedMail;
use App\Mail\StudentRegistrationDeniedMail;
use App\Models\StudentRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class StudentRegistrationController extends Controller
{
    /**
     * Public Student Registration Submission (All 3 Sections)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            // Section 1: Personal Details
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'birthdate' => 'nullable|date',
            'gender' => 'nullable|string|max:50',

            // Section 2: Academic Information
            'program' => 'required|string|max:150',
            'year_level' => 'required|string|max:50',
            'previous_school' => 'nullable|string|max:150',
            'student_id_number' => 'nullable|string|max:50',

            // Section 3: Contact & Delivery
            'email' => 'required|email|max:150',
            'contact_number' => 'nullable|string|max:50',
            'home_address' => 'nullable|string|max:255',
        ]);

        // Check if an account already exists with this email
        if (User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'message' => 'An active user account is already registered with this email address. Please sign in.'
            ], 422);
        }

        // Check for an existing pending registration
        $existingPending = StudentRegistration::where('email', $validated['email'])
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return response()->json([
                'message' => "You already have a pending registration under reference {$existingPending->reference_no}. Please wait for administrator verification.",
                'reference_no' => $existingPending->reference_no,
            ], 422);
        }

        // Generate unique reference number (e.g. REG-2026-X7K2P9)
        $refNo = 'REG-' . date('Y') . '-' . strtoupper(Str::random(6));

        $registration = StudentRegistration::create(array_merge($validated, [
            'reference_no' => $refNo,
            'status' => 'pending',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Your student registration has been submitted successfully! An administrator will review your application, and notification will be sent to your email.',
            'data' => [
                'reference_no' => $registration->reference_no,
                'name' => $registration->full_name,
                'email' => $registration->email,
                'program' => $registration->program,
                'submitted_at' => $registration->created_at->toIso8601String(),
            ]
        ], 201);
    }

    /**
     * Public Status Check by Email or Reference Code
     */
    public function status(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:150',
        ]);

        $query = trim($request->input('query'));

        $registration = StudentRegistration::where('reference_no', $query)
            ->orWhere('email', $query)
            ->latest()
            ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'No registration record found matching the provided reference number or email address.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'reference_no' => $registration->reference_no,
                'name' => $registration->full_name,
                'program' => $registration->program,
                'year_level' => $registration->year_level,
                'email' => $registration->email,
                'status' => $registration->status,
                'admin_notes' => $registration->admin_notes,
                'submitted_at' => $registration->created_at->format('M d, Y h:i A'),
                'reviewed_at' => $registration->reviewed_at ? $registration->reviewed_at->format('M d, Y h:i A') : null,
            ]
        ]);
    }

    /**
     * Admin: List Registrations with Filters
     */
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $query = StudentRegistration::with(['reviewer:user_id,username,first_name,last_name'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', $search)
                  ->orWhere('last_name', 'like', $search)
                  ->orWhere('email', 'like', $search)
                  ->orWhere('reference_no', 'like', $search)
                  ->orWhere('program', 'like', $search);
            });
        }

        $registrations = $query->paginate($request->input('per_page', 25));

        return response()->json($registrations);
    }

    /**
     * Admin: Registration Statistics
     */
    public function stats(Request $request)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'pending' => StudentRegistration::where('status', 'pending')->count(),
            'approved' => StudentRegistration::where('status', 'approved')->count(),
            'rejected' => StudentRegistration::where('status', 'rejected')->count(),
            'total' => StudentRegistration::count(),
            'today' => StudentRegistration::whereDate('created_at', today())->count(),
        ]);
    }

    /**
     * Admin: Approve Registration & Dispatch Email
     */
    public function approve(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $registration = StudentRegistration::findOrFail($id);

        if ($registration->status === 'approved') {
            return response()->json([
                'message' => 'This registration has already been approved.'
            ], 422);
        }

        // Validate optional custom username/password or auto-generate
        $request->validate([
            'custom_username' => 'nullable|string|min:4|max:50|unique:users,username',
            'custom_password' => 'nullable|string|min:6',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        // Generate clean username e.g. DelaCruz_Juan_C8412
        $cleanLast = preg_replace('/[^A-Za-z0-9]/', '', $registration->last_name);
        $cleanFirst = preg_replace('/[^A-Za-z0-9]/', '', $registration->first_name);
        $randomCode = strtoupper(Str::random(4));
        $generatedUsername = $request->input('custom_username') 
            ?: "{$cleanLast}_{$cleanFirst}_C{$randomCode}";

        // Ensure unique username
        $baseUsername = $generatedUsername;
        $counter = 1;
        while (User::where('username', $generatedUsername)->exists()) {
            $generatedUsername = "{$baseUsername}{$counter}";
            $counter++;
        }

        // Generate temporary password that strictly meets complexity rules
        $temporaryPassword = $request->input('custom_password') 
            ?: 'Abc#' . rand(100, 999) . strtolower(Str::random(3));

        $adminNotes = $request->input('admin_notes', 'Registration verified and approved by administration.');

        DB::beginTransaction();
        try {
            // 1. Create the student User record
            $user = User::create([
                'username' => $generatedUsername,
                'first_name' => $registration->first_name,
                'last_name' => $registration->last_name,
                'email' => $registration->email,
                'password' => Hash::make($temporaryPassword),
                'role' => 'student',
                'department' => $registration->program,
                'id_number' => $registration->student_id_number ?: '2026-' . str_pad($registration->id, 5, '0', STR_PAD_LEFT),
                'status' => 'active',
                'must_change_password' => true,
            ]);

            // 2. Update registration status
            $registration->update([
                'status' => 'approved',
                'admin_notes' => $adminNotes,
                'reviewed_by' => $request->user()->user_id,
                'reviewed_at' => now(),
                'created_user_id' => $user->user_id,
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Approval error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create student account: ' . $e->getMessage()
            ], 500);
        }

        // 3. Dispatch Acceptance Email
        $loginUrl = 'http://localhost:5173/auth';
        try {
            Mail::to($registration->email)->send(
                new StudentRegistrationApprovedMail($registration, $generatedUsername, $temporaryPassword, $loginUrl)
            );
        } catch (\Throwable $e) {
            Log::warning("Failed to send approval email to {$registration->email}: " . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => "Registration approved! Student account created and notification email dispatched to {$registration->email}.",
            'data' => [
                'user_id' => $user->user_id,
                'username' => $generatedUsername,
                'temporary_password' => $temporaryPassword,
                'email' => $registration->email,
                'must_change_password' => true,
                'status' => 'approved',
            ]
        ]);
    }

    /**
     * Admin: Reject Registration & Dispatch Email
     */
    public function reject(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $registration = StudentRegistration::findOrFail($id);

        if ($registration->status === 'approved') {
            return response()->json([
                'message' => 'Cannot reject an already approved registration.'
            ], 422);
        }

        $request->validate([
            'reason' => 'required|string|min:3|max:500',
        ]);

        $reason = $request->input('reason');

        $registration->update([
            'status' => 'rejected',
            'admin_notes' => $reason,
            'reviewed_by' => $request->user()->user_id,
            'reviewed_at' => now(),
        ]);

        // Dispatch Denial Email
        try {
            Mail::to($registration->email)->send(
                new StudentRegistrationDeniedMail($registration, $reason)
            );
        } catch (\Throwable $e) {
            Log::warning("Failed to send rejection email to {$registration->email}: " . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => "Registration rejected. Notification email dispatched to {$registration->email}.",
            'data' => [
                'id' => $registration->id,
                'reference_no' => $registration->reference_no,
                'status' => 'rejected',
                'reason' => $reason,
            ]
        ]);
    }

    /**
     * Admin: Outbox / Sent Notification Log
     */
    public function outbox(Request $request)
    {
        $this->ensureAdmin($request);

        $recentNotifications = StudentRegistration::whereIn('status', ['approved', 'rejected'])
            ->with(['reviewer:user_id,username,first_name,last_name', 'createdUser:user_id,username'])
            ->orderBy('reviewed_at', 'desc')
            ->limit(30)
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'reference_no' => $reg->reference_no,
                    'student_name' => $reg->full_name,
                    'email' => $reg->email,
                    'status' => $reg->status,
                    'subject' => $reg->status === 'approved' 
                        ? 'Welcome to ABC School - Your Student Portal Account is Approved'
                        : 'ABC School Student Registration Update',
                    'reviewed_by' => $reg->reviewer?->full_name ?? $reg->reviewer?->username ?? 'Administrator',
                    'reviewed_at' => $reg->reviewed_at ? $reg->reviewed_at->format('M d, Y h:i A') : null,
                    'username' => $reg->createdUser?->username,
                    'notes' => $reg->admin_notes,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $recentNotifications,
        ]);
    }

    /**
     * Role Verification Helper
     */
    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['administrator', 'superadmin'])) {
            abort(403, 'Unauthorized. Administrator privileges are required.');
        }
    }
}
