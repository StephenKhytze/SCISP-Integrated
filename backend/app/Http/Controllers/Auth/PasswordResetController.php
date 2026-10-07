<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class PasswordResetController extends Controller
{
    /**
     * Send 6-digit recovery code and reset link to user's email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'identity' => 'required|string',
        ], [
            'identity.required' => 'Please enter your username or registered email address.',
        ]);

        $throttleKey = 'forgot-pw:' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => "Too many attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }
        RateLimiter::hit($throttleKey, 300);

        $identity = trim($request->input('identity'));

        // Locate user by email or username
        $user = User::where('email', $identity)
            ->orWhere('username', $identity)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account was found matching that username or email address.',
            ], 404);
        }

        if (empty($user->email)) {
            return response()->json([
                'message' => 'This account does not have a recovery email associated with it. Please contact the IT Helpdesk.',
            ], 422);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'This account is currently disabled. Please contact the administration.',
            ], 403);
        }

        // Generate 6-digit numeric OTP and 64-char reset token
        $code = (string) mt_rand(100000, 999999);
        $rawToken = Str::random(64);

        // Delete any existing tokens for this email and insert fresh token
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $rawToken,
            'code' => $code,
            'created_at' => now(),
        ]);

        // Build frontend reset URL
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $resetUrl = "{$frontendUrl}/auth?action=reset-password&token={$rawToken}&email=" . urlencode($user->email);

        // Dispatch Email
        try {
            Mail::to($user->email)->send(new PasswordResetMail($user, $code, $resetUrl, 15));
        } catch (\Throwable $e) {
            Log::error("Failed to send password reset email to {$user->email}: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to deliver the recovery email. Please check server mail configuration.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }

        $maskedEmail = $this->maskEmail($user->email);

        return response()->json([
            'status' => 'success',
            'message' => "A 6-digit recovery code has been sent to {$maskedEmail}.",
            'email' => $user->email,
            'masked_email' => $maskedEmail,
            'expires_in_minutes' => 15,
        ]);
    }

    /**
     * Validate 6-digit OTP code before proceeding to password input.
     */
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ], [
            'code.size' => 'The recovery code must be exactly 6 digits.',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid recovery code. Please check your email and try again.',
            ], 422);
        }

        $createdAt = Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(15)->isPast()) {
            return response()->json([
                'message' => 'This recovery code has expired. Please request a new one.',
            ], 422);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Recovery code verified successfully.',
            'token' => $record->token,
        ]);
    }

    /**
     * Reset the user's password using either OTP code or token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'nullable|string',
            'token' => 'nullable|string',
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ], [
            'password.confirmed' => 'New password and confirmation do not match.',
        ]);

        if (!$request->filled('code') && !$request->filled('token')) {
            return response()->json([
                'message' => 'A valid verification code or reset token is required.',
            ], 422);
        }

        // Query token record
        $query = DB::table('password_reset_tokens')->where('email', $request->email);
        if ($request->filled('code')) {
            $query->where('code', $request->code);
        } elseif ($request->filled('token')) {
            $query->where('token', $request->token);
        }

        $record = $query->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid or expired password reset request. Please request a new code.',
            ], 422);
        }

        $createdAt = Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(15)->isPast()) {
            return response()->json([
                'message' => 'This password reset session has expired. Please request a new code.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User account not found.',
            ], 404);
        }

        // Update password and clear must_change_password flag
        $user->password = Hash::make($request->password);
        $user->must_change_password = false;
        $user->save();

        // Clear used token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Password has been reset successfully! You may now sign in with your new credentials.',
            'username' => $user->username,
        ]);
    }

    /**
     * Mask email address for privacy (e.g. j***z@abc.edu.ph).
     */
    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $name = $parts[0];
        $domain = $parts[1];

        $len = strlen($name);
        if ($len <= 2) {
            $maskedName = substr($name, 0, 1) . '*';
        } else {
            $first = substr($name, 0, 1);
            $last = substr($name, -1);
            $maskedName = $first . str_repeat('*', max(3, $len - 2)) . $last;
        }

        return $maskedName . '@' . $domain;
    }
}
