// hooks/useSeo.ts
import { useState, useEffect } from 'react';
import { fetchSeoSettings } from '@/lib/api/seo';
import { SEOData } from '@/types/seo';

export function useSeo() {
  const [seo, setSeo] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSeo = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSeoSettings();
        
        if (isMounted) {
          setSeo(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load SEO data'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSeo();

    return () => {
      isMounted = false;
    };
  }, []);

  return { seo, isLoading, error };
}