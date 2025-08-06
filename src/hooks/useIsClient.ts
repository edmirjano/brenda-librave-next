'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to check if the component is mounted on the client side
 * This helps prevent hydration mismatches by ensuring client-only code
 * only runs after the component has mounted
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}