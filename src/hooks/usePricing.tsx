// src/hooks/usePricing.ts
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];

export function usePricing() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get price from cookie first (set by middleware)
    const cookiePrice = Cookies.get('selected_price');
    
    if (cookiePrice && !isNaN(Number(cookiePrice))) {
      setPrice(Number(cookiePrice));
      setIsLoading(false);
      return;
    }

    // Fallback to client-side random assignment if cookie is not available
    const randomPrice = PRICE_OPTIONS[Math.floor(Math.random() * PRICE_OPTIONS.length)];
    setPrice(randomPrice);
    
    // Set cookie for future visits
    Cookies.set('selected_price', randomPrice.toString(), { 
      expires: 30, // 30 days
      sameSite: 'lax' 
    });
    
    setIsLoading(false);
  }, []);

  // Function to track clicks
  const trackClick = async (clickedPrice: number) => {
    try {
      await fetch('/api/track-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: clickedPrice }),
      });
    } catch (error) {
      console.error('Error tracking price click:', error);
    }
  };

  // Function to track conversions (when purchase completed)
  const trackConversion = async (conversionPrice: number) => {
    try {
      await fetch('/api/track-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          price: conversionPrice,
          isConversion: true
        }),
      });
    } catch (error) {
      console.error('Error tracking price conversion:', error);
    }
  };

  return {
    price,
    isLoading,
    trackClick,
    trackConversion
  };
}