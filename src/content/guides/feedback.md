# Feedback Domain

> User feedback collection and management system for platform improvement

## Overview

The Feedback domain handles user feedback submission, admin management, and feedback resolution workflow. It provides a comprehensive system for collecting bug reports, feature requests, and general user feedback with priority-based triage and admin response capabilities.

## Domain Boundaries

### Responsibilities

- ✅ **Feedback Submission**: User-generated feedback collection with type categorization
- ✅ **Admin Management**: Admin feedback review, status updates, and response handling
- ✅ **Priority Triage**: Automatic priority-based routing and urgent feedback alerting
- ✅ **Status Tracking**: Full lifecycle management from open to resolution
- ✅ **User Notifications**: Automated notifications for feedback status updates
- ✅ **Analytics Integration**: Metrics tracking and performance monitoring

### External Dependencies

- **User Management**: User data access and validation
- **Notifications**: Email and push notification delivery
- **Event System**: Domain event publishing and consumption

## Architecture

```
src/domains/feedback/
├── controllers/              # HTTP request handlers
│   ├── admin-feedback.controller.ts
│   ├── user-feedback.controller.ts
│   └── submission.controller.ts
├── services/                # Business logic
│   ├── feedback-submission.service.ts
│   ├── feedback-retrieval.service.ts
│   └── feedback-management.service.ts
├── models/                  # Data models
│   ├── feedback.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/            # Event handlers
│   └── feedback.subscriber.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   ├── feedback.validators.ts
│   └── index.ts
├── feedback.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### User Feedback Management

- `GET /feedback/user` - List user's feedback with filtering
- `POST /feedback` - Submit new feedback
- `GET /feedback/:id` - Get specific feedback details
- `PUT /feedback/:id/priority` - Update feedback priority (user)

### Admin Feedback Operations

- `GET /feedback/admin` - List all feedback with admin filtering
- `PUT /feedback/:id/status` - Update feedback status and add admin response
- `GET /feedback/admin/metrics` - Get feedback analytics and metrics
- `POST /feedback/admin/bulk-update` - Bulk status updates

### Submission Operations

- `POST /feedback/submit` - Alternative submission endpoint
- `GET /feedback/types` - Get available feedback types
- `GET /feedback/categories` - Get available categories

## Models

### Feedback

```typescript
interface Feedback {
  id: number;
  userId: number;
  type: 'bug' | 'feature_request' | 'general' | 'ui_ux' | 'performance' | 'content';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'duplicate';
  category?: string;
  userAgent?: string;
  url?: string;
  deviceInfo?: any;
  adminResponse?: string;
  adminUserId?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### Domain Events Published

- `feedback.created` - New feedback submitted
- `feedback.statusUpdated` - Feedback status changed by admin
- `feedback.urgent.created` - Urgent priority feedback submitted
- `feedback.resolved` - Feedback marked as resolved

### External Events Consumed

- `user-management.user.deleted` - Handle user deletion cleanup
- `notifications.delivery.failed` - Handle notification failures

## Business Rules

### Feedback Submission Rules

- **Type Validation**: Only allows predefined feedback types (bug, feature_request, general, ui_ux, performance, content)
- **Priority Assignment**: Defaults to 'medium' priority, can be escalated to urgent
- **Anonymous Feedback**: Allows feedback submission without user authentication (userId nullable)
- **Content Requirements**: Subject limited to 200 characters, description required

### Admin Management Rules

- **Status Progression**: Open → In Progress → Resolved/Closed/Duplicate
- **Admin Response**: Required when resolving feedback
- **Audit Trail**: All status changes logged with admin user tracking

### Notification Rules

- **User Notifications**: Sent when feedback status changes to resolved
- **Urgent Alerts**: Immediate admin notifications for urgent priority feedback
- **Email Integration**: Uses user email preferences for notification delivery

## Usage Examples

### Submit User Feedback

```typescript
import { FeedbackSubmissionService } from "@domains/feedback";

const submissionService = Container.get(FeedbackSubmissionService);
const result = await submissionService.submitFeedback(userId, {
  type: "bug",
  subject: "Login page not loading",
  description: "The login page shows a blank screen on mobile devices",
  priority: "high",
  category: "authentication",
  userAgent: req.headers['user-agent'],
  url: "https://app.example.com/login"
});

if (result.success) {
  console.log("Feedback submitted:", result.data);
}
```

### Admin Feedback Management

```typescript
import { FeedbackManagementService } from "@domains/feedback";

const managementService = Container.get(FeedbackManagementService);

// Update feedback status with admin response
const result = await managementService.updateFeedbackStatus(
  feedbackId,
  adminUserId,
  {
    status: "resolved",
    adminResponse: "Fixed in version 2.1.0 - the mobile login page has been optimized and should now load properly."
  }
);

// This automatically:
// - Updates feedback status in database
// - Dispatches feedback.statusUpdated event
// - Triggers user notification
// - Updates admin performance metrics
```

### Retrieve Feedback with Filters

```typescript
import { FeedbackRetrievalService } from "@domains/feedback";

const retrievalService = Container.get(FeedbackRetrievalService);

// Get admin dashboard data
const adminFeedback = await retrievalService.getAdminFeedback({
  status: "open",
  priority: "urgent",
  type: "bug",
  page: 1,
  limit: 20
});
```

## Configuration

### Domain Registration

```typescript
import { registerFeedbackDomain } from "@domains/feedback";

registerFeedbackDomain({
  userRepository: userRepo,
  eventDispatcher: eventBus,
  notificationService: notificationService, // optional
});
```

### Environment Variables

```bash
# Feedback Configuration
FEEDBACK_URGENT_THRESHOLD=high
FEEDBACK_AUTO_CLOSE_DAYS=30
FEEDBACK_MAX_DESCRIPTION_LENGTH=5000
FEEDBACK_ADMIN_EMAIL_ENABLED=true

# Notification Configuration
FEEDBACK_USER_NOTIFICATIONS=true
FEEDBACK_ADMIN_NOTIFICATIONS=true
FEEDBACK_EMAIL_TEMPLATES_PATH=/templates/feedback

# Analytics Configuration
FEEDBACK_METRICS_ENABLED=true
FEEDBACK_RETENTION_DAYS=365
FEEDBACK_EXPORT_ENABLED=true
```

## Performance Considerations

### Caching Strategy

- **Feedback Types**: 1 hour (rarely change, improve form loading)
- **Admin Metrics**: 15 minutes (balance freshness with query cost)
- **User Feedback Lists**: 5 minutes (frequent updates expected)

### Database Optimization

- **Primary Indexes**: user_id, status, type, priority, created_at, admin_user_id
- **Composite Indexes**: (status, priority) for admin filtering, (type, status) for analytics
- **Query Optimization**: Scoped queries for common filters (open, resolved, urgent)

### Event Processing

- **Async Processing**: All notification sending and metrics updates
- **Event Batching**: Admin notification emails batched every 5 minutes
- **Retry Logic**: 3 attempts for notification delivery with exponential backoff

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=feedback/services
npm test -- --testPathPattern=feedback/controllers
npm test -- --testPathPattern=feedback/validators
```

### Integration Tests

```bash
npm run test:integration -- feedback
npm run test:events -- feedback
npm run test:api -- feedback
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage  
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Submission Rate**: New feedback per hour/day
- **Resolution Time**: Average time from open to resolved
- **Admin Response Rate**: Percentage of feedback with admin responses
- **Urgent Feedback Count**: Critical priority items requiring immediate attention

### Alerts

- **High Urgent Volume**: >10 urgent feedback items in 1 hour
- **Long Resolution Time**: Feedback open >7 days without admin response
- **Failed Notifications**: >5% notification delivery failures
- **Database Performance**: Query response time >200ms

## Security

### Data Protection

- **Input Sanitization**: All feedback content sanitized to prevent XSS
- **Admin Authorization**: Only admin users can update feedback status
- **User Privacy**: Optional anonymous feedback submission
- **Data Retention**: Automatic cleanup of old feedback based on retention policy

## Support

For issues related to the feedback domain:

1. Check logs in `/var/log/app/combined.log`
2. Review feedback metrics in admin dashboard
3. Verify notification service connectivity
4. Check database indexes for performance issues
5. Validate event dispatcher configuration
6. Test with isolated feedback scenarios

For emergency issues:

- Use admin endpoints for critical feedback management
- Check system health at `/admin/health/feedback`
- Review urgent feedback queue for service disruptions
- Contact on-call engineer for critical user-facing issues
