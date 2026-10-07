<?php

namespace App\Mail;

use App\Models\StudentRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentRegistrationDeniedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public StudentRegistration $registration,
        public ?string $reason = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ABC School Student Registration Update',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.registration_denied',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
