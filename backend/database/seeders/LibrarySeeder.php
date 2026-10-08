<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\LibraryCategory;
use App\Models\User;

class LibrarySeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $creatorId = $superadmin ? $superadmin->user_id : null;

        $cat = LibraryCategory::updateOrCreate(
            ['name' => 'Computer Science'],
            ['normalized_name' => 'computer science', 'is_active' => true, 'created_by' => $creatorId]
        );

        $book1 = Book::updateOrCreate(
            ['isbn' => '978-0131103627'],
            [
                'isbn_normalized' => '9780131103627',
                'book_title' => 'The C Programming Language',
                'author' => 'Brian W. Kernighan, Dennis M. Ritchie',
                'publisher' => 'Prentice Hall',
                'publication_year' => 1988,
                'category' => $cat->category_id,
                'physical_location' => 'A1-Shelf',
                'total_copies' => 2,
            ]
        );

        BookCopy::updateOrCreate(['book_id' => $book1->book_id, 'condition' => 'good'], ['availability_status' => 'available']);
        BookCopy::updateOrCreate(['book_id' => $book1->book_id, 'condition' => 'new'], ['availability_status' => 'available']);

        $book2 = Book::updateOrCreate(
            ['isbn' => '978-0201835953'],
            [
                'isbn_normalized' => '9780201835953',
                'book_title' => 'The Mythical Man-Month',
                'author' => 'Frederick P. Brooks Jr.',
                'publisher' => 'Addison-Wesley',
                'publication_year' => 1995,
                'category' => $cat->category_id,
                'physical_location' => 'B2-Shelf',
                'total_copies' => 1,
            ]
        );

        BookCopy::updateOrCreate(['book_id' => $book2->book_id, 'condition' => 'good'], ['availability_status' => 'available']);
    }
}
