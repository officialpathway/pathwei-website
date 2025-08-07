# Email Domain

> Comprehensive email delivery infrastructure with multi-provider support, templates, and bulk campaigns

## Overview

The Email domain handles all email delivery functionality including transactional emails (authentication, notifications), templating system, bulk email campaigns, queue management, and delivery metrics. It provides a unified, scalable email communication infrastructure with multi-provider support and comprehensive testing tools.

## Domain Boundaries

### Responsibilities

- ✅ **Transactional Email Delivery**: Authentication, notifications, and system emails
- ✅ **Template Management**: Handlebars-based email template system with variable validation
- ✅ **Bulk Email Campaigns**: Mass email delivery with recipient segmentation and tracking
- ✅ **Queue Processing**: Redis-based email queue with retry logic and batch processing
- ✅ **Multi-Provider Support**: Gmail, SMTP, and development modes (Ethereal, Console)
- ✅ **Delivery Metrics**: Comprehensive tracking and performance monitoring

### External Dependencies

- **User Management**: User data access and email address validation
- **Configuration Service**: SMTP settings and application configuration
- **Event System**: Cross-domain event handling and dispatching
- **Redis**: Queue management and caching (optional)

## Architecture

```
src/domains/email/
├── controllers/                      # HTTP request handlers
│   ├── bulk-email.controller.ts
│   ├── email-test.controller.ts
│   └── index.ts
├── services/                        # Business logic
│   ├── core/                       # Core email infrastructure
│   │   ├── email-core.service.ts
│   │   ├── email-bulk.service.ts
│   │   ├── email-queue.service.ts
│   │   ├── email-metrics.service.ts
│   │   ├── email-validation.service.ts
│   │   └── index.ts
│   ├── business/                   # Business email services
│   │   ├── email-auth.service.ts
│   │   ├── email-notification.service.ts
│   │   ├── email-sytem.service.ts
│   │   └── index.ts
│   ├── template/                   # Template management
│   │   ├── email-template.service.ts
│   │   └── index.ts
│   ├── email-manager.service.ts    # Unified service manager
│   └── index.ts
├── models/                         # Data models
│   ├── bulk-email.model.ts
│   ├── associations.ts
│   └── index.ts
├── interfaces/                     # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── subscribers/                    # Event handlers
│   ├── mail.subscriber.ts
│   └── index.ts
├── validators/                     # Input validation
│   ├── email.validators.ts
│   └── index.ts
├── email.domain.ts                # Domain registration
└── index.ts                       # Public API
```

## API Endpoints

### Bulk Email Management

- `GET /email/bulk-email/stats` - Get bulk email statistics
- `GET /email/bulk-email/recipients/counts` - Get recipient counts
- `POST /email/bulk-email/send` - Send bulk email campaign
- `GET /email/bulk-email/history` - Get bulk email history
- `GET /email/bulk-email/:id` - Get bulk email details
- `POST /email/bulk-email/preview` - Preview bulk email

### Development Testing

- `POST /dev/email/test/simple` - Send simple test email
- `POST /dev/email/test/template` - Send template test email
- `POST /dev/email/test/custom` - Send custom test email
- `GET /dev/email/status` - Get email service status

## Models

### BulkEmail

```typescript
interface BulkEmail {
  id: number;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  recipientCount: number;
  recipientType: 'all' | 'premium' | 'active' | 'custom';
  status: 'pending' | 'sending' | 'sent' | 'failed';
  successCount: number;
  failedCount: number;
  tags?: string;
  sentAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### Domain Events Published

- `email.sent` - Email successfully delivered with tracking information
- `email.failed` - Email delivery failed with error details
- `email.bulk.completed` - Bulk email campaign finished with statistics

### External Events Consumed

- `user.signUp` - Send welcome and verification email
- `user.resendVerification` - Resend email verification
- `user.emailVerified` - Send verification confirmation
- `user.forgotPassword` - Send password reset email
- `user.passwordChanged` - Send security alert
- `user.passwordReset` - Send password reset confirmation
- `user.emailChanged` - Send verification to new email and alert to old
- `user.signIn` - Send login alert (if suspicious activity)
- `user.deactivateAccount` - Send account deactivation notification
- `user.accountDeletion` - Send account deletion confirmation
- `user.reactivateAccount` - Send reactivation confirmation
- `achievement.added` - Send achievement notification
- `user.userCompletedPath` - Send path completion congratulations
- `learning.reminderDue` - Send learning reminder
- `user.weeklyProgress` - Send weekly progress report
- `system.maintenance` - Send maintenance notification to all users

## Business Rules

### Email Delivery Rules

- **Address Validation**: All recipients must have valid email addresses
- **Content Limits**: Subject line maximum 998 characters, attachment size limit 25MB
- **Retry Logic**: Maximum 3 retry attempts for failed emails with exponential backoff
- **User Preferences**: Respects user email notification preferences and opt-out settings
- **Rate Limiting**: Prevents spam by limiting email frequency per user

### Bulk Email Rules

- **Daily Limits**: Maximum 10 bulk email campaigns per day
- **Batch Processing**: 50 emails per batch with 2-second delay between batches
- **Approval Workflow**: Admin approval required for campaigns with >1000 recipients
- **Compliance**: Automatic unsubscribe link inclusion in all marketing emails
- **Segmentation**: Recipients can be filtered by status (all, premium, active, custom)

### Template Rules

- **Syntax Support**: Templates use Handlebars syntax with custom helpers
- **Variable Validation**: All template variables validated before rendering
- **Fallback System**: Fallback templates provided for missing or corrupted content
- **Categorization**: Templates categorized by type (auth, notification, marketing, system, transactional)

## Usage Examples

### Send Authentication Emails

```typescript
import { EmailAuthService } from "@domains/email";

const authService = Container.get(EmailAuthService);

// Send welcome email with verification
const result = await authService.sendWelcomeEmail(
  "user@example.com",
  "John Doe",
  "john_doe",
  "verification_token_123"
);

// Send password reset email
await authService.sendPasswordResetEmail(
  "user@example.com",
  "John Doe", 
  "reset_token_456",
  "192.168.1.1"
);

// Send security alert
await authService.sendSecurityAlert(
  "user@example.com",
  "John Doe",
  "password_change",
  {
    action: "Password changed",
    timestamp: new Date(),
    message: "Your password was successfully changed"
  }
);
```

### Send Notification Emails

```typescript
import { EmailNotificationService } from "@domains/email";

const notificationService = Container.get(EmailNotificationService);

// Send achievement notification
await notificationService.sendAchievementEmail(
  "user@example.com",
  "John Doe",
  {
    title: "First Login",
    description: "Welcome to the platform!",
    icon: "🏆"
  },
  "https://app.com/achievements"
);

// Send milestone completion
await notificationService.sendMilestoneCompletionEmail(
  "user@example.com",
  "John Doe",
  {
    title: "JavaScript Basics - Completed",
    pathTitle: "JavaScript Basics",
    completionPercentage: 100
  },
  "https://app.com/dashboard"
);

// Send weekly progress report
await notificationService.sendWeeklyProgressReport(
  "user@example.com", 
  "John Doe",
  {
    completedSessions: 5,
    totalMinutes: 150,
    streak: 7,
    completionRate: 85
  },
  [],
  "https://app.com/progress"
);
```

### Send Bulk Email Campaigns

```typescript
import { BulkEmailService } from "@domains/email";

const bulkService = Container.get(BulkEmailService);

// Create and send bulk email campaign
const result = await bulkService.sendBulkEmail(
  {
    subject: "New Features Available!",
    htmlContent: "<h1>Check out our new features</h1><p>We've added amazing new capabilities...</p>",
    textContent: "New Features Available! Check out our new features...",
    recipients: "premium",
    tags: ["feature-announcement", "premium-users"]
  },
  "admin@company.com"
);

if (result.success) {
  console.log("Bulk email campaign started:", result.data);
}
```

### Use Template System

```typescript
import { EmailTemplateService } from "@domains/email";

const templateService = Container.get(EmailTemplateService);

// Render template with variables
const rendered = await templateService.renderTemplate("welcome", {
  firstName: "John",
  appName: "MyApp",
  verificationUrl: "https://app.com/verify?token=abc123",
  supportEmail: "support@myapp.com"
});

// Get available templates
const templates = await templateService.getAvailableTemplates();

// Validate template before rendering
const validation = await templateService.validateTemplate("achievement", {
  title: "New Achievement",
  description: "You earned a badge!"
});
```

### Queue Management

```typescript
import { EmailQueueService } from "@domains/email";

const queueService = Container.get(EmailQueueService);

// Add email to queue with priority
await queueService.addEmailToQueue({
  to: "user@example.com",
  subject: "Urgent: Account Security Alert",
  html: "<p>Your account security needs attention</p>",
  priority: "urgent",
  retryAttempts: 3,
  scheduledAt: new Date(Date.now() + 3600000) // Send in 1 hour
});

// Get queue health status
const queueHealth = await queueService.getQueueHealth();
console.log("Queue status:", queueHealth);
```

## Configuration

### Domain Registration

```typescript
import { registerEmailDomain } from "@domains/email";

registerEmailDomain({
  userRepository: userRepo,
  configService: configService,
  eventDispatcher: eventDispatcher,
  redisClient: redisClient, // optional
  logger: logger, // optional
});
```

### Environment Variables

```bash
# Email Provider Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME="Your App Name"
EMAIL_FROM_ADDRESS=noreply@yourapp.com
EMAIL_SUPPORT_ADDRESS=support@yourapp.com

# SMTP Configuration (alternative)
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=smtp.mailgun.org
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_PASS=your-smtp-password

# Development Settings
EMAIL_DEV_MODE=production  # or 'ethereal', 'console'
SEND_DEV_EMAILS=false
NODE_ENV=production

# Queue Configuration (Redis)
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_EMAIL_QUEUE_DB=2

# Bulk Email Limits
BULK_EMAIL_BATCH_SIZE=50
BULK_EMAIL_DELAY_MS=2000
MAX_BULK_EMAILS_PER_DAY=10

# Application Configuration
APP_NAME="Your Application Name"
APP_FRONTEND_URL=https://app.yourapp.com
```

## Performance Considerations

### Caching Strategy

- **Template Compilation**: 1 hour (templates rarely change)
- **User Preferences**: 30 minutes (balance freshness with database load)
- **SMTP Connections**: Connection pooling with 10-minute timeout
- **Queue Metrics**: 5 minutes (frequent monitoring needed)

### Database Optimization

- **Primary Indexes**: status, created_by, sent_at, created_at
- **Composite Queries**: Optimized for bulk email dashboard and analytics
- **Cleanup Jobs**: Automated cleanup of old bulk email records
- **Connection Pooling**: SMTP connection reuse for batch processing

### Queue Processing

- **Async Processing**: All email delivery happens asynchronously
- **Batch Processing**: 50 emails per batch with configurable delays
- **Retry Logic**: Exponential backoff with maximum 3 attempts
- **Priority Queues**: Urgent emails processed first

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=email/services
npm test -- --testPathPattern=email/controllers
npm test -- --testPathPattern=email/validators
```

### Integration Tests

```bash
npm run test:integration -- email
npm run test:events -- email
npm run test:api -- email
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

### Development Email Testing

```bash
# Send test emails in development
curl -X POST http://localhost:3000/dev/email/test/simple \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test Email"}'

# Test template rendering
curl -X POST http://localhost:3000/dev/email/test/template \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"templateType":"welcome","templateData":{"firstName":"John"}}'
```

## Monitoring & Alerting

### Key Metrics

- **Email Delivery Rate**: Percentage of successfully delivered emails
- **Queue Processing Time**: Average time emails spend in queue
- **Template Rendering Performance**: Template compilation and rendering speed
- **Bulk Campaign Success**: Campaign completion rates and statistics
- **SMTP Connection Health**: Provider connectivity and authentication status

### Alerts

- **High Failure Rate**: >5% email delivery failures in 1 hour
- **Queue Delays**: Emails in queue >5 minutes without processing
- **SMTP Connection Issues**: Authentication or connectivity failures
- **Bulk Campaign Failures**: Campaign completion rate <90%
- **Template Errors**: Template compilation or rendering failures

## Security

### Data Protection

- **Email Address Validation**: Strict validation to prevent injection attacks
- **Template Security**: Handlebars templates with XSS protection
- **SMTP Security**: TLS/SSL encryption for email transmission
- **Access Control**: Admin-only access to bulk email capabilities
- **Rate Limiting**: Protection against email spam and abuse

### Compliance Features

- **Unsubscribe Links**: Automatic inclusion in marketing emails
- **User Preferences**: Respect for email notification settings
- **Data Retention**: Configurable retention policies for email logs
- **Audit Trail**: Complete logging of all email operations

## Support

For issues related to the email domain:

1. Check email service health at `/admin/health/email`
2. Review email queue status and processing logs
3. Verify SMTP configuration and credentials
4. Check Redis connectivity for queue operations
5. Validate template syntax and variable data
6. Test with development email endpoints
7. Review user email preferences and opt-out status

For emergency issues:

- Use admin endpoints for critical email operations
- Check system health and queue processing status
- Verify external email provider service status
- Contact on-call engineer for service disruptions
- Review email delivery logs for pattern analysis
