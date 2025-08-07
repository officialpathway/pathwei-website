# Analytics Domain

> User activity tracking, heatmap generation, and engagement analytics

## Overview

The Analytics domain tracks user activity patterns, generates visual heatmaps, and provides engagement analytics for the platform. It captures user interactions across the system and transforms them into actionable insights for both users (activity visualization) and administrators (engagement metrics). The domain focuses on activity tracking, streak calculations, and milestone completion analytics.

## Domain Boundaries

### Responsibilities

- ✅ **Activity Tracking**: Real-time user activity recording across all platform interactions
- ✅ **Heatmap Generation**: Visual activity calendars showing user engagement patterns
- ✅ **Engagement Analytics**: Statistical analysis of user activity and milestone completion
- ✅ **Streak Calculations**: Daily activity streak tracking and historical analysis
- ✅ **Cross-Domain Events**: Publishing activity events for gamification and admin systems
- ✅ **Performance Metrics**: Activity intensity levels and engagement scoring

### External Dependencies

- **User Management**: User profile data and daily streak information
- **Learning Content**: Milestone completion and path enrollment tracking
- **Authentication**: Login and session validation events
- **Event System**: Cross-domain event dispatching for activity notifications

## Architecture

```
src/domains/analytics/
├── controllers/              # HTTP request handlers
│   ├── user-activity.controller.ts
│   ├── feedback-analytics.controller.ts
│   └── index.ts
├── services/                # Business logic
│   ├── user-activity.service.ts
│   ├── feedback-analytics.service.ts
│   └── index.ts
├── models/                  # Data models
│   ├── user-activity-heatmap.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/            # Event handlers
│   ├── user-activity.subscriber.ts
│   └── index.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── analytics.domain.ts    # Domain registration
└── index.ts              # Public API
```

## External Events Consumed

The analytics domain subscribes to events from multiple domains to track user activity:

### Authentication Domain Events
- `authentication.user.signIn` - Tracks user login activity (password-based login)
- `authentication.user.sessionValidated` - Tracks session validation as login activity
- `authentication.user.signUp` - Records initial registration activity

### Learning Content Domain Events
- `learning-content.milestone.completed` - Tracks milestone completion with milestone increment
- `learning-content.path.enrolled` - Tracks learning path enrollment activity

### User Management Domain Events
- `user-management.user.profileUpdated` - Tracks profile update engagement

## API Endpoints

### User Activity Analytics

- `GET /analytics/activity/heatmap/:userId` - Get user's activity heatmap for date range
- `GET /analytics/activity/calendar/:userId` - Get user's yearly activity calendar
- `GET /analytics/activity/stats/:userId` - Get comprehensive activity statistics
- `POST /analytics/activity/update` - Manual activity update (admin/testing)

### Feedback Analytics

- `GET /analytics/feedback/stats` - Get feedback analytics and trends
- `GET /analytics/feedback/summary` - Get feedback summary metrics

## Models

### UserActivityHeatmap

```typescript
interface UserActivityHeatmap {
  id: number;
  userId: number;
  activityCount: number;
  activityDate: Date;
  milestonesCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Model Methods:**
- `findByUserAndDateRange(userId, startDate, endDate)` - Get activities for date range
- `findOrCreateToday(userId, date?)` - Find or create today's activity record
- `incrementActivity()` - Increment activity count
- `incrementMilestones()` - Increment milestone count
- `getIntensityLevel()` - Get activity intensity level (0-4)

## Events

### External Events Consumed

The analytics domain subscribes to events from multiple domains to track user activity:

#### Authentication Domain Events
- `authentication.user.signIn` - Tracks user login activity (password-based login)
- `authentication.user.sessionValidated` - Tracks session validation as login activity
- `authentication.user.signUp` - Records initial registration activity

#### Learning Content Domain Events
- `learning-content.milestone.completed` - Tracks milestone completion with milestone increment
- `learning-content.path.enrolled` - Tracks learning path enrollment activity

#### User Management Domain Events
- `user-management.user.profileUpdated` - Tracks profile update engagement

### Domain Events Published

- `analytics.activity.recorded` - Activity successfully recorded with details
- `analytics.activity.newDayLogin` - New day login detected (for gamification)
- `analytics.activity.tracked` - Generic activity tracking event (for admin logging)
- `analytics.activity.streak_updated` - Activity streak calculation completed
- `analytics.activity.milestone_tracked` - Milestone activity recorded

### Event Payloads

```typescript
// Activity Recorded Event
{
  userId: number;
  activityDate: string;
  activityType: ACTIVITY_TYPE;
  newActivityCount: number;
  milestonesCompleted: number;
  isNewDay: boolean;
  updatedAt: Date;
}

// New Day Login Event (for gamification)
{
  userId: number;
  activityDate: string;
  isConsecutiveDay: boolean;
  timestamp: Date;
}

// Activity Tracking Event (for admin logging)
{
  userId: number;
  activityType: string;
  activityDate: string;
  isNewDay: boolean;
  domain: "analytics";
  action: "activity_recorded";
  timestamp: Date;
}
```

## Activity Types

The system tracks the following activity types:

```typescript
type ACTIVITY_TYPE = 
  | "login"                 // User authentication login
  | "milestone_completed"   // Learning milestone completion
  | "path_started"         // Learning path initiation
  | "path_enrolled"        // Learning path enrollment
  | "profile_updated"      // User profile modifications
  | "registration"         // Initial user registration
  | "session_validation"   // Session token validation
  | "password_login";      // Password-based authentication
```

## Business Rules

### Activity Recording Rules

- **Unique Daily Records**: One activity record per user per day (unique constraint)
- **Activity Accumulation**: Multiple activities on same day increment counters
- **Milestone Tracking**: Only specific events increment milestone counters
- **Automatic Creation**: Activity records auto-created when first activity occurs
- **Date Normalization**: All activities normalized to date-only format (YYYY-MM-DD)

### Intensity Level Calculation

- **Level 0**: No activity (0 activities)
- **Level 1**: Light activity (1-2 activities)
- **Level 2**: Moderate activity (3-5 activities)
- **Level 3**: High activity (6-10 activities)  
- **Level 4**: Peak activity (11+ activities)

### Event Processing Rules

- **Asynchronous Processing**: All activity tracking happens asynchronously
- **Error Resilience**: Failed activity tracking doesn't break originating operations
- **Cross-Domain Publishing**: Activity events published for gamification and admin systems
- **Validation**: User existence validated before activity recording

## Usage Examples

### Track User Activity

```typescript
import { UserActivityService } from "@domains/analytics";

const activityService = Container.get(UserActivityService);

// Record user activity
const result = await activityService.updateActivity({
  userId: 123,
  activityType: "milestone_completed",
  date: new Date(),
  incrementMilestones: true
});

if (result.success) {
  console.log("Activity recorded:", result.data);
  // Output: { activityCount: 3, milestonesCompleted: 1, isNewDay: false }
}
```

### Get Activity Heatmap

```typescript
import { UserActivityService } from "@domains/analytics";

const activityService = Container.get(UserActivityService);

// Get activity heatmap for date range
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-12-31');

const heatmapResult = await activityService.getActivityHeatmap(123, startDate, endDate);

if (heatmapResult.success) {
  const { calendar, stats, streakInfo } = heatmapResult.data;
  
  console.log("Activity Calendar:", calendar);
  // Array of { date, activityCount, milestonesCompleted, level }
  
  console.log("Activity Stats:", stats);
  // { totalDays, activeDays, averageActivity, peakActivity, totalMilestones }
  
  console.log("Streak Info:", streakInfo);
  // { current: 7, longest: 23 }
}
```

### Get Yearly Activity Calendar

```typescript
import { UserActivityService } from "@domains/analytics";

const activityService = Container.get(UserActivityService);

// Get current year activity calendar
const calendarResult = await activityService.getUserActivityCalendar(123);

if (calendarResult.success) {
  const { userId, activities, currentStreak, totalActiveDays } = calendarResult.data;
  
  console.log(`User ${userId} has ${totalActiveDays} active days this year`);
  console.log(`Current streak: ${currentStreak} days`);
  console.log("Activity data:", activities);
}
```

## Configuration

### Domain Registration

```typescript
import { registerAnalyticsDomain } from "@domains/analytics";

registerAnalyticsDomain({
  userActivityHeatmapRepository: heatmapRepo,
  userRepository: userRepo,
  eventDispatcher: eventDispatcher,
  logger: logger,
});
```

### Environment Variables

```bash
# Analytics Configuration
ANALYTICS_ENABLED=true
ANALYTICS_BATCH_SIZE=100
ANALYTICS_CLEANUP_DAYS=365

# Heatmap Configuration
HEATMAP_CACHE_TTL=3600
HEATMAP_MAX_RANGE_DAYS=365

# Activity Tracking
ACTIVITY_TRACK_SESSIONS=true
ACTIVITY_TRACK_MILESTONES=true
ACTIVITY_ASYNC_PROCESSING=true

# Performance Configuration  
ANALYTICS_DB_POOL_SIZE=10
ANALYTICS_QUERY_TIMEOUT=5000
```

## Performance Considerations

### Caching Strategy

- **Activity Heatmaps**: 1 hour cache (frequent user dashboard access)
- **Activity Stats**: 30 minutes cache (balance freshness with performance)
- **User Calendar**: 2 hours cache (less frequent access, expensive computation)
- **Intensity Calculations**: In-memory caching (lightweight computation)

### Database Optimization

- **Composite Index**: (user_id, activity_date) for unique constraint and fast lookups
- **Date Index**: activity_date for range queries and analytics
- **Query Optimization**: Minimal data selection, efficient date range queries
- **Batch Processing**: Bulk activity updates for high-volume periods

### Event Processing

- **Asynchronous Processing**: All event handling happens asynchronously
- **Error Isolation**: Failed activity tracking doesn't affect source operations
- **Rate Limiting**: Event processing throttled to prevent database overload
- **Batch Updates**: Multiple activities for same user/day batched when possible

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=analytics/services
npm test -- --testPathPattern=analytics/controllers
npm test -- --testPathPattern=analytics/subscribers
```

### Integration Tests

```bash
npm run test:integration -- analytics
npm run test:events -- analytics
npm run test:api -- analytics
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Subscribers: 95%+ coverage (event handling critical)
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Activity Recording Rate**: Events processed per minute/hour
- **Event Processing Latency**: Time from event trigger to activity recorded
- **Database Query Performance**: Activity lookup and heatmap generation times
- **Cache Hit Rates**: Heatmap and stats cache effectiveness
- **Error Rates**: Failed activity recordings and event processing failures

### Alerts

- **High Event Processing Latency**: >500ms average processing time
- **Activity Recording Failures**: >1% failure rate for activity updates
- **Database Performance Issues**: Query time >200ms for heatmap generation
- **Event Subscription Failures**: Missing or failed event subscriptions
- **Cache Performance**: Cache hit rate <80% for frequently accessed data

## Security

### Data Protection

- **User Privacy**: Activity data tied to user IDs only, no PII stored
- **Data Retention**: Configurable retention policy for historical activity
- **Access Control**: User can only access own activity data
- **Anonymous Analytics**: Aggregate statistics don't expose individual user data

### Event Security

- **Event Validation**: All incoming events validated for required fields
- **User Verification**: User existence verified before activity recording
- **Rate Limiting**: Event processing rate limited to prevent abuse
- **Error Handling**: Sensitive error details not exposed in responses

## Support

For issues related to the analytics domain:

1. Check event subscription health and processing logs
2. Verify user activity data integrity and date consistency
3. Review database performance and index usage
4. Validate cross-domain event publishing and consumption
5. Check cache performance and hit rates
6. Monitor activity recording success rates
7. Verify heatmap generation and calendar API responses

For emergency issues:

- Check system health at `/admin/health/analytics`
- Review event processing queue and backlogs
- Verify database connectivity and performance
- Monitor cross-domain event flow and dependencies
- Contact on-call engineer for critical analytics service disruptions
