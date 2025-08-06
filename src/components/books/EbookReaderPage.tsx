'use client';

import { EbookReader } from './EbookReader';
import { useRouter } from 'next/navigation';

interface EbookReaderPageProps {
  bookId: string;
  ebookUrl: string;
  title: string;
  author: string;
}

export function EbookReaderPage({ bookId, ebookUrl, title, author }: EbookReaderPageProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <EbookReader
      bookId={bookId}
      ebookUrl={ebookUrl}
      title={title}
      author={author}
      onClose={handleClose}
    />
  );
}