<?php

namespace App\Mail;

use App\Models\StudentRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentRegistrationApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public StudentRegistration $registration,
        public string $username,
        public string $temporaryPassword,
        public string $loginUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ABC School - Your Student Portal Account is Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.registration_approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
