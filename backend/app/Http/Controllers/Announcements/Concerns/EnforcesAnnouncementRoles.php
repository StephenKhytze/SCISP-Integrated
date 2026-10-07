<?php

namespace App\Http\Controllers\Announcements\Concerns;

use Illuminate\Http\Request;

trait EnforcesAnnouncementRoles
{
    private const STAFF_ROLES = ['administrator', 'faculty', 'superadmin'];

    private function isStaff(Request $request): bool
    {
        return in_array($request->user()->role, self::STAFF_ROLES, true);
    }

    private function ensureStaff(Request $request): void
    {
        if (!$this->isStaff($request)) {
            abort(403, 'Only administrators and faculty may perform this action.');
        }
    }

    private function ensureStudent(Request $request): void
    {
        if ($request->user()->role !== 'student') {
            abort(403, 'Only students may perform this action.');
        }
    }
}
