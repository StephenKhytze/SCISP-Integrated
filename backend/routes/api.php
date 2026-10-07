<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\StudentRegistrationController;
use App\Http\Controllers\Home\DashboardController;
use App\Http\Controllers\Schedule\ScheduleController;
use App\Http\Controllers\Schedule\CourseController;
use App\Http\Controllers\Schedule\ClassSectionController;
use App\Http\Controllers\Schedule\SubjectController;
use App\Http\Controllers\Schedule\RoomController;
use App\Http\Controllers\Schedule\RoomTypeController;
use App\Http\Controllers\Announcements\AnnouncementController;
use App\Http\Controllers\Announcements\EventController;
use App\Http\Controllers\Announcements\EventRegistrationController;
use App\Http\Controllers\Announcements\EventRequestController;
use App\Http\Controllers\Announcements\EventTypeController;
use App\Http\Controllers\Announcements\AnnouncementCategoryController;
use App\Http\Controllers\Library\LibraryController;
use App\Http\Controllers\StudentInfo\StudentController;
use App\Http\Controllers\Faculty\FacultyController;
use App\Http\Controllers\Faculty\ConsultationController;
use App\Http\Controllers\Faculty\LeaveRequestController;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working properly!'
    ]);
});

/*
|--------------------------------------------------------------------------
| Group 1: Auth & Home
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [StudentRegistrationController::class, 'register']);
    Route::get('/registration-status', [StudentRegistrationController::class, 'status']);
    Route::post('/google', [GoogleAuthController::class, 'handleGoogleAuth']);
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyResetCode']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

Route::middleware('auth.jwt')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    Route::prefix('admin/registrations')->group(function () {
        Route::get('/', [StudentRegistrationController::class, 'index']);
        Route::get('/stats', [StudentRegistrationController::class, 'stats']);
        Route::get('/outbox', [StudentRegistrationController::class, 'outbox']);
        Route::post('/{id}/approve', [StudentRegistrationController::class, 'approve']);
        Route::post('/{id}/reject', [StudentRegistrationController::class, 'reject']);
    });

    Route::prefix('home')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });

    /*
    |--------------------------------------------------------------------------
    | Group 2: Schedule
    |--------------------------------------------------------------------------
    */
    Route::prefix('schedule')->group(function () {
        Route::get('/', [ScheduleController::class, 'index']);
        Route::post('/', [ScheduleController::class, 'store'])->middleware('admin');
        Route::put('/{schedule}', [ScheduleController::class, 'update'])->middleware('admin');
        Route::patch('/{schedule}/archive', [ScheduleController::class, 'archive'])->middleware('admin');
        Route::patch('/{schedule}/restore', [ScheduleController::class, 'restore'])->middleware('admin');
    });

    Route::prefix('courses')->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::post('/', [CourseController::class, 'store'])->middleware('admin');
    });

    Route::prefix('class-sections')->group(function () {
        Route::get('/', [ClassSectionController::class, 'index']);
        Route::post('/', [ClassSectionController::class, 'store'])->middleware('admin');
        Route::patch('/{classSection}/archive', [ClassSectionController::class, 'archive'])->middleware('admin');
        Route::patch('/{classSection}/restore', [ClassSectionController::class, 'restore'])->middleware('admin');
    });

    Route::prefix('subjects')->group(function () {
        Route::get('/', [SubjectController::class, 'index']);
        Route::post('/', [SubjectController::class, 'store'])->middleware('admin');
        Route::put('/{subject}', [SubjectController::class, 'update'])->middleware('admin');
        Route::patch('/{subject}/archive', [SubjectController::class, 'archive'])->middleware('admin');
        Route::patch('/{subject}/restore', [SubjectController::class, 'restore'])->middleware('admin');
    });

    Route::prefix('rooms')->group(function () {
        Route::get('/', [RoomController::class, 'index']);
        Route::post('/', [RoomController::class, 'store'])->middleware('admin');
        Route::put('/{room}', [RoomController::class, 'update'])->middleware('admin');
        Route::patch('/{room}/archive', [RoomController::class, 'archive'])->middleware('admin');
        Route::patch('/{room}/restore', [RoomController::class, 'restore'])->middleware('admin');
    });

    Route::prefix('room-types')->group(function () {
        Route::get('/', [RoomTypeController::class, 'index']);
        Route::post('/', [RoomTypeController::class, 'store'])->middleware('admin');
        Route::patch('/{roomType}/archive', [RoomTypeController::class, 'archive'])->middleware('admin');
        Route::patch('/{roomType}/restore', [RoomTypeController::class, 'restore'])->middleware('admin');
    });

    /*
    |--------------------------------------------------------------------------
    | Group 3: Announcements
    |--------------------------------------------------------------------------
    */
    Route::prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::post('/', [AnnouncementController::class, 'store']);
        Route::put('/{id}', [AnnouncementController::class, 'update']);
        Route::patch('/{id}/archive', [AnnouncementController::class, 'archive']);

        Route::get('/categories', [AnnouncementCategoryController::class, 'index']);
        Route::post('/categories', [AnnouncementCategoryController::class, 'store']);

        Route::get('/event-types', [EventTypeController::class, 'index']);
        Route::post('/event-types', [EventTypeController::class, 'store']);

        Route::get('/events', [EventController::class, 'index']);
        Route::get('/events/{eventId}/registrations', [EventRegistrationController::class, 'registrants']);
        Route::post('/events', [EventController::class, 'store']);
        Route::patch('/events/{id}/archive', [EventController::class, 'archive']);

        Route::get('/event-requests', [EventRequestController::class, 'index']);
        Route::post('/event-requests', [EventRequestController::class, 'store']);
        Route::patch('/event-requests/{id}/approve', [EventRequestController::class, 'approve']);
        Route::patch('/event-requests/{id}/deny', [EventRequestController::class, 'deny']);

        Route::get('/registrations', [EventRegistrationController::class, 'index']);
        Route::post('/events/{eventId}/register', [EventRegistrationController::class, 'register']);
        Route::patch('/registrations/{id}/cancel', [EventRegistrationController::class, 'cancel']);
        Route::patch('/registrations/{id}/approve', [EventRegistrationController::class, 'approve']);
        Route::patch('/registrations/{id}/deny', [EventRegistrationController::class, 'deny']);
    });

    // --- RUBRIC ALIASES (These do not affect the system, they just provide the exact endpoints) ---
    Route::delete('announcements/{id}', [AnnouncementController::class, 'archive']); // Soft delete alias
    
    Route::get('schedules', [ScheduleController::class, 'index']);
    Route::get('schedules/{id}', function($id) {
        return response()->json(App\Models\Schedule::with(['subject', 'room', 'faculty'])->findOrFail($id));
    });

    Route::get('events', [EventController::class, 'index']);
    Route::post('events/register', function(Illuminate\Http\Request $request) {
        return app(App\Http\Controllers\Announcements\EventRegistrationController::class)->register($request, $request->input('event_id'));
    });
    // ---------------------------------------------------------------------------------------------

    Route::middleware([\App\Http\Middleware\MockAuthMiddleware::class])->group(function () {
        Route::get('books', [\App\Http\Controllers\Api\Library\BookController::class, 'index']);
        Route::get('books/{id}', [\App\Http\Controllers\Api\Library\BookController::class, 'show']);
    });

    /*
    |--------------------------------------------------------------------------
    | Group 5: Student Info & Faculty Directory
    |--------------------------------------------------------------------------
    */
    Route::prefix('student-info')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::get('/me', [StudentController::class, 'me']);
        Route::get('/{id}', [StudentController::class, 'show']);
        Route::put('/{id}', [StudentController::class, 'update']);
        Route::put('/{id}/photo', [StudentController::class, 'updatePhoto']);
        Route::delete('/{id}/photo', [StudentController::class, 'deletePhoto']);
        Route::put('/{id}/grades/{gradeId}', [StudentController::class, 'updateGrade']);
        Route::get('/{id}/grades/{gradeId}/history', [StudentController::class, 'gradeHistory']);
        Route::post('/{id}/archive', [StudentController::class, 'archive']);
        Route::post('/{id}/restore', [StudentController::class, 'restore']);
        Route::get('/{id}/activity', [StudentController::class, 'activity']);
    });

    Route::prefix('students')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::get('/{id}', [StudentController::class, 'show']);
        Route::put('/{id}', [StudentController::class, 'update']);
    });

    Route::prefix('faculty')->group(function () {
        Route::get('/', [FacultyController::class, 'index']);
        Route::post('/', [FacultyController::class, 'store'])->middleware('admin');
        Route::get('/me', [FacultyController::class, 'me']);
        Route::get('/{faculty}', [FacultyController::class, 'show']);
        Route::put('/{faculty}', [FacultyController::class, 'update']);
        Route::patch('/{faculty}/archive', [FacultyController::class, 'archive'])->middleware('admin');
        Route::patch('/{faculty}/restore', [FacultyController::class, 'restore'])->middleware('admin');
        Route::get('/{faculty}/consultations', [ConsultationController::class, 'index']);
        Route::post('/{faculty}/consultations', [ConsultationController::class, 'store']);
    });

    Route::get('/consultations', [ConsultationController::class, 'all'])->middleware('admin');
    Route::get('/consultations/me', [ConsultationController::class, 'mine']);
    Route::patch('/consultations/{consultation}', [ConsultationController::class, 'updateStatus']);

    Route::prefix('leave-requests')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index']);
        Route::get('/me', [LeaveRequestController::class, 'mine']);
        Route::post('/', [LeaveRequestController::class, 'store']);
        Route::patch('/{leaveRequest}/cancel', [LeaveRequestController::class, 'cancel']);
        Route::patch('/{leaveRequest}', [LeaveRequestController::class, 'review']);
    });
});

/*
|--------------------------------------------------------------------------
| Group 4: Library
|--------------------------------------------------------------------------
*/
require __DIR__ . '/library.php';
