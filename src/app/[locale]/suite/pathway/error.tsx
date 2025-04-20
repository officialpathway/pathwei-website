// app/[locale]/suite/pathway/error.tsx
'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4 bg-red-900 text-white">
      <h2>Device Detection Error</h2>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}