# Admin Activity Logging Domain

> Comprehensive admin activity logging, security monitoring, and audit compliance system

## Overview

The Admin Activity Logging domain provides comprehensive logging, monitoring, and audit capabilities for administrative activities and user actions across the platform. It implements sophisticated security monitoring with suspicious pattern detection, real-time alerting, and full compliance audit trails. The domain ensures complete accountability and traceability for all administrative operations while maintaining high performance through intelligent batching and caching strategies.

## Domain Boundaries

### Responsibilities

- ✅ **Admin Activity Logging**: Complete audit trail of all administrative actions with risk assessment
- ✅ **User Activity Tracking**: Comprehensive logging of user actions across all platform features
- ✅ **Security Monitoring**: Real-time detection of suspicious patterns and security violations
- ✅ **Risk Assessment**: Automated risk analysis and categorization for all admin actions
- ✅ **Rate Limiting**: Protection against administrative abuse through configurable rate limits
- ✅ **Audit Compliance**: Full compliance reporting and audit trail generation
- ✅ **Batch Processing**: High-performance logging with intelligent batching and async processing
- ✅ **Dashboard Analytics**: Real-time admin dashboard with security metrics and alerts

### External Dependencies

- **User Management**: User profile data and role validation
- **Notifications**: Security alerts and admin notifications
- **Cache Service**: Rate limiting and performance optimization
- **Configuration Service**: Dynamic configuration and security thresholds
- **Event System**: Cross-domain event publishing and consumption

## Architecture

```
src/domains/admin-activity-logging/
├── controllers/                           # HTTP request handlers
│   ├── admin-activity-log.controller.ts
│   ├── security-monitoring.controller.ts
│   ├── audit-compliance.controller.ts
│   └── index.ts
├── services/                             # Business logic
│   ├── activity-logger.service.ts
│   ├── admin-dashboard.service.ts
│   ├── log-cleanup.service.ts
│   └── index.ts
├── models/                              # Data models
│   ├── admin-activity-log.model.ts
│   ├── user-activity-log.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/                         # Event handlers
│   ├── analytics-activity.subscriber.ts
│   └── index.ts
├── interfaces/                         # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── admin-activity-logging.domain.ts   # Domain registration
└── index.ts                          # Public API
```

## API Endpoints

### Admin Activity Log Management

- `GET /admin/activity-logs` - List admin activity logs with advanced filtering
- `GET /admin/activity-logs/:id` - Get specific activity log details
- `POST /admin/activity-logs/query` - Advanced query with complex filters
- `PUT /admin/activity-logs/:id/review` - Mark activity as reviewed
- `POST /admin/activity-logs/batch` - Batch log multiple activities
- `GET /admin/activity-logs/export` - Export activity logs for compliance

### Security Monitoring

- `GET /admin/security/dashboard` - Security monitoring dashboard
- `GET /admin/security/suspicious-patterns` - Detected suspicious activity patterns
- `GET /admin/security/rate-limits` - Current rate limiting status
- `POST /admin/security/investigate` - Initiate security investigation
- `GET /admin/security/alerts` - Active security alerts and notifications

### Audit Compliance

- `GET /admin/activity-logs/analytics` - Activity analytics and metrics
- `POST /admin/activity-logs/cleanup` - Manual cleanup of old logs
- `GET /admin/activity-logs/compliance-report` - Generate compliance reports
- `GET /admin/activity-logs/health` - System health and performance metrics

## Models

### AdminActivityLog

```typescript
interface AdminActivityLog {
  id: number;
  adminUserId: number;
  targetUserId?: number;
  actionType: string;
  actionCategory: 'user_management' | 'content_moderation' | 'system_admin' | 'data_export' | 'data_import' | 'security';
  actionDescription: string;
  targetEntityType?: string;
  targetEntityId?: number;
  beforeState?: any;
  afterState?: any;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresReview: boolean;
  reviewedBy?: number;
  reviewedAt?: Date;
  reviewNotes?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Model Methods:**
- `markAsReviewed(reviewerId, notes?)` - Mark activity as reviewed by admin
- `getSecurityScore()` - Calculate security risk score (0-100)
- `isHighRisk()` - Check if activity is considered high risk

### UserActivityLog

```typescript
interface UserActivityLog {
  id: number;
  userId: number;
  actionType: string;
  actionCategory: 'profile' | 'preferences' | 'devices' | 'content' | 'social' | 'learning' | 'billing';
  description: string;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: any;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### External Events Consumed

The admin-activity-logging domain subscribes to analytics events for audit trail purposes:

#### Analytics Domain Events
- `analytics.activity.tracked` - Creates audit trail of user activity tracking
- `gamification.streak.updated` - Logs cross-domain interactions from analytics
- `analytics.domain.initialized` - Tracks analytics system lifecycle events

### Domain Events Published

- `admin.activityLogged` - Admin activity successfully logged with risk assessment
- `suspiciousPattern.detected` - Suspicious activity pattern identified
- `securityEvent.detected` - Security event requiring immediate attention
- `logs.cleanupCompleted` - Log cleanup operation finished

### Event Payloads

```typescript
// Admin Activity Logged Event
{
  logId: number;
  adminUserId: number;
  actionType: string;
  success: boolean;
  riskLevel: string;
  requiresReview: boolean;
  loggedAt: Date;
}

// Suspicious Pattern Detection Event
{
  pattern: ISuspiciousPattern;
  adminUserId: number;
  detectedAt: Date;
  autoBlocked: boolean;
  requiresInvestigation: boolean;
}

// Security Event
{
  eventType: 'failed_login' | 'suspicious_activity' | 'privilege_escalation' | 'data_breach_attempt';
  adminUserId?: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: any;
  context: IRequestContext;
  autoBlocked: boolean;
}
```

## Business Rules

### Admin Activity Logging Rules

- **Complete Audit Trail**: All admin actions logged with full context and metadata
- **Risk Assessment**: Automated risk level calculation for all admin activities
- **Review Requirements**: High-risk and critical actions automatically marked for review
- **Rate Limiting**: Configurable rate limits per admin user and action type
- **Batch Processing**: High-volume logging through intelligent batching (100 entries per batch)
- **Immutable Records**: Activity logs cannot be modified once created (audit integrity)

### Security Monitoring Rules

- **Pattern Detection**: Real-time analysis for suspicious activity patterns
- **Automatic Alerting**: Immediate notifications for high-risk and critical activities
- **IP Tracking**: IP address logging and geo-location analysis for security monitoring
- **Session Correlation**: Session tracking across multiple admin actions
- **Failed Action Analysis**: Enhanced monitoring and alerting for failed admin actions

### Compliance and Retention Rules

- **Data Retention**: Configurable retention periods with automated cleanup
- **Archive Support**: Optional archiving before deletion for long-term compliance
- **Audit Reports**: Automated compliance report generation with checksums
- **Access Controls**: Strict access controls for audit log viewing and management
- **Export Capabilities**: Full audit trail export for regulatory compliance

## Usage Examples

### Log Admin Activity

```typescript
import { ActivityLoggerService } from "@domains/admin-activity-logging";

const loggerService = Container.get(ActivityLoggerService);

// Log admin action with automatic risk assessment
const result = await loggerService.logAdminActivity({
  adminUserId: 123,
  targetUserId: 456,
  actionType: "user_ban",
  actionCategory: "user_management",
  actionDescription: "Banned user for violating community guidelines",
  targetEntityType: "User",
  targetEntityId: 456,
  beforeState: { status: "active", banReason: null },
  afterState: { status: "banned", banReason: "Community guidelines violation" },
  success: true,
  context: {
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    sessionId: "session_abc123",
    requestId: "req_xyz789"
  },
  metadata: {
    banDuration: "30 days",
    violationType: "spam",
    reportCount: 5
  }
});

if (result.success) {
  console.log("Admin activity logged:", result.data.logId);
  // Automatic risk assessment, pattern detection, and alerting handled
}
```

### Log User Activity

```typescript
import { ActivityLoggerService } from "@domains/admin-activity-logging";

const loggerService = Container.get(ActivityLoggerService);

// Log user action for audit trail
const result = await loggerService.logUserActivity({
  userId: 456,
  actionType: "profile_update",
  actionCategory: "profile",
  description: "User updated profile information",
  success: true,
  context: {
    ipAddress: "10.0.0.50",
    userAgent: "Mozilla/5.0...",
    sessionId: "user_session_def456"
  },
  metadata: {
    fieldsUpdated: ["firstName", "lastName", "bio"],
    previousValues: { firstName: "John", lastName: "Doe" },
    newValues: { firstName: "Jane", lastName: "Smith" }
  }
});
```

### Batch Log Multiple Activities

```typescript
import { ActivityLoggerService } from "@domains/admin-activity-logging";

const loggerService = Container.get(ActivityLoggerService);

// Batch log for high-performance bulk operations
const entries = [
  {
    adminUserId: 123,
    actionType: "bulk_user_update",
    actionCategory: "user_management",
    actionDescription: "Updated user status in bulk",
    success: true
  },
  // ... more entries
];

const result = await loggerService.batchLogAdminActivities(entries);

console.log(`Processed: ${result.processedCount}, Failed: ${result.failedCount}`);
if (result.errors.length > 0) {
  console.log("Batch errors:", result.errors);
}
```

### Query Activity Logs

```typescript
import { ActivityLoggerService } from "@domains/admin-activity-logging";

const loggerService = Container.get(ActivityLoggerService);

// Advanced querying with filtering and pagination
const result = await loggerService.queryAdminActivityLogs({
  adminUserId: 123,
  actionCategory: "user_management",
  riskLevel: "high",
  requiresReview: true,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  page: 1,
  limit: 50,
  sortBy: "createdAt",
  sortOrder: "desc"
});

if (result.success) {
  const { items, pagination } = result.data;
  console.log(`Found ${pagination.totalItems} activities`);
  console.log("High-risk activities:", items);
}
```

## Configuration

### Domain Registration

```typescript
import { registerAdminActivityLoggingDomain } from "@domains/admin-activity-logging";

registerAdminActivityLoggingDomain({
  adminActivityLogRepository: adminLogRepo,
  userActivityLogRepository: userLogRepo,
  userRepository: userRepo,
  eventDispatcher: eventDispatcher,
  cacheService: cacheService,
  notificationService: notificationService,
  configService: configService,
});
```

### Environment Variables

```bash
# Logging Configuration
ADMIN_LOGGING_ENABLED=true
ADMIN_LOGGING_BATCH_SIZE=100
ADMIN_LOGGING_BATCH_TIMEOUT=5000

# Security Monitoring
SECURITY_MONITORING_ENABLED=true
SUSPICIOUS_PATTERN_DETECTION=true
AUTOMATIC_ALERTING=true

# Rate Limiting
ADMIN_RATE_LIMIT_WINDOW=60000
MAX_ACTIONS_PER_MINUTE=100
STRICT_RATE_LIMITS=true

# Retention and Cleanup
LOG_RETENTION_DAYS=365
AUTO_CLEANUP_ENABLED=true
ARCHIVE_BEFORE_DELETE=true
COMPRESSION_ENABLED=true

# Performance Configuration
CACHE_TTL_SECONDS=300
DB_CONNECTION_POOL_SIZE=20
QUERY_TIMEOUT_MS=10000
```

## Performance Considerations

### Caching Strategy

- **Rate Limits**: 5-minute cache for rate limiting counters
- **Security Patterns**: 5-minute cache for detected suspicious patterns
- **Query Results**: 15-minute cache for frequently accessed log queries
- **Dashboard Metrics**: 10-minute cache for admin dashboard data

### Database Optimization

- **Comprehensive Indexing**: 15+ strategic indexes for optimal query performance
- **Partial Indexes**: Specialized indexes for failed actions and review requirements
- **Composite Indexes**: Multi-column indexes for common query patterns
- **Query Scopes**: Pre-defined scopes for frequent operations (recent, failed, highRisk)

### Batch Processing

- **Intelligent Batching**: Automatic batching of 100 entries with 5-second timeout
- **Async Processing**: All logging operations happen asynchronously
- **Error Isolation**: Failed batch entries don't affect successful ones
- **Performance Monitoring**: Built-in performance metrics and monitoring

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=admin-activity-logging/services
npm test -- --testPathPattern=admin-activity-logging/controllers
npm test -- --testPathPattern=admin-activity-logging/subscribers
```

### Integration Tests

```bash
npm run test:integration -- admin-activity-logging
npm run test:events -- admin-activity-logging
npm run test:security -- admin-activity-logging
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Subscribers: 95%+ coverage (event handling critical)
- Models: 90%+ coverage (complex business logic in models)

### Security Testing

```bash
# Test suspicious pattern detection
npm run test:security:patterns -- admin-activity-logging

# Test rate limiting functionality
npm run test:security:rate-limits -- admin-activity-logging

# Test audit compliance features
npm run test:compliance -- admin-activity-logging
```

## Monitoring & Alerting

### Key Metrics

- **Logging Performance**: Log creation time and batch processing efficiency
- **Security Events**: Suspicious pattern detection rate and security violation frequency
- **System Health**: Database performance, cache hit rates, and error rates
- **Admin Activity Volume**: Daily/hourly admin activity trends and patterns
- **Compliance Metrics**: Audit trail completeness and retention compliance

### Alerts

- **High-Risk Activity**: Immediate alerts for critical and high-risk admin actions
- **Suspicious Patterns**: Real-time alerts for detected suspicious activity patterns
- **System Performance**: Alerts for logging delays >500ms or batch processing failures
- **Security Violations**: Immediate escalation for potential security breaches
- **Compliance Issues**: Alerts for audit trail gaps or retention policy violations

### Dashboards

- **Security Dashboard**: Real-time security monitoring with pattern detection and alerts
- **Admin Activity Overview**: Admin activity trends, risk distribution, and performance metrics
- **Compliance Dashboard**: Audit trail health, retention status, and compliance reports
- **System Performance**: Logging performance, database health, and cache statistics

## Security

### Data Protection

- **Audit Integrity**: Immutable log records with tamper detection
- **Access Controls**: Strict role-based access for log viewing and management
- **Data Encryption**: Optional encryption for sensitive log data and archives
- **Secure Transport**: All log data transmitted over encrypted connections
- **Privacy Protection**: PII scrubbing and anonymization options

### Security Monitoring

- **Real-Time Detection**: Immediate suspicious pattern detection and alerting
- **Behavioral Analysis**: Advanced pattern recognition for admin behavior anomalies
- **Risk Assessment**: Automated risk scoring for all administrative actions
- **Threat Intelligence**: Integration with security threat detection systems
- **Incident Response**: Automated response to critical security events

## Support

For issues related to the admin-activity-logging domain:

1. Check system health at `/admin/activity-logs/health`
2. Review security dashboard for suspicious patterns and alerts
3. Verify database performance and index usage for log queries
4. Check cache performance and rate limiting functionality
5. Validate event subscription health and cross-domain logging
6. Monitor batch processing efficiency and error rates
7. Verify compliance report generation and audit trail integrity

For emergency issues:

- Review security alerts at `/admin/security/alerts`
- Check suspicious pattern detection at `/admin/security/suspicious-patterns`
- Monitor real-time admin activity dashboard
- Verify audit trail completeness and integrity
- Contact security team for critical security events
- Escalate to on-call engineer for system-wide logging failures