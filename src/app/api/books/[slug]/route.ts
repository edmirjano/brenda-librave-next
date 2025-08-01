import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@/lib/services/books';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Book slug is required' },
        { status: 400 }
      );
    }

    const book = await BookService.getBookBySlug(slug);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if book is active (unless it's an admin request)
    if (!book.active) {
      return NextResponse.json(
        { success: false, error: 'Book not available' },
        { status: 404 }
      );
    }

    // Get related books
    const relatedBooks = await BookService.getRelatedBooks(book.id, 4);

    return NextResponse.json({
      success: true,
      data: {
        book,
        relatedBooks
      }
    });

  } catch (error) {
    console.error('Error in book detail API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch book'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // This endpoint is for updating books (admin only)
    // Authentication and authorization would be added here
    
    const { slug } = params;
    const body = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Book slug is required' },
        { status: 400 }
      );
    }

    // First get the book to find its ID
    const existingBook = await BookService.getBookBySlug(slug);
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    const updatedBook = await BookService.updateBook({
      id: existingBook.id,
      ...body
    });

    return NextResponse.json({
      success: true,
      data: updatedBook
    });

  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update book'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // This endpoint is for deleting books (admin only)
    // Authentication and authorization would be added here
    
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Book slug is required' },
        { status: 400 }
      );
    }

    // First get the book to find its ID
    const existingBook = await BookService.getBookBySlug(slug);
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    await BookService.deleteBook(existingBook.id);

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete book'
      },
      { status: 500 }
    );
  }
}