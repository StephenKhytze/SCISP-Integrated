<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventRequestController extends Controller
{
    use EnforcesAnnouncementRoles;

    public function index(Request $request)
    {
        // Staff review everyone's requests; students only see their own.
        if ($this->isStaff($request)) {
            $requests = EventRequest::query()
                ->with('user')
                ->orderByRaw("FIELD(status, 'Pending Approval', 'Approved', 'Denied')")
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (EventRequest $r) => $r->toPayload(withStudent: true));
        } else {
            $requests = EventRequest::query()
                ->where('user_id', $request->user()->user_id)
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (EventRequest $r) => $r->toPayload());
        }

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $this->ensureStudent($request);

        $validated = $request->validate(EventController::eventRules());
        $validated['user_id'] = $request->user()->user_id;

        $eventRequest = EventRequest::create($validated);

        return response()->json($eventRequest->toPayload(), 201);
    }

    public function approve(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $eventRequest = EventRequest::with('user')->findOrFail($id);

        if ($eventRequest->status !== 'Pending Approval') {
            return response()->json(['message' => 'This request has already been reviewed.'], 422);
        }

        // Approving publishes the event (and its announcement) exactly like staff posting it directly.
        DB::transaction(function () use ($eventRequest, $request) {
            $event = Event::publish($eventRequest->eventData(), $request->user()->user_id);
            $eventRequest->update(['status' => 'Approved', 'event_id' => $event->event_id]);
        });

        return response()->json($eventRequest->fresh('user')->toPayload(withStudent: true));
    }

    public function deny(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $eventRequest = EventRequest::with('user')->findOrFail($id);

        if ($eventRequest->status !== 'Pending Approval') {
            return response()->json(['message' => 'This request has already been reviewed.'], 422);
        }

        $eventRequest->update(['status' => 'Denied']);

        return response()->json($eventRequest->fresh('user')->toPayload(withStudent: true));
    }
}
