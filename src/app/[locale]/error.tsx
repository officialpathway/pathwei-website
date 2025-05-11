'use client';

import { Link } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error indicator */}
        <div className="inline-flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-2">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-white text-sm bg-red-600 px-3 py-1 rounded-full">
            Error
          </span>
        </div>
        
        {/* Main content */}
        <h1 className="text-white text-3xl font-bold mb-4">
          Ha ocurrido un error
        </h1>
        
        <p className="text-white/80 mb-8">
          No pudimos cargar la página. Por favor, intenta nuevamente.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button 
            onClick={reset} 
            className="bg-[#ff9900] hover:bg-[#ff9900]/90 text-black font-bold py-3 px-6 rounded-lg w-full"
          >
            Reintentar
          </button>
          
          <Link
            href="/" 
            className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-medium py-3 px-6 rounded-lg w-full"
          >
            Volver a Inicio
          </Link>
        </div>
        
        {/* Store links - placeholder text */}
        <div className="text-white/60 text-sm">
          ¿Buscas descargar nuestra app? Visita nuestra 
          <Link href="/" className="text-[#ff9900] hover:underline"> página principal</Link> 
          para links de descarga.
        </div>
      </div>
      
      {/* Error code - kept minimal */}
      <div className="text-white/40 text-xs mt-8">
        Error: {error.message ? error.message.slice(0, 50) + (error.message.length > 50 ? '...' : '') : 'Desconocido'}
      </div>
    </div>
  );
}