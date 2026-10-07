<?php

namespace App\Console\Commands;

use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Console\Command;

class PurgeArchivedItems extends Command
{
    protected $signature = 'announcements:purge-archived';

    protected $description = 'Permanently delete announcements and events archived more than 10 months ago';

    public function handle(): int
    {
        $cutoff = now()->subMonths(10);

        // Deleting an event cascades to its registrations and linked announcement.
        $events = Event::query()
            ->where(function ($q) use ($cutoff) {
                $q->where('archived_at', '<', $cutoff)
                    ->orWhere(fn ($finished) => $finished
                        ->whereNull('archived_at')
                        ->where('event_date', '<', $cutoff->toDateString()));
            })
            ->delete();

        $announcements = Announcement::query()
            ->where('archived_at', '<', $cutoff)
            ->delete();

        $this->info("Purged {$events} event(s) and {$announcements} announcement(s).");

        return self::SUCCESS;
    }
}
