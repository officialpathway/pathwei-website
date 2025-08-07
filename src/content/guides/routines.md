# Routines Domain

> Domain for managing user routines and sessions

## Overview

The Routines domain handles personal routine and schedule management including weekly routine creation, routine sessions with multi-day scheduling, notifications, and schedule management. This domain provides users with the ability to create, manage, and track their daily routines with intelligent notification systems and conflict detection.

## Domain Boundaries

### Responsibilities

- ✅ **Weekly Routine Management**: Creation, updating, and deletion of weekly routines
- ✅ **Routine Session Management**: Multi-day session scheduling with flexible time management
- ✅ **Schedule Management**: Daily and weekly schedule retrieval and conflict detection
- ✅ **Notification System**: Smart notifications with customizable reminders and overnight session support
- ✅ **Session Overlap Management**: Intelligent handling of session overlaps and compatibility rules
- ✅ **Favorite Management**: Routine favoriting and priority management

### External Dependencies

- **User Management Domain**: User profiles and authentication
- **Notifications Domain**: Push notification services and user preferences
- **Learning Content Domain**: Optional path integration for learning-based routines

## Architecture

```
src/domains/routines/
├── controllers/              # HTTP request handlers
│   ├── routine-management.controller.ts
│   ├── routine-session.controller.ts
│   ├── routine-schedule.controller.ts
│   └── routine-notification.controller.ts
├── services/                # Business logic
│   ├── routine-management.service.ts
│   ├── routine-session.service.ts
│   ├── routine-schedule.service.ts
│   └── routine-notification.service.ts
├── models/                  # Data models
│   ├── weekly-routine.model.ts
│   ├── routine-session.model.ts
│   ├── associations.ts
│   └── index.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── routine.validators.ts
├── dtos/                # Data transfer objects
│   └── routine.dtos.ts
├── routines.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### Routine Management

- `GET /routines/` - Get user's routines with filtering and pagination
- `POST /routines/` - Create new routine
- `GET /routines/:routineId` - Get specific routine details
- `PUT /routines/:routineId` - Update routine properties
- `DELETE /routines/:routineId` - Delete routine and all associated sessions
- `POST /routines/:routineId/favorite` - Toggle routine favorite status

### Session Management

- `POST /routines/:routineId/sessions` - Add session to routine
- `PUT /routines/sessions/:sessionId` - Update routine session
- `DELETE /routines/sessions/:sessionId` - Delete routine session

### Schedule Management

- `GET /routines/schedule/today` - Get today's schedule
- `GET /routines/schedule/date/:date` - Get schedule for specific date
- `GET /routines/schedule/weekly` - Get weekly schedule view
- `GET /routines/schedule/upcoming` - Get upcoming sessions
- `POST /routines/schedule/conflicts/check` - Check for scheduling conflicts

### Notification Management

- `POST /routines/notifications/reschedule` - Reschedule notifications for all sessions
- `GET /routines/notifications/status` - Get notification system status
- `PUT /routines/notifications/sessions/:sessionId` - Update session notification settings

## Models

### WeeklyRoutine

```typescript
interface WeeklyRoutine {
  id: number;
  userId: number;
  routineName: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### RoutineSession

```typescript
interface RoutineSession {
  id: number;
  routineId: number;
  pathId?: number;
  sessionTitle: string;
  description?: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  color: string;
  isNotifiable: boolean;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  customReminderMessage?: string;
  sessionFrequency: 'once' | 'daily' | 'weekly' | 'custom';
  weeklyOccurrences: number;
  isOvernight: boolean;
  eventType: 'work' | 'study' | 'sleep' | 'exercise' | 'meal' | 'commute' | 'learning' | 'leisure' | 'personal' | 'other';
  allowsOverlap: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

## Events

### Domain Events Published

- `routines.routine.created` - New routine created
- `routines.routine.updated` - Routine properties updated
- `routines.routine.deleted` - Routine deleted
- `routines.session.created` - New session added to routine
- `routines.session.completed` - Session marked as completed
- `routines.notification.sent` - Notification successfully sent

### External Events Consumed

- None (Routines domain is self-contained for routine management)

## Business Rules

### Routine Rules

- **Routine Name Uniqueness**: Routine names must be unique per user (auto-numbering applied)
- **Routine Name Length**: Maximum 255 characters for routine names
- **Auto-naming**: Default names generated as "Mi Rutina N" when no name provided
- **Cascade Deletion**: Deleting a routine removes all associated sessions

### Session Rules

- **Multi-Day Support**: Sessions can be scheduled across multiple days of the week
- **Time Format**: 24-hour format (HH:MM) for start and end times
- **Session Duration**: Calculated automatically handling overnight sessions
- **Days Validation**: At least one day must be specified for each session
- **Valid Days**: Only standard weekdays (monday through sunday) accepted

### Notification Rules

- **Reminder Range**: 1-1440 minutes (24 hours maximum) before session
- **Default Reminder**: 10 minutes before session start
- **Custom Messages**: Optional custom reminder messages per session
- **Overnight Support**: Notifications properly calculated for sessions crossing midnight

### Overlap and Conflict Rules

- **Event Type Compatibility**: Certain event types can overlap (commute+learning, exercise+learning, etc.)
- **Overlap Permission**: Sessions must explicitly allow overlaps via allowsOverlap field
- **Compatible Overlaps**: Predefined compatible event type combinations
- **Conflict Detection**: Automatic detection of time conflicts on same days

## Usage Examples

### Creating a Weekly Routine

```typescript
import { RoutineManagementService } from "@domains/routines";

const routineService = Container.get(RoutineManagementService);
const result = await routineService.createRoutine(userId, {
  routineName: "Morning Workout",
  isActive: true
});

if (result.success) {
  console.log("Routine created:", result.routine);
}
```

### Adding Multi-Day Session

```typescript
import { RoutineSessionService } from "@domains/routines";

const sessionService = Container.get(RoutineSessionService);
const session = await sessionService.addSession(userId, routineId, {
  sessionTitle: "Cardio Training",
  description: "30-minute intensive cardio workout",
  daysOfWeek: ["monday", "wednesday", "friday"],
  startTime: "07:00",
  endTime: "07:30",
  color: "#FF6B6B",
  eventType: "exercise",
  reminderEnabled: true,
  reminderMinutesBefore: 15,
  customReminderMessage: "Time for your cardio session! 💪"
});
```

### Managing Overnight Sessions

```typescript
import { RoutineSession } from "@domains/routines";

// Create overnight session (e.g., sleep)
const sleepSession = RoutineSession.createOvernightSession({
  sessionTitle: "Sleep",
  startTime: "23:00",
  endTime: "07:00",
  daysOfWeek: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
  eventType: "sleep",
  isNotifiable: false,
  allowsOverlap: false
});
```

### Checking Schedule Conflicts

```typescript
import { RoutineScheduleService } from "@domains/routines";

const scheduleService = Container.get(RoutineScheduleService);
const conflicts = await scheduleService.checkScheduleConflicts(
  userId,
  ["monday", "wednesday"],
  "08:00",
  "09:00"
);

if (conflicts.hasConflicts) {
  console.log("Conflicts detected:", conflicts.conflictingSessions);
}
```

## Configuration

### Domain Registration

```typescript
import { registerRoutinesDomain } from "@domains/routines";

registerRoutinesDomain({
  userRepository: userRepository,
  eventDispatcher: eventBus,
  pushNotificationService: pushNotificationService,
  userPreferenceRepository: userPreferenceRepository,
});
```

### Environment Variables

```bash
# Routine Configuration
ROUTINES_MAX_SESSIONS_PER_DAY=10
ROUTINES_MIN_SESSION_DURATION_MINUTES=15
ROUTINES_MAX_SESSION_DURATION_MINUTES=480

# Notification Configuration
ROUTINES_NOTIFICATIONS_ENABLED=true
ROUTINES_DEFAULT_REMINDER_MINUTES=10
ROUTINES_MAX_REMINDER_MINUTES=1440
ROUTINES_MAX_SCHEDULED_NOTIFICATIONS_PER_USER=50

# Performance Configuration
ROUTINES_CACHE_TTL_SECONDS=1800
ROUTINES_NOTIFICATION_BATCH_SIZE=100
ROUTINES_SCHEDULE_QUERY_LIMIT=50

# Feature Flags
ROUTINES_ENABLE_OVERNIGHT_SESSIONS=true
ROUTINES_ENABLE_OVERLAP_DETECTION=true
ROUTINES_ENABLE_AUTO_CONFLICT_RESOLUTION=false
```

## Performance Considerations

### Caching Strategy

- **User Routines**: 30 minutes TTL (routine lists don't change frequently)
- **Session Details**: 15 minutes TTL (session properties may change)
- **Schedule Views**: 5 minutes TTL (balance between performance and accuracy)
- **Notification Status**: 10 minutes TTL (notification states need reasonable freshness)

### Database Optimization

- **Indexes**: routine_id, user_id, is_notifiable, reminder_enabled on routine_sessions table
- **Composite indexes**: (routine_id, user_id) for ownership queries
- **JSON indexes**: days_of_week field for efficient day-based queries
- **Time indexes**: start_time and end_time for schedule conflict detection

### Event Processing

- **Async processing**: Notification scheduling runs asynchronously
- **Batch operations**: Multiple routine operations batched for efficiency
- **Retry logic**: Failed notification scheduling has exponential backoff retry
- **Performance monitoring**: Track routine creation rates and notification delivery

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=routines/services
npm test -- --testPathPattern=routines/controllers
npm test -- --testPathPattern=routines/validators
```

### Integration Tests

```bash
npm run test:integration -- routines
npm run test:notifications -- routines
npm run test:api -- routines
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Routine Activity**: Track routine creation, updates, and deletion rates
- **Session Scheduling**: Monitor session creation and scheduling patterns
- **Notification Delivery**: Track notification success and failure rates
- **Schedule Conflicts**: Monitor frequency of scheduling conflicts

### Alerts

- **High Notification Failure Rate**: Alert when notification delivery drops below threshold
- **Schedule Conflict Spikes**: Alert on unusual increases in scheduling conflicts
- **Performance Degradation**: Alert when routine operations exceed acceptable response times
- **Database Issues**: Monitor routine and session query performance

### Dashboards

- **Routine Usage Dashboard**: Active routines, sessions per routine, user engagement
- **Schedule Analytics Dashboard**: Most popular session times, routine patterns
- **Notification Performance Dashboard**: Delivery rates, reminder effectiveness

## Security

### Data Protection

- **User Ownership**: All routine operations verify user ownership before allowing access
- **Input Validation**: Comprehensive validation of all routine and session data
- **Time Format Validation**: Strict validation of time formats to prevent injection
- **Day Validation**: Validation of day arrays to prevent invalid data

### Privacy Features

- **User Isolation**: Routines and sessions are strictly isolated per user
- **Notification Privacy**: Custom reminder messages are user-controlled and private
- **Schedule Privacy**: User schedules are not exposed to other users
- **Data Sanitization**: All text inputs are sanitized for security

## Scaling Considerations

### Horizontal Scaling

- **Stateless services**: All routine services support horizontal scaling
- **Event queues**: Routine events processed through distributed queues
- **Cache distribution**: Routine data cached across distributed cache instances
- **Notification scaling**: Notification scheduling can be distributed across workers

### Microservices Migration

- **Service boundaries**: Clean separation between routine management, sessions, and notifications
- **Event-driven architecture**: Loose coupling through domain events
- **API gateway ready**: RESTful APIs designed for external access
- **Database separation**: Models can be separated into service-specific databases

## Migration & Deployment

### Database Migrations

```bash
# Run routines domain migrations
npm run migrate -- --domain=routines

# Specific migration files
create-weekly-routines.js
create-routine-sessions.js
add-overnight-support-to-sessions.js
add-event-types-to-sessions.js
add-overlap-support-to-sessions.js
```

### Zero-Downtime Deployment

1. Deploy new routine services (backward compatible)
2. Update notification handlers for routine events
3. Migrate existing routine data if needed
4. Switch API traffic to new endpoints
5. Remove deprecated routine management code

## Troubleshooting

### Common Issues

#### Routines Not Loading

```bash
# Check user authentication
curl -X GET "/routines/" \
  -H "Authorization: Bearer $TOKEN"

# Verify routine ownership
SELECT * FROM weekly_routines WHERE user_id = $1 AND is_active = true;

# Check service logs
tail -f /var/log/app/combined.log | grep "routine-management"
```

#### Sessions Not Scheduling

```bash
# Check session data integrity
SELECT * FROM routine_sessions 
WHERE routine_id = $1 AND JSON_VALID(days_of_week) = 1;

# Verify time format
SELECT session_title, start_time, end_time 
FROM routine_sessions 
WHERE start_time REGEXP '^[0-9]{2}:[0-9]{2}$';

# Check overlap settings
SELECT * FROM routine_sessions 
WHERE allows_overlap = true OR is_overnight = true;
```

### Performance Issues

```bash
# Check routine query performance
EXPLAIN ANALYZE SELECT * FROM weekly_routines 
WHERE user_id = $1 AND is_active = true 
ORDER BY is_favorite DESC, created_at DESC;

# Monitor session queries
EXPLAIN ANALYZE SELECT * FROM routine_sessions 
WHERE routine_id = $1 
ORDER BY start_time ASC;

# Check notification processing
tail -f /var/log/app/combined.log | grep "routines.notification"
```

## Contributing

### Adding New Features

1. **Define interfaces** in `interfaces/internal.interfaces.ts`
2. **Update domain config** in `routines.domain.ts`
3. **Implement service logic** in appropriate service file
4. **Add API endpoints** in relevant controller
5. **Update notification handling** if needed
6. **Add tests** for all new functionality
7. **Update documentation** and examples

### Modifying Business Rules

1. **Update validation logic** in service methods and validators
2. **Modify time and date handling** in session methods
3. **Update event payloads** if needed
4. **Add backward compatibility** for existing routine data
5. **Test thoroughly** with various scheduling scenarios

## Roadmap

### Planned Features

- **AI-Powered Scheduling**: Intelligent routine optimization and suggestion system
- **Advanced Conflict Resolution**: Automatic rescheduling and conflict resolution
- **Habit Tracking Integration**: Connection with habit tracking and streak management
- **Calendar Sync**: Two-way synchronization with external calendar systems

### Technical Improvements

- **Real-time Updates**: WebSocket support for live schedule updates
- **Advanced Analytics**: Detailed routine analytics and optimization suggestions  
- **Performance Optimization**: Further query optimization and caching improvements
- **Mobile Sync**: Enhanced offline support and synchronization

## Support

For issues related to the routines domain:

1. Check logs in `/var/log/app/combined.log`
2. Review routine and session database tables
3. Verify user ownership and authentication
4. Check notification service integration
5. Validate domain dependencies are properly registered
6. Test with isolated routine scenarios

For emergency issues:

- Use admin endpoints to investigate user routines
- Check system health through routine management endpoints
- Review routine domain error rates in monitoring dashboard
- Contact on-call engineer for critical routine functionality failures