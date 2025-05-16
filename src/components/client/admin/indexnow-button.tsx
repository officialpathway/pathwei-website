'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, RefreshCw } from 'lucide-react';

export default function IndexNowButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIndexNow = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to trigger IndexNow');
      }
      
      setResult(data);
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'An error occurred while triggering IndexNow'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleIndexNow} 
        disabled={isLoading}
        className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
        variant="outline"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Index Now
          </>
        )}
      </Button>
      
      {result && (
        <Alert className="bg-green-950 border-green-700">
          <AlertTitle className="text-green-400">Success!</AlertTitle>
          <AlertDescription className="text-green-300">
            {result.message || 'URLs successfully submitted for indexing'}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}