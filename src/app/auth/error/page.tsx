import { Metadata } from 'next';

import { AuthErrorContent } from '@/components/auth/AuthErrorContent';

export const metadata: Metadata = {
  title: 'Gabim në autentifikim | Brënda Librave',
  description: 'Ka ndodhur një gabim gjatë procesit të autentifikimit.',
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

const errorMessages = {
  Configuration: {
    message: 'Konfigurim i pasaktë i serverit',
    description: 'Ka një problem në konfigurimin e serverit. Ju lutemi kontaktoni administratorin.',
  },
  AccessDenied: {
    message: 'Aksesi u refuzua',
    description: 'Nuk keni leje për të aksesuar këtë faqe ose resursin e kërkuar.',
  },
  Verification: {
    message: 'Verifikimi dështoi',
    description: 'Token-i i verifikimit është i pavlefshëm ose ka skaduar.',
  },
  Default: {
    message: 'Gabim në autentifikim',
    description: 'Ka ndodhur një gabim gjatë procesit të hyrjes në sistem.',
  },
} as const;

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const error = params.error || 'Default';
  const errorData =
    error in errorMessages
      ? errorMessages[error as keyof typeof errorMessages]
      : errorMessages.Default;

  return <AuthErrorContent error={error} errorData={errorData} />;
}
