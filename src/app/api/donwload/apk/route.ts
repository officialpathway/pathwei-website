// src/app/api/download/apk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple token generation for secure downloads
function generateSecureToken(username: string): string {
  const secret = process.env.APK_DOWNLOAD_SECRET || 'your-secret-key';
  const timestamp = Math.floor(Date.now() / 1000);
  const expiresIn = timestamp + (3600 * 2); // 2 hours expiry

  const payload = `${username}:${expiresIn}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials from environment variables
    const validUsername = process.env.BETA_USERNAME;
    const validPassword = process.env.BETA_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { message: 'Servicio temporalmente no disponible' },
        { status: 503 }
      );
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Generate secure token for download
    const token = generateSecureToken(username);

    // Your external storage URL with token
    const baseUrl = process.env.APK_STORAGE_URL || 'https://your-storage-provider.com';
    const downloadUrl = `${baseUrl}/download/pathway-beta.apk?token=${token}&user=${encodeURIComponent(username)}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      message: 'Token de descarga generado exitosamente',
      expiresIn: '2 horas'
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Optional: Token validation endpoint for the storage server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (!token || !user) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Validate token
    const secret = process.env.APK_DOWNLOAD_SECRET || 'your-secret-key';

    try {
      const decoded = Buffer.from(token, 'base64url').toString();
      const [username, expiresIn, signature] = decoded.split(':');

      // Check expiry
      const now = Math.floor(Date.now() / 1000);
      if (parseInt(expiresIn) < now) {
        return NextResponse.json({ valid: false, reason: 'Token expired' });
      }

      // Verify signature
      const payload = `${username}:${expiresIn}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature || username !== user) {
        return NextResponse.json({ valid: false, reason: 'Invalid token' });
      }

      return NextResponse.json({ valid: true, username });

    } catch (error) {
      console.log(error);
      return NextResponse.json({ valid: false, reason: 'Malformed token' });
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}