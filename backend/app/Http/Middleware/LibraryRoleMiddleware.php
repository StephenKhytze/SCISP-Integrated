<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LibraryRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // In the integrated monolith, we use the real authenticated user from JWT
        $userModel = auth()->user();

        if (! $userModel) {
            return response()->json([
                'message' => 'Unauthorized. Please login.',
            ], 401);
        }

        if ($userModel->status !== 'active') {
            return response()->json([
                'message' => 'Forbidden. User account is disabled.',
            ], 403);
        }

        // Determine the role for library purposes
        $role = $userModel->role;
        $dbRole = $role;
        
        // Match the legacy mock role semantics
        if ($userModel->isSuperAdmin()) {
            $role = 'Super Admin';
        } elseif ($role === 'administrator') {
            $role = 'Admin';
        } elseif ($role === 'faculty') {
            $role = 'Faculty';
        } else {
            $role = 'Student';
        }

        // If specific roles are required (e.g. for Admin routes)
        if (!empty($roles)) {
            $allowedRoles = array_map('strtolower', $roles);
            if (!in_array(strtolower($role), $allowedRoles)) {
                return response()->json([
                    'message' => 'Forbidden. Insufficient role privileges.',
                ], 403);
            }
        }

        // Pass the role and user_id down to the controllers
        $request->attributes->set('role', $role);
        $request->attributes->set('user_id', $userModel->user_id);
        // Resolved once here so no controller has to re-derive it from the header.
        $request->attributes->set('is_super_admin', $userModel->isSuperAdmin());

        return $next($request);
    }
}
