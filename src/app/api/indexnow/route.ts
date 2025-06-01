import { NextResponse } from 'next/server';

// Update with your domain
const INDEXNOW_HOST = 'www.mypathwayapp.com';
const INDEXNOW_KEY = '480941de2c0b4980b807f4ef5734f3cd'; // You should generate a new key or use your existing one
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// Available locales
const LOCALES = ['en', 'es'];

// Paths that should be indexed for each locale
const PATHS = [
  '',
  '/terminos',
  '/privacidad',
  '/equipo',
  // Add other paths here
];

// Generate URLs for all locales
function generateLocalizedUrls(): string[] {
  const urls: string[] = [];
  
  // Add locale-specific URLs
  LOCALES.forEach(locale => {
    PATHS.forEach(path => {
      // For the root path of a locale, we don't need an extra slash
      if (path === '') {
        urls.push(`https://${INDEXNOW_HOST}/${locale}`);
      } else {
        urls.push(`https://${INDEXNOW_HOST}/${locale}${path}`);
      }
    });
  });
  
  return urls;
}

// Update with your actual URLs that need indexing
const URLS_TO_INDEX = generateLocalizedUrls();

/**
 * API route for submitting URLs to IndexNow API
 * @returns {Promise<NextResponse>} A Next.js response object
 */
export async function POST(): Promise<NextResponse> {
  try {
    // Prepare the request body for IndexNow API
    const indexNowPayload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: URLS_TO_INDEX
    };

    // Log the payload (for debugging, remove in production)
    console.log('Submitting to IndexNow API:', JSON.stringify(indexNowPayload, null, 2));
    console.log('URLs being submitted:', URLS_TO_INDEX);

    // Make the request to IndexNow API
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload),
    });

    // Handle the response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('IndexNow API error:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to submit URLs to IndexNow API', 
          error: errorText,
          status: response.status,
          statusText: response.statusText
        }, 
        { status: response.status }
      );
    }

    // Try to parse the response if any
    let responseData = {};
    try {
      const text = await response.text();
      if (text) {
        responseData = { rawResponse: text };
      }
    } catch {
      console.log('No parseable response from IndexNow API');
    }

    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'URLs successfully submitted to IndexNow API',
        submittedUrls: URLS_TO_INDEX.length,
        urls: URLS_TO_INDEX,
        ...responseData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing IndexNow request', 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}