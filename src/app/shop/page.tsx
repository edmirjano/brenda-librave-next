import { redirect } from 'next/navigation';

// Redirect /shop to /books for better SEO and consistency
export default function ShopPage() {
  redirect('/books');
}
