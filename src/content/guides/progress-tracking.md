# Progress Tracking Domain

> Domain for managing user learning progress, enrollments, and assessments

## Overview

The Progress Tracking domain handles the complete learning journey management including path enrollments, milestone progress tracking, assessment execution and scoring, and comprehensive progress analytics. This domain orchestrates the entire learning flow from enrollment through completion with deep integration across gamification, notifications, and analytics systems.

## Domain Boundaries

### Responsibilities

- ✅ **Path Enrollment Management**: User enrollment in learning paths with eligibility validation and limits
- ✅ **Milestone Progress Tracking**: Sequential milestone unlocking and completion tracking
- ✅ **Assessment Management**: Assessment creation, execution, scoring, and attempt tracking
- ✅ **Enrollment Status Lifecycle**: Status transitions from enrolled through completed
- ✅ **Progress Analytics**: Progress calculations, statistics, and snapshot creation
- ✅ **Cross-Domain Event Orchestration**: Integration with gamification, notifications, and analytics

### External Dependencies

- **User Management Domain**: User profiles, authentication, premium status, and account management
- **Learning Content Domain**: Paths, milestones, questions, answers, and content structure
- **Notifications Domain**: Progress notifications, completion celebrations, and alerts
- **Analytics Domain**: Progress snapshots, study time tracking, and user statistics
- **Gamification Domain**: Achievement tracking, streak management, and reward systems

## Architecture

```
src/domains/progress-tracking/
├── controllers/              # HTTP request handlers
│   ├── enrollment-core.controller.ts
│   ├── enrollment-status.controller.ts
│   ├── enrollment-progress.controller.ts
│   ├── milestone-progress.controller.ts
│   ├── assessment.controller.ts
│   └── progress-analytics.controller.ts
├── services/                # Business logic
│   ├── enrollment-core.service.ts
│   ├── enrollment-status.service.ts
│   ├── enrollment-progress.service.ts
│   ├── enrollment-validation.service.ts
│   ├── milestone-progress.service.ts
│   └── assessment.service.ts
├── models/                  # Data models
│   ├── path-enrollment.model.ts
│   ├── enrollment-milestone-progress.model.ts
│   ├── milestone-assessment.model.ts
│   ├── assessment-response.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/            # Event handlers
│   ├── assessment.subscriber.ts
│   ├── enrollment-progress.subscriber.ts
│   └── index.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   ├── enrollment.validators.ts
│   ├── assessment.validators.ts
│   └── milestone.validators.ts
├── progress-tracking.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### Enrollment Core Management

- `GET /enrollments/core/my-enrollments` - Get user's enrollments with status filtering
- `POST /enrollments/core/path/:pathId` - Enroll user in learning path
- `GET /enrollments/core/:enrollmentId` - Get detailed enrollment information
- `DELETE /enrollments/core/:enrollmentId` - Unenroll from path (set status to dropped)
- `GET /enrollments/core/path/:pathId/check` - Check enrollment status for path

### Enrollment Status Management

- `PUT /enrollments/status/:enrollmentId` - Update enrollment status
- `GET /enrollments/status/:enrollmentId/history` - Get status change history
- `POST /enrollments/status/bulk-update` - Bulk status updates (admin only)
- `GET /enrollments/status/validate-transition/:currentStatus/:newStatus` - Validate status transition

### Progress Tracking

- `GET /enrollments/progress/:enrollmentId/calculate` - Calculate progress from milestone completion
- `GET /enrollments/progress/user/statistics` - Get comprehensive user progress statistics
- `POST /enrollments/progress/:enrollmentId/sync-with-milestones` - Synchronize progress with milestone states

### Milestone Progress Management

- `POST /milestone-progress/:milestoneId/complete` - Mark milestone as completed
- `POST /milestone-progress/:milestoneId/start` - Start milestone progress
- `POST /milestone-progress/:milestoneId/unlock` - Unlock milestone for user
- `PUT /milestone-progress/:milestoneId/reset` - Reset milestone progress
- `GET /milestone-progress/path/:pathId` - Get complete path progress overview
- `GET /milestone-progress/:milestoneId` - Get specific milestone progress details

### Assessment Management

- `GET /assessments/milestone/:milestoneId` - Get milestone assessment details
- `POST /assessments/milestone/:milestoneId/questions` - Add question to milestone assessment
- `POST /assessments/milestone/:milestoneId/start` - Start new assessment attempt
- `POST /assessments/:assessmentId/submit` - Submit assessment responses
- `GET /assessments/:assessmentId/results` - Get assessment results and scoring
- `GET /assessments/my-assessments` - Get user's assessment history
- `GET /assessments/:assessmentId/attempts` - Get assessment attempt history
- `POST /assessments/milestone/:milestoneId/retake` - Retake failed assessment

### Progress Analytics

- `GET /progress/analytics/user/summary` - Get user progress summary
- `GET /progress/analytics/path/:pathId/progress` - Get path-specific progress analytics

## Models

### PathEnrollment

```typescript
interface PathEnrollment {
  id: number;
  pathId: number;
  userId: number;
  progressPercentage: number;
  enrollmentStatus: 'enrolled' | 'in_progress' | 'completed' | 'paused' | 'dropped';
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### EnrollmentMilestoneProgress

```typescript
interface EnrollmentMilestoneProgress {
  id: number;
  enrollmentId: number;
  milestoneId: number;
  progressStatus: 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';
  displayOrder: number;
  unlockDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### MilestoneAssessment

```typescript
interface MilestoneAssessment {
  id: number;
  userId: number;
  milestoneId: number;
  enrollmentId: number;
  score: number;
  maxScore: number;
  passed: boolean;
  attemptNumber: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### AssessmentResponse

```typescript
interface AssessmentResponse {
  id: number;
  assessmentId: number;
  questionId: number;
  selectedAnswerId: number;
  isCorrect: boolean;
  responseTimeSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

## Events

### Domain Events Published

- `progress.enrollment.created` - New path enrollment created
- `progress.enrollment.status_changed` - Enrollment status updated
- `progress.enrollment.completed` - Complete path finished
- `progress.milestone.started` - Milestone progress started
- `progress.milestone.completed` - Milestone completed
- `progress.milestone.unlocked` - Milestone unlocked for user
- `progress.assessment.started` - Assessment attempt started
- `progress.assessment.completed` - Assessment completed
- `progress.assessment.passed` - Assessment passed successfully
- `progress.assessment.failed` - Assessment failed
- `progress.path.completed` - Entire learning path completed
- `progress.analytics.snapshot_created` - Analytics snapshot created

### External Events Consumed

- `user-management.user.registered` - Initialize user progress tracking capabilities
- `user-management.user.signed_in` - Update last activity and engagement tracking
- `learning-content.path.created` - Enable path enrollment availability
- `learning-content.milestone.created` - Initialize milestone progress tracking
- `gamification.achievement.unlocked` - Track achievement-based progress

## Business Rules

### Enrollment Rules

- **Eligibility Validation**: Users must meet prerequisites and account status requirements
- **Enrollment Limits**: Free users limited to configurable number of active enrollments
- **Premium Benefits**: Premium users get unlimited enrollments and assessment attempts
- **Path Ownership**: Path creators automatically considered enrolled without enrollment limits
- **Status Transitions**: Valid status flow: enrolled → in_progress → completed/paused/dropped
- **Duplicate Prevention**: Users cannot enroll multiple times in the same path

### Progress Rules

- **Sequential Unlocking**: Milestones unlock in order based on display_order and completion
- **Progress Calculation**: Progress percentage calculated based on completed milestones
- **Atomic Updates**: Milestone completion triggers immediate progress recalculation
- **Analytics Integration**: All progress changes tracked for analytics and reporting
- **Reset Capability**: Progress can be reset while preserving enrollment history

### Assessment Rules

- **Attempt Limits**: Free users have configurable retry attempt limits
- **Scoring System**: Configurable passing scores with default 70% threshold
- **Response Tracking**: All responses tracked with correctness and timing data
- **Cooldown Periods**: Failed assessments may have retry cooldown periods
- **Data Integrity**: All assessment data permanently stored for audit purposes
- **Multiple Attempts**: Users can retake failed assessments within limits

## Usage Examples

### Enrolling User in Path

```typescript
import { EnrollmentCoreService } from "@domains/progress-tracking";

const enrollmentService = Container.get(EnrollmentCoreService);
const result = await enrollmentService.enrollInPath(userId, pathId);

if (result.success) {
  console.log("User enrolled:", result.enrollment);
  // Automatically creates milestone progress records
  // Updates user enrollment counts
  // Dispatches enrollment.created event
}
```

### Tracking Milestone Completion

```typescript
import { MilestoneProgressService } from "@domains/progress-tracking";

const progressService = Container.get(MilestoneProgressService);
const result = await progressService.completeMilestone(userId, milestoneId);

// This automatically:
// - Marks milestone as completed
// - Unlocks next milestone in sequence
// - Recalculates enrollment progress percentage
// - Triggers gamification achievement checks
// - Sends progress notifications
// - Updates analytics snapshots
```

### Managing Assessments

```typescript
import { AssessmentService } from "@domains/progress-tracking";

const assessmentService = Container.get(AssessmentService);

// Start assessment attempt
const assessment = await assessmentService.startAssessment(userId, milestoneId);

// Submit responses with timing data
const result = await assessmentService.submitAssessment(
  userId,
  assessment.data.id,
  {
    responses: [
      {
        questionId: 1,
        selectedAnswerId: 3,
        responseTimeSeconds: 45
      },
      {
        questionId: 2,
        selectedAnswerId: 7,
        responseTimeSeconds: 28
      }
    ]
  }
);

// Result includes scoring, pass/fail status, and next steps
console.log("Assessment result:", result.passed, result.score);
```

### Checking Progress Analytics

```typescript
import { ProgressAnalyticsService } from "@domains/progress-tracking";

const analyticsService = Container.get(ProgressAnalyticsService);

// Get comprehensive user progress summary
const userSummary = await analyticsService.getUserProgressSummary(userId);

// Get path-specific progress analytics
const pathProgress = await analyticsService.getPathProgressSummary(
  userId, 
  pathId
);

// Results include completion rates, time tracking, and performance metrics
```

## Configuration

### Domain Registration

```typescript
import { registerProgressDomain } from "@domains/progress-tracking";

registerProgressDomain({
  userRepository: userRepository,
  learningContentRepository: learningContentRepository,
  eventDispatcher: eventBus,
  notificationService: notificationService,
  analyticsRepository: analyticsRepository,
  gamificationService: gamificationService,
  configService: config,
});
```

### Environment Variables

```bash
# Enrollment Configuration
FREE_USER_ENROLLMENT_LIMIT=2
PREMIUM_USER_ENROLLMENT_LIMIT=unlimited
ENROLLMENT_COOLDOWN_HOURS=0

# Assessment Configuration
ASSESSMENT_PASSING_SCORE=70
MAX_ASSESSMENT_ATTEMPTS_FREE=3
MAX_ASSESSMENT_ATTEMPTS_PREMIUM=unlimited
ASSESSMENT_COOLDOWN_HOURS=24
ASSESSMENT_AUTO_GRADE=true

# Progress Configuration
PROGRESS_UPDATE_BATCH_SIZE=100
PROGRESS_ANALYTICS_ENABLED=true
MILESTONE_AUTO_UNLOCK=true
PROGRESS_CACHE_TTL_SECONDS=300

# Notification Configuration
PROGRESS_NOTIFICATIONS_ENABLED=true
COMPLETION_CELEBRATIONS_ENABLED=true
MILESTONE_UNLOCK_NOTIFICATIONS=true

# Performance Configuration
PROGRESS_EVENT_BATCH_SIZE=50
PROGRESS_ASYNC_PROCESSING=true
PROGRESS_QUERY_TIMEOUT_MS=5000
```

## Performance Considerations

### Caching Strategy

- **User Enrollments**: 5 minutes TTL (frequently accessed user-specific data)
- **Progress Summaries**: 2 minutes TTL (frequently updated progress calculations)
- **Assessment Results**: No cache (real-time validation and integrity needed)
- **Analytics Data**: 1 hour TTL (computationally expensive aggregations)

### Database Optimization

- **Indexes**: user_id, path_id, enrollment_id, milestone_id, assessment_id on all tables
- **Composite indexes**: (user_id, path_id) for enrollment queries, (enrollment_id, milestone_id) for progress
- **Query optimization**: Enrollment lists with path and creator joins optimized
- **Batch operations**: Bulk progress updates and analytics calculations

### Event Processing

- **Async processing**: Non-critical events (analytics, notifications) processed asynchronously
- **Event batching**: Multiple progress events batched for performance optimization
- **Retry logic**: Failed events automatically retried with exponential backoff
- **Performance monitoring**: Track event processing latency and throughput

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=progress-tracking/services
npm test -- --testPathPattern=progress-tracking/controllers  
npm test -- --testPathPattern=progress-tracking/subscribers
npm test -- --testPathPattern=progress-tracking/validators
```

### Integration Tests

```bash
npm run test:integration -- progress-tracking
npm run test:events -- progress-tracking
npm run test:api -- progress-tracking
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Subscribers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Enrollment Rate**: New enrollments per day and conversion rates
- **Completion Rate**: Path and milestone completion percentages  
- **Assessment Performance**: Pass rates, average scores, and attempt patterns
- **Progress Velocity**: Average time to complete milestones and paths
- **API Performance**: 95th percentile response times under 500ms

### Alerts

- **High Enrollment Failures**: Alert when >5% enrollment attempts fail
- **Assessment Issues**: Alert when >10% assessment submissions fail
- **Progress Stagnation**: Alert when users stuck on milestones >7 days
- **Performance Degradation**: Alert when API response times exceed 2 seconds
- **Event Processing Delays**: Alert when event queue backlog exceeds thresholds

### Dashboards

- **Learning Analytics Dashboard**: Enrollment trends, completion rates, popular paths
- **Assessment Analytics Dashboard**: Pass rates, difficult questions, performance patterns
- **System Health Dashboard**: API response times, error rates, event processing
- **Business KPIs Dashboard**: Revenue correlation with completion rates and engagement

## Security

### Data Protection

- **User Isolation**: Users can only access their own progress and enrollment data
- **Assessment Integrity**: Response validation, audit trails, and tamper detection
- **Admin Operations**: Bulk operations require proper admin authentication and logging
- **Rate Limiting**: API endpoints protected against abuse and rapid-fire requests

### Progress Integrity

- **Milestone Validation**: Prerequisites and sequential order enforced before unlocking
- **Assessment Security**: Questions and correct answers protected from client exposure
- **Progress Auditing**: All progress changes logged with timestamps and user attribution
- **Rollback Capability**: Administrative ability to revert incorrect progress updates

## Scaling Considerations

### Horizontal Scaling

- **Stateless Services**: All progress services designed for horizontal scaling with load balancing
- **Database Sharding**: Progress data can be partitioned by user for massive scale
- **Event Queues**: High-volume progress events processed through distributed message queues
- **Cache Distribution**: Redis cluster for distributed caching across service instances

### Microservices Migration

- **Service Boundaries**: Clean domain interfaces enable easy extraction to separate services
- **Event-driven Architecture**: Loose coupling through domain events facilitates service separation
- **Database per Service**: Models designed for eventual separation into service-specific databases
- **API Gateway Ready**: Controllers designed for external exposure through API gateways

## Migration & Deployment

### Database Migrations

```bash
# Run progress tracking domain migrations
npm run migrate -- --domain=progress-tracking

# Specific migration files
create-path-enrollments.js
create-enrollment-milestone-progress.js
create-milestone-assessments.js
create-assessment-responses.js
add-progress-indexes.js
add-analytics-fields.js
```

### Zero-Downtime Deployment

1. Deploy new progress services (backward compatible)
2. Update event handlers for progress events  
3. Migrate existing progress data if schema changes needed
4. Switch API traffic to new endpoints
5. Remove deprecated progress tracking code

### Data Migration Scripts

```bash
# Migrate legacy enrollment data to new schema
npm run migrate:data -- progress-tracking:enrollments

# Recalculate progress percentages for all enrollments  
npm run migrate:data -- progress-tracking:recalculate-progress

# Fix orphaned milestone progress records
npm run migrate:data -- progress-tracking:cleanup-orphans

# Initialize analytics snapshots for existing users
npm run migrate:data -- progress-tracking:init-analytics
```

## Troubleshooting

### Common Issues

#### Enrollment Failures

```bash
# Check user eligibility and enrollment limits
curl -X GET "/enrollments/core/path/123/check" \
  -H "Authorization: Bearer $TOKEN"

# Verify path accessibility and prerequisites
# Check user account status (active, not banned)
# Review enrollment limit configurations
# Validate path visibility settings

# Debug enrollment eligibility
tail -f /var/log/app/combined.log | grep "enrollment.created"
```

#### Progress Not Updating

```bash
# Check milestone completion events
tail -f /var/log/app/combined.log | grep "milestone.completed"

# Verify enrollment status (must be active)
SELECT * FROM path_enrollments 
WHERE user_id = $1 AND enrollment_status IN ('enrolled', 'in_progress');

# Check milestone prerequisites and sequential order
SELECT * FROM enrollment_milestone_progress 
WHERE enrollment_id = $1 ORDER BY display_order;
```

#### Assessment Issues

```bash
# Check assessment attempt limits and cooldowns
# Verify question and answer data integrity
# Review scoring logic and passing thresholds
# Check response validation

# Debug assessment flow
curl -X GET "/assessments/milestone/456" \
  -H "Authorization: Bearer $TOKEN"

# Check assessment completion
tail -f /var/log/app/combined.log | grep "assessment.completed"
```

### Performance Issues

```bash
# Monitor progress query performance
EXPLAIN ANALYZE SELECT * FROM path_enrollments pe
JOIN paths p ON pe.path_id = p.id
WHERE pe.user_id = $1 AND pe.enrollment_status IN ('enrolled', 'in_progress')
ORDER BY pe.enrolled_at DESC;

# Check milestone progress queries  
EXPLAIN ANALYZE SELECT * FROM enrollment_milestone_progress emp
JOIN milestones m ON emp.milestone_id = m.id
WHERE emp.enrollment_id = $1 ORDER BY emp.display_order;

# Monitor event processing performance
tail -f /var/log/app/combined.log | grep "progress.event.processed"
```

## Contributing

### Adding New Features

1. **Define interfaces** in `interfaces/internal.interfaces.ts`
2. **Update domain config** in `progress-tracking.domain.ts`
3. **Implement service logic** in appropriate service file
4. **Add API endpoints** in relevant controller
5. **Update event handling** in subscribers if needed
6. **Add comprehensive tests** for all new functionality
7. **Update documentation** and usage examples

### Modifying Business Rules

1. **Update validation logic** in service methods and validators
2. **Modify state transitions** in enrollment status service
3. **Update event payloads** if needed for downstream consumers
4. **Add backward compatibility** for existing progress data
5. **Test thoroughly** with various user scenarios and edge cases

## Roadmap

### Planned Features

- **Advanced Progress Analytics**: Predictive modeling and learning path optimization
- **Adaptive Assessments**: Dynamic question difficulty based on user performance  
- **Collaborative Learning**: Team-based enrollments and group progress tracking
- **Learning Path Templates**: Pre-configured tracks for common learning objectives
- **Advanced Reporting**: Comprehensive progress reports for users and administrators

### Technical Improvements

- **Real-time Progress Updates**: WebSocket notifications for live progress updates
- **Machine Learning Integration**: Progress prediction and intervention recommendations
- **Mobile Offline Support**: Offline progress synchronization for mobile applications
- **Multi-tenant Architecture**: Organization-specific progress tracking and reporting
- **Advanced Caching**: Intelligent cache invalidation and distributed caching strategies

## Support

For issues related to the progress-tracking domain:

1. Check logs in `/var/log/app/combined.log`
2. Review monitoring dashboards for service health and performance
3. Verify domain dependencies are properly registered and accessible
4. Check database connection and migration status
5. Validate event dispatcher configuration and message queue health
6. Test with isolated user accounts to reproduce issues

For emergency issues:

- Use admin endpoints for bulk progress operations and data fixes
- Check system health at `/admin/health/progress-tracking`
- Review error rates and performance metrics in monitoring dashboard
- Contact on-call engineer for critical progress tracking failures affecting learning flow