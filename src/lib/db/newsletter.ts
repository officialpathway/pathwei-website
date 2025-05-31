// src/lib/db/newsletter.ts
import { PrismaClient } from '@prisma/client';

// Global is used here to maintain a cached connection across hot reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

export class NewsletterService {
  /**
   * Subscribe an email to the newsletter
   */
  static async subscribe(email: string): Promise<NewsletterSubscriber> {
    try {
      // Check if email already exists
      const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          throw new Error('Email is already subscribed to the newsletter');
        } else {
          // Reactivate the subscription
          const updatedSubscriber = await prisma.newsletterSubscriber.update({
            where: { email: email.toLowerCase().trim() },
            data: { 
              isActive: true,
              subscribedAt: new Date()
            }
          });
          return updatedSubscriber;
        }
      }

      // Create new subscription
      const subscriber = await prisma.newsletterSubscriber.create({
        data: {
          email: email.toLowerCase().trim()
        }
      });

      return subscriber;
    } catch (error) {
      console.error('NewsletterService.subscribe error:', error);
      throw error;
    }
  }

  /**
   * Get all active subscribers
   */
  static async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' }
      });
      return subscribers;
    } catch (error) {
      console.error('NewsletterService.getAllSubscribers error:', error);
      throw error;
    }
  }

  /**
   * Get total count of active subscribers
   */
  static async getSubscriberCount(): Promise<number> {
    try {
      const count = await prisma.newsletterSubscriber.count({
        where: { isActive: true }
      });
      return count;
    } catch (error) {
      console.error('NewsletterService.getSubscriberCount error:', error);
      throw error;
    }
  }

  /**
   * Delete a subscriber (soft delete by setting isActive to false)
   */
  static async deleteSubscriber(email: string): Promise<boolean> {
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!subscriber) {
        return false;
      }

      await prisma.newsletterSubscriber.update({
        where: { email: email.toLowerCase().trim() },
        data: { isActive: false }
      });

      return true;
    } catch (error) {
      console.error('NewsletterService.deleteSubscriber error:', error);
      throw error;
    }
  }

  /**
   * Permanently delete a subscriber from the database
   */
  static async permanentlyDeleteSubscriber(email: string): Promise<boolean> {
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!subscriber) {
        return false;
      }

      await prisma.newsletterSubscriber.delete({
        where: { email: email.toLowerCase().trim() }
      });

      return true;
    } catch (error) {
      console.error('NewsletterService.permanentlyDeleteSubscriber error:', error);
      throw error;
    }
  }

  /**
   * Get the latest subscription date
   */
  static async getLatestSubscriptionDate(): Promise<Date | null> {
    try {
      const latestSubscriber = await prisma.newsletterSubscriber.findFirst({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
        select: { subscribedAt: true }
      });

      return latestSubscriber?.subscribedAt || null;
    } catch (error) {
      console.error('NewsletterService.getLatestSubscriptionDate error:', error);
      throw error;
    }
  }

  /**
   * Check if an email is subscribed
   */
  static async isSubscribed(email: string): Promise<boolean> {
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { 
          email: email.toLowerCase().trim() 
        },
        select: { isActive: true }
      });

      return subscriber?.isActive || false;
    } catch (error) {
      console.error('NewsletterService.isSubscribed error:', error);
      throw error;
    }
  }

  /**
   * Get subscriber by email
   */
  static async getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      return subscriber;
    } catch (error) {
      console.error('NewsletterService.getSubscriberByEmail error:', error);
      throw error;
    }
  }

  /**
   * Get paginated subscribers
   */
  static async getPaginatedSubscribers(
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    subscribers: NewsletterSubscriber[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [subscribers, total] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
          where: { isActive: true },
          orderBy: { subscribedAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.newsletterSubscriber.count({
          where: { isActive: true }
        })
      ]);

      return {
        subscribers,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('NewsletterService.getPaginatedSubscribers error:', error);
      throw error;
    }
  }
}

// Export the prisma instance if needed elsewhere
export { prisma };