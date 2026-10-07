<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    use EnforcesAnnouncementRoles;

    /** Validation rules shared by "staff creates an event" and "student requests an event". */
    public static function eventRules(): array
    {
        return [
            'type' => ['required', 'string', 'max:60', Rule::exists('event_types', 'name')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'event_time' => ['required', 'string', 'max:100'],
            'venue' => ['required', 'string', 'max:255'],
            'host' => ['required', 'string', 'max:255'],
            'seats_total' => ['required', 'integer', 'min:1', 'max:5000'],
            'requirements' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function index(Request $request)
    {
        $query = Event::query()->active()->orderBy('event_date');

        if ($request->filled('type') && $request->query('type') !== 'All') {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->query('search') . '%');
        }

        return response()->json($query->get()->map(fn (Event $event) => $event->toPayload()));
    }

    public function store(Request $request)
    {
        $this->ensureStaff($request);

        $validated = $request->validate(self::eventRules());

        $event = Event::publish($validated, $request->user()->user_id);

        return response()->json($event->toPayload(), 201);
    }

    public function archive(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $event = Event::findOrFail($id);

        DB::transaction(function () use ($event) {
            $now = now();
            $event->update(['archived_at' => $now]);
            Announcement::where('event_id', $event->event_id)->update(['archived_at' => $now]);
        });

        return response()->json(['message' => 'Event archived successfully.']);
    }
}
