<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\EventType;
use Illuminate\Http\Request;

class EventTypeController extends Controller
{
    use EnforcesAnnouncementRoles;

    /** Every campus event category, in the order they were created. */
    public function index()
    {
        return response()->json(EventType::orderBy('type_id')->pluck('name')->values());
    }

    public function store(Request $request)
    {
        $this->ensureStaff($request);

        $request->merge(['name' => trim((string) $request->input('name'))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:60', 'unique:event_types,name'],
        ]);

        $type = EventType::create(['name' => $validated['name']]);

        return response()->json($type->name, 201);
    }
}
