// scripts/init-stats.js
import { put } from '@vercel/blob';
import 'dotenv/config';

async function initStats() {
  try {
    const initialStats = {
      prices: {
        '4.99': { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() },
        '7.49': { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() },
        '9.99': { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() }
      }
    };
    
    console.log('Initializing price testing stats...');
    
    // Save to Vercel Blob
    const jsonString = JSON.stringify(initialStats);
    await put('price-tracking/stats', jsonString, {
      contentType: 'application/json',
      access: 'private',
    });
    
    console.log('Stats initialized successfully!');
  } catch (error) {
    console.error('Error initializing stats:', error);
    process.exit(1);
  }
}

initStats();