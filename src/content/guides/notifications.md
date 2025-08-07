# Notifications Domain

> Real-time user notification system for in-app and push notifications

## Overview

The Notifications domain manages user notifications through a comprehensive system that handles in-app notifications, push notifications, user preferences, and notification state management. It provides a centralized solution for delivering real-time user communications and maintaining notification history.

## Domain Boundaries

### Responsibilities

- In-app notification creation and management
- Push notification delivery via Expo SDK
- Notification preferences management
- Notification read/unread state tracking
- Recent notification queries and pagination

### What It Does NOT Handle

- Email notifications (handled by Email domain)
- SMS notifications
- Browser notifications
- Template rendering (static templates only)
- Notification scheduling

### Dependencies

- **User Management**: User authentication and push tokens
- **Email**: Achievement and reminder email notifications

## Architecture

```
src/domains/notifications/
├── controllers/
│   ├── notification.controller.ts       # Notification CRUD operations
│   └── push-notification.controller.ts  # Push notification management
├── services/
│   ├── core-notification.service.ts     # Core notification business logic
│   └── push-notification.service.ts     # Expo push notifications
├── models/
│   ├── notification.model.ts            # In-app notification model
│   ├── notification-preference.model.ts # User preferences model
│   ├── associations.ts                  # Model relationships
│   └── index.ts                        # Model exports
├── interfaces/
│   └── external.interfaces.ts          # External contracts
├── notifications.domain.ts             # Domain registration
└── index.ts                           # Public exports
```

## API Endpoints

### Notifications Management

- `GET /notifications/health` - Health check endpoint
- `GET /notifications` - Get paginated user notifications with filters
- `GET /notifications/recent` - Get notifications from last 24 hours
- `GET /notifications/unread-count` - Get unread notification count
- `PUT /notifications/:id/read` - Mark specific notification as read
- `PUT /notifications/mark-all-read` - Mark all user notifications as read
- `DELETE /notifications/:id` - Delete specific notification

### Push Notifications

- `GET /notifications/push/health` - Push service health check
- `POST /notifications/push/test` - Send test push notification
- `POST /notifications/push/send` - Send custom push notification
- `POST /notifications/push/token` - Update user push token

## Data Models

### Notification

Primary model for in-app notifications with comprehensive state tracking.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - Associated user ID
- `notificationType` (enum) - Type: "achievement", "milestone", "reminder", "social", "system"
- `targetEntityType` (string, optional) - Related entity type
- `targetEntityId` (number, optional) - Related entity ID
- `title` (string) - Notification title
- `message` (string) - Notification message content
- `isRead` (boolean) - Read status
- `isSent` (boolean) - Delivery status
- `scheduledAt` (Date, optional) - Scheduled delivery time
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to User (userId)

### NotificationPreference

User-specific notification preferences with granular control.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - Associated user ID
- `emailNotifications` (boolean) - Email notification preference
- `pushNotifications` (boolean) - Push notification preference
- `achievementNotifications` (boolean) - Achievement-specific preference
- `milestoneNotifications` (boolean) - Milestone-specific preference
- `reminderNotifications` (boolean) - Reminder-specific preference
- `socialNotifications` (boolean) - Social-specific preference
- `systemNotifications` (boolean) - System-specific preference

## Core Services

### CoreNotificationService

Main service for in-app notification management with comprehensive CRUD operations.

**Key Methods:**
- `createNotification(data)` - Create new in-app notification
- `getUserNotifications(userId, options)` - Get user notifications with pagination
- `markAsRead(userId, notificationId)` - Mark notification as read
- `markAllAsRead(userId)` - Mark all user notifications as read
- `getUnreadCount(userId)` - Get unread notification count
- `deleteNotification(userId, notificationId)` - Delete notification

### PushNotificationService

Expo SDK-based push notification service with bulk operations support.

**Key Methods:**
- `sendPushNotification(token, title, body, data)` - Send single push notification
- `sendTestPushNotification(token)` - Send test notification
- `sendBulkNotifications(notifications)` - Send multiple push notifications with chunking

## Domain Events

### Published Events

The domain publishes events for notification lifecycle management:

- `notification.created` - When a new notification is created
- `notification.read` - When a notification is marked as read
- `push.sent` - When a push notification is successfully sent
- `push.failed` - When push notification delivery fails

### Consumed Events

Currently, the domain does not consume external events directly but is designed to be triggered by:

- Achievement unlocks
- Milestone completions
- Social interactions
- System alerts

## Usage Examples

### Creating In-App Notifications

```typescript
import { CoreNotificationService } from '@domains/notifications';

const notificationService = Container.get(CoreNotificationService);

const notification = await notificationService.createNotification({
  userId: 123,
  notificationType: 'achievement',
  targetEntityType: 'achievement',
  targetEntityId: 456,
  title: 'Achievement Unlocked!',
  message: 'You completed your first learning path!',
  isRead: false,
  isSent: true
});
```

### Sending Push Notifications

```typescript
import { PushNotificationService } from '@domains/notifications';

const pushService = Container.get(PushNotificationService);

const success = await pushService.sendPushNotification(
  'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  '🎉 Congratulations!',
  'You just completed your daily learning goal!',
  { type: 'achievement', achievementId: 123 }
);
```

### Bulk Push Notifications

```typescript
const result = await pushService.sendBulkNotifications([
  {
    pushToken: 'ExponentPushToken[token1]',
    title: 'Daily Reminder',
    body: 'Complete your learning session!',
    data: { type: 'reminder', routineId: 1 }
  },
  {
    pushToken: 'ExponentPushToken[token2]',
    title: 'Achievement Unlocked',
    body: 'You earned a new badge!',
    data: { type: 'achievement', badgeId: 5 }
  }
]);

console.log(`Success: ${result.success}, Failed: ${result.failed}`);
```

### Managing Notification Preferences

```typescript
import { NotificationPreference } from '@domains/notifications';

const preferences = await NotificationPreference.findOne({
  where: { userId: 123 }
});

await preferences.update({
  pushNotifications: true,
  achievementNotifications: true,
  reminderNotifications: false
});
```

## Configuration

### Environment Variables

```bash
# Required for push notifications
EXPO_ACCESS_TOKEN=your_expo_access_token

# Optional push notification settings
PUSH_NOTIFICATIONS_ENABLED=true
PUSH_NOTIFICATION_MAX_RETRIES=3
```

### External Interfaces

The domain defines external contracts for cross-domain integration:

- `INotificationUser` - User entity interface for notifications
- `IUserRepository` - User data access interface  
- `IEmailService` - Email service interface for achievement and reminder emails
- `INotificationQuery` - API query parameters interface
- `ISendPushRequest` - Push notification request payload interface

## Business Rules

### Notification Rules

- Notifications are user-specific and isolated
- Multiple notification types supported: achievement, milestone, reminder, social, system
- Notifications support optional entity linking for context
- Read/unread state is maintained per notification
- Notifications can be scheduled for future delivery

### Push Notification Rules

- Requires valid Expo push token format
- Push notifications are validated before sending
- Bulk push notifications are chunked for efficiency
- Failed push notifications are logged with error details
- Test notifications include identifying metadata

### Data Integrity Rules

- User ID is required for all notifications
- Notification type must be from predefined enum
- Title and message are required fields
- Timestamps are automatically managed
- Soft deletion is not implemented (hard delete only)

## Mobile-Only Endpoints

All notification endpoints are decorated with `@MobileOnly`, restricting access to mobile clients only. This ensures:

- Enhanced security for notification operations
- Optimized mobile-specific functionality
- Proper authentication context for push tokens

## Error Handling

The domain implements comprehensive error handling:

- Authentication validation for all operations
- User existence verification
- Notification ownership validation
- Push token format validation
- Graceful degradation for push notification failures
- Structured error responses with detailed messages

## Performance Considerations

### Query Optimization

- Pagination support for notification lists
- Indexed queries on userId and isRead status
- Efficient recent notification queries (24-hour window)
- Unread count optimization with direct counting

### Push Notification Efficiency

- Bulk notification processing with chunking
- Invalid token filtering before processing
- Asynchronous push notification delivery
- Comprehensive logging for monitoring and debugging
