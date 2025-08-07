# User Management Domain

> Domain for user profiles, preferences, and account management

## Overview

The User Management domain handles user profiles, preferences, device management, search functionality, analytics, and administrative operations. This domain manages all aspects of user accounts from profile information to advanced admin operations like beta testing and moderation.

## Domain Boundaries

### Responsibilities

- ✅ **User Profile Management**: Profile creation, updates, and public profile views
- ✅ **User Preferences**: Application settings and preference management
- ✅ **User Search**: Search functionality and user discovery
- ✅ **Device Management**: Push notification device registration and management
- ✅ **User Analytics**: Activity tracking and analytics reporting
- ✅ **Activity Tracking**: User activity monitoring and streak management
- ✅ **Admin Operations**: User administration, moderation, and beta testing management

### External Dependencies

- **Authentication Domain**: User authentication and session management
- **Notifications Domain**: Notification delivery services
- **Analytics Domain**: Analytics reporting and data collection

## Architecture

```
src/domains/user-management/
├── controllers/              # HTTP request handlers
│   ├── user-profile.controller.ts
│   ├── user-preferences.controller.ts
│   ├── user-search.controller.ts
│   ├── user-device.controller.ts
│   ├── user-admin-core.controller.ts
│   └── user-admin-data.controller.ts
├── services/                # Business logic
│   ├── user-profile.service.ts
│   ├── user-preferences.service.ts
│   ├── user-search.service.ts
│   ├── user-device.service.ts
│   ├── user-analytics.service.ts
│   ├── user-activity-tracker.service.ts
│   ├── user-admin-core.service.ts
│   └── user-admin-data.service.ts
├── models/                  # Data models
│   ├── user.model.ts
│   ├── user-preference.model.ts
│   ├── user-device.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/            # Event handlers
│   ├── user-profile.subscriber.ts
│   ├── user-activity.subscriber.ts
│   └── user-stats.subscriber.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── user.validators.ts
├── dtos/                # Data transfer objects
│   └── user.dtos.ts
├── user-management.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### User Profile Management

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/profile/:id` - Get public user profile
- `DELETE /users/profile` - Deactivate user account

### User Preferences

- `GET /users/preferences` - Get user preferences
- `PUT /users/preferences` - Update user preferences (bulk)
- `PUT /users/preferences/single` - Update single preference

### User Search

- `GET /users/search` - Search users with filtering
- `GET /users/search/suggestions` - Get user suggestions

### Device Management

- `POST /users/devices` - Register device for notifications
- `GET /users/devices` - Get user devices
- `DELETE /users/devices/:token` - Remove device

### Admin Operations

- `PUT /users/admin/promote/:id` - Promote user to admin
- `PUT /users/admin/beta/:id` - Change beta tester status
- `PUT /users/admin/flag/:id` - Flag user for moderation
- `POST /users/admin/bulk-update` - Bulk user operations

## Models

### User

```typescript
interface User {
  id: number;
  role: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  age?: number;
  pushToken?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyStreak: number;
  longestStreak: number;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  isFirstLogin: boolean;
  tutorialCompleted: boolean;
  isEmailVerified: boolean;
  isPremium: boolean;
  stripeCustomerId?: string;
  enrolledPathsCount: number;
  completedPathsCount: number;
  completedMilestonesCount: number;
  pathFollowCount: number;
  monthlyAiUsageCount: number;
  aiUsageResetDate?: Date;
  totalAiUsageCount: number;
  timezone: string;
  preferredLanguage: string;
  onboardingCompleted: boolean;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  isBanned: boolean;
  isAdmin: boolean;
  adminLevel?: 'super' | 'moderator' | 'support';
  adminPermissions?: string;
  isBetaTester: boolean;
  betaGroup?: string;
  betaJoinedAt?: Date;
  betaFeedbackCount: number;
  feedbackCount: number;
  isFlagged: boolean;
  flagReason?: string;
  flaggedAt?: Date;
  flaggedBy?: number;
  streakFreezesUsed: number;
  streakFreezesLifetime: number;
  lastFreezeUsedAt?: Date;
  streakFrozenUntil?: Date;
  avatarStyle: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserPreference

```typescript
interface UserPreference {
  id: number;
  userId: number;
  preferenceKey: string;
  preferenceValue: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserDevice

```typescript
interface UserDevice {
  id: number;
  userId: number;
  deviceToken: string;
  platform: 'ios' | 'android';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### Domain Events Published

- `user.profileUpdated` - User profile updated
- `user.preferencesUpdated` - User preferences updated  
- `user.accountStatusChanged` - User account status changed
- `user.deviceRegistered` - Device registered for notifications
- `user.activityRecorded` - User activity recorded
- `user.adminPromoted` - User promoted to admin
- `user.betaStatusChanged` - Beta tester status changed
- `user.deactivated` - User account deactivated
- `user.statsUpdated` - User statistics updated

### External Events Consumed

- `authentication.user.signUp` - Create default user preferences
- `authentication.user.signIn` - Update user activity timestamp
- `learning-content.path.enrolled` - Update enrollment statistics
- `learning-content.path.completed` - Update completion statistics
- `learning-content.milestone.completed` - Update milestone statistics
- `feedback.submitted` - Track user feedback submissions

## Business Rules

### User Profile Rules

- **Username Uniqueness**: Username must be unique across the platform
- **Email Uniqueness**: Email must be unique across the platform
- **Profile Completeness**: First name is required for profile updates
- **Account Status**: Only active users can perform operations
- **Language Validation**: Preferred language must be supported language code
- **Timezone Validation**: Timezone must be valid timezone identifier

### Admin Rules

- **Admin Promotion**: Only super admins can promote users to admin status
- **Permission Management**: Admin permissions are JSON-encoded and validated
- **Beta Testing**: Beta group assignments must be valid group identifiers
- **User Flagging**: Flagged users require review before status changes

### Device Rules

- **Device Registration**: Device token must be unique per user and platform
- **Platform Validation**: Platform must be 'ios' or 'android'
- **Active Device Limit**: Users limited to reasonable number of active devices

## Usage Examples

### Profile Management

```typescript
import { UserProfileService } from "@domains/user-management";

const userProfileService = Container.get(UserProfileService);
const profile = await userProfileService.getUserProfile(userId);

if (profile.success) {
  console.log("User profile:", profile.data);
}
```

### Preference Updates

```typescript
import { UserPreferencesService } from "@domains/user-management";

const userPreferencesService = Container.get(UserPreferencesService);

const result = await userPreferencesService.updateUserPreferences(userId, {
  theme: "dark",
  language: "en",
  notifications: {
    email: true,
    push: false
  }
});
```

### Admin Operations

```typescript
import { UserAdminCoreService } from "@domains/user-management";

const userAdminService = Container.get(UserAdminCoreService);

const result = await userAdminService.promoteToAdmin(userId, {
  adminLevel: "moderator",
  permissions: ["user_management", "content_moderation"]
});
```

## Configuration

### Domain Registration

```typescript
import { registerUserManagementDomain } from "@domains/user-management";

registerUserManagementDomain({
  userRepository: userRepository,
  userPreferenceRepository: userPreferenceRepository,
  userDeviceRepository: userDeviceRepository,
  eventDispatcher: eventBus,
  configService: config,
  notificationService: notificationService,
  analyticsService: analyticsService, // optional
});
```

### Environment Variables

```bash
# User Management Configuration
USER_PROFILE_CACHE_TTL_SECONDS=3600
USER_SEARCH_MAX_RESULTS=50
USER_DEVICE_MAX_PER_USER=10

# AI Usage Configuration
AI_USAGE_FREE_MONTHLY_LIMIT=5
AI_USAGE_PREMIUM_MONTHLY_LIMIT=100

# Admin Configuration
ADMIN_BULK_OPERATION_MAX_USERS=1000
BETA_TESTER_AUTO_APPROVE=false

# Performance Configuration
USER_ANALYTICS_CACHE_TTL_SECONDS=1800
USER_SEARCH_CACHE_TTL_SECONDS=900
```

## Performance Considerations

### Caching Strategy

- **User Profiles**: 1 hour TTL (frequently accessed profile data)
- **User Preferences**: 30 minutes TTL (settings don't change often)
- **Search Results**: 15 minutes TTL (reasonable freshness for discovery)
- **User Analytics**: 30 minutes TTL (balance between performance and accuracy)

### Database Optimization

- **Indexes**: email, username, role, account_status, is_admin, is_beta_tester
- **Composite indexes**: (user_id, device_token) for device queries
- **Query optimization**: User search with proper filtering and pagination
- **Batch operations**: Bulk updates for admin operations

### Event Processing

- **Async processing**: Analytics and stats updates run asynchronously
- **Event batching**: User activity events are batched for performance
- **Retry logic**: Failed event processing has exponential backoff retry
- **Performance monitoring**: Track event processing latency and throughput

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=user-management/services
npm test -- --testPathPattern=user-management/controllers
npm test -- --testPathPattern=user-management/validators
```

### Integration Tests

```bash
npm run test:integration -- user-management
npm run test:events -- user-management
npm run test:api -- user-management
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Profile Updates**: Track frequency and success rate of profile updates
- **Search Performance**: Monitor search response times and result relevance
- **Device Registrations**: Track push notification device registrations
- **Admin Actions**: Monitor administrative operations and their impact

### Alerts

- **Failed Logins**: Alert on unusual failed login patterns
- **Admin Escalations**: Alert on admin privilege changes
- **Search Performance**: Alert when search latency exceeds thresholds
- **Device Registration Failures**: Monitor push notification setup issues

### Dashboards

- **User Activity Dashboard**: Active users, profile updates, search usage
- **Admin Dashboard**: Admin actions, user moderation, beta testing metrics
- **Performance Dashboard**: Service response times, cache hit rates

## Security

### Data Protection

- **Password Security**: Passwords are hashed and never exposed in responses
- **Email Verification**: Email verification required for account security
- **Personal Data**: Sensitive user data is properly sanitized in public APIs
- **Admin Permissions**: Admin operations require proper permission validation

### User Privacy

- **Public Profiles**: Limited information exposed in public profile views
- **Preference Privacy**: User preferences are private and user-controlled
- **Search Privacy**: Search queries don't expose sensitive user information
- **Device Security**: Device tokens are encrypted and user-specific

## Scaling Considerations

### Horizontal Scaling

- **Stateless services**: All services support horizontal scaling with load balancing
- **Event queues**: User events are processed through distributed queues
- **Cache distribution**: User data cached across distributed cache instances
- **Search scaling**: User search can be offloaded to dedicated search service

### Microservices Migration

- **Service boundaries**: Clear separation between profile, preferences, and admin services
- **Event-driven architecture**: Loose coupling through domain events
- **API gateway ready**: RESTful APIs designed for external access
- **Database separation**: Models can be separated into service-specific databases

## Migration & Deployment

### Database Migrations

```bash
# Run user management domain migrations
npm run migrate -- --domain=user-management

# Specific migration files
create-users.js
create-user-preferences.js  
create-user-devices.js
add-admin-fields-to-users.js
add-beta-fields-to-users.js
```

### Zero-Downtime Deployment

1. Deploy new services (backward compatible)
2. Update event handlers for new events
3. Migrate existing user data if needed
4. Switch API traffic to new endpoints
5. Remove deprecated user management code

## Troubleshooting

### Common Issues

#### User Profile Not Loading

```bash
# Check user exists and is active
curl -X GET "/users/profile/123" \
  -H "Authorization: Bearer $TOKEN"

# Verify database connection
tail -f /var/log/app/combined.log | grep "user-management"
```

#### Preference Updates Failing

```bash
# Check validation errors
tail -f /var/log/app/combined.log | grep "preference"

# Verify preference format
curl -X PUT "/users/preferences" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"theme": "dark", "language": "en"}'
```

### Performance Issues

```bash
# Profile slow queries
EXPLAIN ANALYZE SELECT * FROM users 
WHERE id = $1 AND account_status = 'active';

# Check cache performance
redis-cli info stats | grep cache

# Monitor event processing
tail -f /var/log/app/combined.log | grep "event.processed"
```

## Contributing

### Adding New Features

1. **Define interfaces** in `interfaces/internal.interfaces.ts`
2. **Update domain config** in `user-management.domain.ts`
3. **Implement service logic** in appropriate service file
4. **Add API endpoints** in relevant controller
5. **Update event handling** in subscribers
6. **Add tests** for all new functionality
7. **Update documentation** and examples

### Modifying Business Rules

1. **Update validation logic** in validation services
2. **Modify state transitions** in core services
3. **Update event payloads** if needed
4. **Add backward compatibility** for existing data
5. **Test thoroughly** with edge cases

## Roadmap

### Planned Features

- **Enhanced User Search**: Advanced filtering and recommendation algorithms
- **Social Features**: Friend connections and user interactions
- **Advanced Analytics**: Detailed user behavior analytics and insights
- **Multi-factor Authentication**: Enhanced security for user accounts

### Technical Improvements

- **Search Performance**: Elasticsearch integration for advanced user search
- **Caching Strategy**: Redis-based distributed caching for better performance  
- **Event Sourcing**: Complete audit trail for all user management operations
- **API Rate Limiting**: Protect against abuse of user management endpoints

## Support

For issues related to the user-management domain:

1. Check logs in `/var/log/app/combined.log`
2. Review monitoring dashboards for service health
3. Verify domain dependencies are properly registered
4. Check database connection and migrations status
5. Validate event dispatcher configuration
6. Test with isolated user scenarios

For emergency issues:

- Use admin endpoints for critical user operations
- Check system health at `/admin/health/user-management`
- Review user management error rates in monitoring dashboard
- Contact on-call engineer for critical user account failures