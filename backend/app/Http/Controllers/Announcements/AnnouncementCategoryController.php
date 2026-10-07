<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\AnnouncementCategory;
use Illuminate\Http\Request;

class AnnouncementCategoryController extends Controller
{
    use EnforcesAnnouncementRoles;

    /** Every announcement category, in the order they were created. */
    public function index()
    {
        return response()->json(AnnouncementCategory::orderBy('category_id')->pluck('name')->values());
    }

    public function store(Request $request)
    {
        $this->ensureStaff($request);

        $request->merge(['name' => trim((string) $request->input('name'))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:60', 'unique:announcement_categories,name'],
        ]);

        $category = AnnouncementCategory::create(['name' => $validated['name']]);

        return response()->json($category->name, 201);
    }
}
