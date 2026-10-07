<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentRegistration;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    /**
     * Handle Google Sign-In authentication.
     * Supports both real Google ID tokens (verified via Google's tokeninfo API)
     * and local development sandbox payload.
     */
    public function handleGoogleAuth(Request $request)
    {
        $validated = $request->validate([
            'credential' => 'nullable|string',
            'access_token' => 'nullable|string',
            'email' => 'nullable|email',
            'name' => 'nullable|string',
            'google_id' => 'nullable|string',
            'avatar' => 'nullable|string',
        ]);

        $email = $validated['email'] ?? null;
        $googleId = $validated['google_id'] ?? null;
        $name = $validated['name'] ?? null;
        $avatar = $validated['avatar'] ?? null;

        // 1. If an access_token is provided (via OAuth2 select_account popup), verify via userinfo
        if (!empty($validated['access_token'])) {
            try {
                $response = Http::timeout(5)->withToken($validated['access_token'])
                    ->get('https://www.googleapis.com/oauth2/v3/userinfo');

                if ($response->successful()) {
                    $googleData = $response->json();
                    $email = $googleData['email'] ?? $email;
                    $googleId = $googleData['sub'] ?? $googleId;
                    $name = $googleData['name'] ?? $name;
                    $avatar = $googleData['picture'] ?? $avatar;

                    if (isset($googleData['email_verified']) && $googleData['email_verified'] !== 'true' && $googleData['email_verified'] !== true) {
                        return response()->json([
                            'message' => 'Your Google email address is unverified. Please verify your Google account first.'
                        ], 401);
                    }
                } else {
                    Log::warning('Google access token verification failed: ' . $response->body());
                    return response()->json([
                        'message' => 'Invalid or expired Google authorization token.'
                    ], 401);
                }
            } catch (\Exception $e) {
                Log::error('Error contacting Google OAuth service: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Unable to verify Google credentials at this moment. Please try again or use standard login.'
                ], 502);
            }
        }
        // 2. If a real Google JWT credential is provided, verify it directly with Google tokeninfo
        elseif (!empty($validated['credential']) && substr_count($validated['credential'], '.') === 2) {
            try {
                $response = Http::timeout(5)->get('https://oauth2.googleapis.com/tokeninfo', [
                    'id_token' => $validated['credential'],
                ]);

                if ($response->successful()) {
                    $googleData = $response->json();
                    $email = $googleData['email'] ?? $email;
                    $googleId = $googleData['sub'] ?? $googleId;
                    $name = $googleData['name'] ?? $name;
                    $avatar = $googleData['picture'] ?? $avatar;

                    if (isset($googleData['email_verified']) && $googleData['email_verified'] !== 'true' && $googleData['email_verified'] !== true) {
                        return response()->json([
                            'message' => 'Your Google email address is unverified. Please verify your Google account first.'
                        ], 401);
                    }
                } else {
                    Log::warning('Google token verification failed: ' . $response->body());
                    return response()->json([
                        'message' => 'Invalid or expired Google authorization token.'
                    ], 401);
                }
            } catch (\Exception $e) {
                Log::error('Error contacting Google OAuth service: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Unable to verify Google credentials at this moment. Please try again or use standard login.'
                ], 502);
            }
        }

        if (empty($email)) {
            return response()->json([
                'message' => 'Email address is required for Google Sign-In.'
            ], 422);
        }

        // 1. Check if user already exists by google_id
        $user = null;
        if (!empty($googleId)) {
            $user = User::where('google_id', $googleId)->first();
        }

        // 2. If not found by google_id, check by email
        if (!$user) {
            $user = User::where('email', $email)->first();
            if ($user) {
                // Link Google ID and avatar to the existing account
                if (!empty($googleId)) {
                    $user->google_id = $googleId;
                }
                if (!empty($avatar) && empty($user->avatar)) {
                    $user->avatar = $avatar;
                }
                $user->save();
            }
        }

        // 3. If still not found as an active User, check student registration history
        if (!$user) {
            $existingReg = StudentRegistration::where('email', $email)->latest()->first();

            if ($existingReg) {
                if ($existingReg->status === 'approved') {
                    // Find user created by approval workflow
                    $user = User::where('email', $email)->first();
                } elseif ($existingReg->status === 'pending') {
                    return response()->json([
                        'message' => "Your registration application ({$existingReg->reference_no}) is currently pending review by the Admissions Office. Once approved, you can sign in directly with Google.",
                        'error_code' => 'REGISTRATION_PENDING',
                        'reference_number' => $existingReg->reference_no,
                        'email' => $email
                    ], 403);
                } elseif ($existingReg->status === 'rejected') {
                    $reason = $existingReg->admin_notes ?: 'Incomplete scholastic prerequisites.';
                    return response()->json([
                        'message' => "Your registration ({$existingReg->reference_no}) was not approved. Reason: {$reason}. Please contact the Registrar.",
                        'error_code' => 'REGISTRATION_REJECTED',
                        'reference_number' => $existingReg->reference_no,
                        'email' => $email
                    ], 403);
                }
            }
        }

        // 4. If account doesn't exist at all, reject with clear guidance
        if (!$user) {
            return response()->json([
                'message' => "No registered ABC School account found for {$email}. Please submit a Student Registration first, or contact the school registrar.",
                'error_code' => 'ACCOUNT_NOT_FOUND',
                'email' => $email
            ], 403);
        }

        // 5. Enforce account status
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your ABC School portal account is currently disabled. Please contact the administrator.'
            ], 403);
        }

        // Determine user profile attributes
        $displayName = $user->full_name;
        if (!$displayName) {
            if ($user->username === 'DelaCruz_Juan_C1234') {
                $displayName = 'Juan Dela Cruz';
            } elseif ($user->username === 'Santos_Maria_F4021') {
                $displayName = 'Prof. Maria Santos';
            } elseif ($user->username === 'Admin_User_00001') {
                $displayName = 'Dr. Alejandro Reyes';
            } elseif ($user->username === 'SuperAdmin_User_00001') {
                $displayName = 'Engr. Marco Torres';
            } else {
                $displayName = $name ?: str_replace('_', ' ', $user->username);
            }
        }

        $role = ucfirst($user->role ?: 'Student');
        $department = $user->department ?: 'College of Computer Studies';
        $idNumber = $user->id_number ?: (string)(10000 + $user->user_id);
        $mustChangePassword = (bool)$user->must_change_password;

        // Generate RS256 Institutional JWT
        try {
            $jwt = JwtService::generateToken($user, [
                'name' => $displayName,
                'role' => $role,
                'department' => $department,
                'idNumber' => $idNumber,
                'avatar' => $user->avatar,
                'must_change_password' => $mustChangePassword,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate session token: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Google authentication successful.',
            'access_token' => $jwt,
            'user' => [
                'name' => $displayName,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $role,
                'department' => $department,
                'idNumber' => $idNumber,
                'avatar' => $user->avatar,
                'must_change_password' => $mustChangePassword,
            ]
        ]);
    }
}
