import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { BookService } from '@/lib/services/books';
import { EbookReaderPage } from '@/components/books/EbookReaderPage';

interface ReadPageProps {
  params: {
    slug: string;
  };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  try {
    // Get book by slug
    const book = await BookService.getBookBySlug(params.slug);
    
    if (!book) {
      redirect('/404');
    }

    // Check if user has digital access (this will be verified again in the API)
    const accessResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/books/${book.id}/read`, {
      headers: {
        cookie: `next-auth.session-token=${session.user.id}` // In a real app, this would be handled differently
      }
    });

    if (!accessResponse.ok) {
      redirect(`/books/${params.slug}?error=no-access`);
    }

    const ebookData = await accessResponse.json();

    return (
      <EbookReaderPage
        bookId={book.id}
        ebookUrl={ebookData.ebookUrl}
        title={book.title}
        author={book.author}
      />
    );
  } catch (error) {
    console.error('Error loading ebook:', error);
    redirect('/404');
  }
}