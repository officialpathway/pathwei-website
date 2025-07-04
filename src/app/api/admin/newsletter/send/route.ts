// src/app/api/admin/newsletter/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getAdminUser } from '@/lib/auth/simple-auth';
import { prisma } from '@/lib/db/newsletter';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subject, content } = await request.json();
    const adminUser = getAdminUser();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content required' }, { status: 400 });
    }

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 });
    }

    // Create bulk email record
    const bulkEmail = await prisma.bulkEmail.create({
      data: {
        subject,
        content,
        sentTo: subscribers.length,
        status: 'sending',
        createdBy: adminUser.email
      }
    });

    // Send emails (you might want to use a queue for this in production)
    try {
      const emailPromises = subscribers.map(subscriber =>
        sendEmail({
          to: subscriber.email,
          subject,
          html: content,
          text: content.replace(/<[^>]*>/g, '') // Strip HTML for text version
        })
      );

      await Promise.all(emailPromises);

      // Update status to sent
      await prisma.bulkEmail.update({
        where: { id: bulkEmail.id },
        data: { status: 'sent' }
      });

      return NextResponse.json({ success: true, sentTo: subscribers.length });
    } catch (emailError) {
      // Update status to failed
      await prisma.bulkEmail.update({
        where: { id: bulkEmail.id },
        data: { status: 'failed' }
      });
      throw emailError;
    }
  } catch (error) {
    console.error('Bulk email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}