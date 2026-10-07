<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventRegistrationController extends Controller
{
    use EnforcesAnnouncementRoles;

    private const ACTIVE_STATUSES = ['Pending Approval', 'Approved'];

    private function present(EventRegistration $registration, bool $withStudent = false): array
    {
        $data = [
            'id' => $registration->registration_id,
            'eventId' => $registration->event_id,
            'ticketCode' => $registration->ticket_code,
            'status' => $registration->status,
            'registeredOn' => $registration->registered_on->format('Y-m-d H:i'),
        ];

        if ($withStudent) {
            $data['studentUsername'] = $registration->user?->username;
        }

        return $data;
    }

    public function index(Request $request)
    {
        // Staff manage every student's registrations; students only ever see their own.
        if ($this->isStaff($request)) {
            $registrations = EventRegistration::query()
                ->with(['event', 'user'])
                ->orderByRaw("FIELD(status, 'Pending Approval', 'Approved', 'Denied', 'Cancelled')")
                ->orderByDesc('registered_on')
                ->get()
                ->map(fn (EventRegistration $r) => $this->present($r, withStudent: true));
        } else {
            $registrations = EventRegistration::query()
                ->where('user_id', $request->user()->user_id)
                ->with('event')
                ->orderByDesc('registered_on')
                ->get()
                ->map(fn (EventRegistration $r) => $this->present($r));
        }

        return response()->json($registrations);
    }

    public function register(Request $request, int $eventId)
    {
        $this->ensureStudent($request);

        $event = Event::findOrFail($eventId);

        $alreadyRegistered = EventRegistration::query()
            ->where('event_id', $eventId)
            ->where('user_id', $request->user()->user_id)
            ->whereIn('status', self::ACTIVE_STATUSES)
            ->exists();

        if ($alreadyRegistered) {
            return response()->json(['message' => 'You are already registered for this event.'], 422);
        }

        if ($event->seats_taken >= $event->seats_total) {
            return response()->json(['message' => 'This event is already full.'], 422);
        }

        $prefix = strtoupper(Str::substr(preg_replace('/[^A-Za-z]/', '', $event->type), 0, 3));

        $registration = EventRegistration::create([
            'event_id' => $eventId,
            'user_id' => $request->user()->user_id,
            'ticket_code' => sprintf('TCK-%s-%04d', $prefix, random_int(1000, 9999)),
            'status' => 'Pending Approval',
            'registered_on' => now(),
        ]);

        return response()->json($this->present($registration), 201);
    }

    public function cancel(Request $request, int $id)
    {
        $this->ensureStudent($request);

        $registration = EventRegistration::query()
            ->where('registration_id', $id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $registration->update(['status' => 'Cancelled']);

        return response()->json($this->present($registration));
    }

    /** Staff: everyone who registered for one event, with their username and when. */
    public function registrants(Request $request, int $eventId)
    {
        $this->ensureStaff($request);

        Event::findOrFail($eventId);

        $rows = EventRegistration::query()
            ->where('event_id', $eventId)
            ->with('user')
            ->orderBy('registered_on')
            ->get()
            ->map(fn (EventRegistration $r) => [
                'id' => $r->registration_id,
                'studentUsername' => $r->user?->username,
                'status' => $r->status,
                'registeredOn' => $r->registered_on->format('Y-m-d H:i'),
            ]);

        return response()->json($rows);
    }

    public function approve(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $registration = EventRegistration::findOrFail($id);
        $registration->update(['status' => 'Approved']);

        return response()->json($this->present($registration, withStudent: true));
    }

    public function deny(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $registration = EventRegistration::findOrFail($id);
        $registration->update(['status' => 'Denied']);

        return response()->json($this->present($registration, withStudent: true));
    }
}
