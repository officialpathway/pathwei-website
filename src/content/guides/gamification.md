# Gamification Domain

> User engagement through achievements, streak management, and progress tracking system

## Overview

The Gamification domain manages user engagement mechanics including achievement catalog and progress tracking, comprehensive login streak management with intelligent freeze functionality, and analytics-driven insights. It provides event-driven architecture for awarding achievements based on cross-domain activities while maintaining high performance through strategic caching and real-time progress calculation.

## Domain Boundaries

### Responsibilities

- Achievement catalog management with rarity-based point systems
- User achievement progress tracking and manual claiming
- Login streak management with auto-freeze protection
- Streak freeze system with user-tier limitations
- Activity heatmap and streak analytics
- Cross-domain event processing for automatic achievement awards
- Leaderboard generation and ranking systems

### What It Does NOT Handle

- User authentication and session management (handled by User Management domain)
- Learning progress and enrollment tracking (handled by Progress Tracking domain)
- Social relationships and interactions (handled by Social domain)
- Push notifications for achievements (handled by Notifications domain)

### Dependencies

- **User Management**: User profiles, premium status, authentication events
- **Analytics**: Activity heatmap data and user activity tracking
- **Progress Tracking**: Milestone and path completion events
- **Social**: Review and friend relationship events
- **Notifications**: Achievement award and streak milestone notifications

## Architecture

```
src/domains/gamification/
├── controllers/
│   ├── achievement-catalog.controller.ts       # Achievement browsing and search
│   ├── achievement-progress.controller.ts      # Progress tracking and claiming
│   ├── user-achievement.controller.ts          # User achievement management
│   ├── streak-management.controller.ts         # Login streak operations
│   ├── streak-freeze.controller.ts             # Freeze system management
│   └── streak-analytics.controller.ts          # Analytics and insights
├── services/
│   ├── achievement-catalog.service.ts          # Achievement catalog operations
│   ├── achievement-progress.service.ts         # Progress calculation and awards
│   ├── user-achievement.service.ts             # User achievement queries
│   ├── streak-management.service.ts            # Core streak logic
│   ├── streak-freeze.service.ts                # Freeze application logic
│   └── streak-analytics.service.ts             # Heatmap and insights
├── models/
│   ├── achievement.model.ts                    # Achievement definitions
│   ├── user-achievement.model.ts               # User-achievement relationships
│   ├── associations.ts                         # Model relationships
│   └── index.ts                               # Model exports
├── subscribers/
│   ├── achievement.subscriber.ts               # Achievement event handlers
│   ├── login-streak.subscriber.ts              # Streak event handlers
│   └── analytics-activity.subscriber.ts       # Analytics event handlers
├── interfaces/
│   ├── external.interfaces.ts                  # Cross-domain contracts
│   └── internal.interfaces.ts                  # Internal domain types
├── validators/
│   └── achievement.validators.ts               # Input validation
├── gamification.domain.ts                     # Domain configuration
└── index.ts                                   # Public API exports
```

## API Endpoints

### Achievement Catalog

- `GET /achievements` - Get paginated achievements with filtering by category and rarity (Cached: 1 hour)
- `GET /achievements/:achievementId` - Get achievement details with statistics (Cached: 30 minutes)
- `GET /achievements/meta/categories` - Get unique achievement categories (Cached: 1 hour)
- `GET /achievements/meta/rarities` - Get rarity levels (Cached: 1 hour)
- `GET /achievements/search` - Search achievements by title and description (Cached: 30 minutes)

### Achievement Progress

- `GET /achievements/progress` - Check progress toward all achievements (Mobile Only, User Cache)
- `POST /achievements/progress/:achievementId/claim` - Manually claim eligible achievement (Mobile Only)
- `GET /achievements/progress/:achievementId` - Get specific achievement progress (Mobile Only, User Cache)

### User Achievements

- `GET /user-achievements/health` - Health check endpoint
- `GET /user-achievements` - Get user's earned achievements with pagination (Mobile Only)
- `GET /user-achievements/recent` - Get last 10 earned achievements (Mobile Only, User Cache)
- `GET /user-achievements/stats` - Get comprehensive achievement statistics (Mobile Only, User Cache)
- `GET /user-achievements/summary` - Get compact achievement summary (Mobile Only, User Cache)
- `GET /user-achievements/by-category` - Get achievements grouped by category (Mobile Only, User Cache)

### Streak Management

- `GET /streak/management/health` - Health check endpoint
- `GET /streak/management` - Get current streak information (Mobile Only)
- `PUT /streak/management/update-login` - Update login streak on user login (Mobile Only)
- `POST /streak/management/validate-session` - Validate session streak (Mobile Only)
- `POST /streak/management/reset` - Reset user streak manually (Admin Only)
- `POST /streak/management/recalculate` - Recalculate streak from login history (Admin Only)
- `POST /streak/management/reset-inactive` - Batch reset inactive streaks (Admin Only)
- `PUT /streak/management/update` - Legacy streak update endpoint (deprecated, Mobile Only)

### Streak Freeze System

- `GET /streak/freeze/health` - Health check endpoint
- `GET /streak/freeze/info` - Get freeze availability and limits (Mobile Only)
- `POST /streak/freeze/apply` - Apply manual streak freeze (Mobile Only)
- `GET /streak/freeze/status` - Get current freeze status (Mobile Only)

### Streak Analytics

- `GET /streak/analytics/health` - Health check endpoint
- `GET /streak/analytics/history` - Get streak history for time periods (Mobile Only)
- `GET /streak/analytics/heatmap` - Get activity heatmap for calendar visualization (Mobile Only)
- `GET /streak/analytics/insights` - Get streak insights and recommendations (Mobile Only)
- `GET /streak/analytics/leaderboard` - Get streak leaderboard (Mobile Only)
- `GET /streak/analytics/leaderboard/position` - Get user's leaderboard position (Mobile Only)

## Data Models

### Achievement

Achievement catalog with rarity-based point system and flexible criteria.

**Fields:**
- `id` (number) - Primary key
- `title` (string) - Achievement title (max 255 chars)
- `description` (text) - Achievement description
- `badgeIcon` (string, optional) - Badge icon identifier (max 100 chars)
- `badgeColor` (string, optional) - Badge color hex code (7 chars)
- `achievementType` (enum) - "milestone", "streak", "social", "completion", "time_based"
- `criteriaJson` (text, optional) - JSON criteria for achievement calculation
- `pointsValue` (number) - Point value (default: 0)
- `rarityLevel` (enum) - "common", "uncommon", "rare", "epic", "legendary"
- `isActive` (boolean) - Active status (default: true)
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp
- `deletedAt` (Date, optional) - Soft deletion timestamp

**Key Relationships:**
- Has many UserAchievements

### UserAchievement

User-achievement relationship tracking earned achievements.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - Associated user
- `achievementId` (number) - Associated achievement
- `earnedAt` (Date) - Achievement earned timestamp
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to User
- Belongs to Achievement

## Core Services

### AchievementCatalogService

Achievement browsing and search functionality with caching.

**Key Methods:**
- `getAllAchievements(query)` - Get paginated achievements with category and rarity filtering
- `getAchievementDetails(achievementId)` - Get achievement with statistics (total earned, recent earners)
- `getAchievementCategories()` - Get unique achievement categories from database
- `getRarityLevels()` - Get unique rarity levels from database
- `searchAchievements(searchQuery, filters)` - Search achievements by title/description with filtering

### AchievementProgressService

Progress calculation and achievement award system.

**Key Methods:**
- `checkAchievementProgress(userId)` - Calculate progress toward all available achievements
- `claimAchievement(userId, achievementId)` - Manual achievement claiming with validation
- `checkAndAwardAchievement(userId, achievementId)` - Automatic achievement awarding
- `calculateAchievementProgress(userId, achievement)` - Calculate progress based on criteria type

**Achievement Criteria Support:**
- `manual` - Manual claiming with boolean flag
- `streak` - Streak-based with target days
- `milestone` - Milestone completion count
- `completion` - Path completion count  
- `social` - First friend or review count based

### UserAchievementService

User achievement queries and statistics.

**Key Methods:**
- `getUserAchievements(userId, query)` - Get user achievements with pagination and filtering
- `getRecentAchievements(userId)` - Get last 10 earned achievements
- `getUserStats(userId)` - Get comprehensive achievement statistics
- `getUserAchievementSummary(userId)` - Get compact summary for dashboards
- `getUserAchievementsByCategory(userId)` - Get achievements grouped by category
- `calculateUserStats(userId)` - Calculate user achievement statistics
- `getNextMilestones(userId)` - Find achievements near completion

### StreakManagementService

Core login streak management with intelligent auto-freeze.

**Key Methods:**
- `getStreakInfo(userId)` - Get current streak information
- `updateLoginStreak(userId, loginDate)` - Update streak on login with auto-freeze logic
- `validateSessionStreak(userId)` - Validate streak for saved sessions
- `resetStreak(userId)` - Manually reset streak (admin function)
- `recalculateLoginStreak(userId)` - Recalculate streak from login history
- `resetInactiveStreaks()` - Batch reset for inactive users (cron job)
- `checkAndApplyAutoFreeze(userId, daysMissed, currentStreak)` - Apply intelligent auto-freeze
- `checkStreakAchievements(userId, newStreak)` - Check streak milestone achievements

**Auto-freeze Logic:**
Automatically applies freezes for streaks ≥7 days when user has available freezes and misses days

### StreakFreezeService

Streak freeze management with user-tier limitations.

**Key Methods:**
- `getFreezeInfo(userId)` - Get freeze availability and limits
- `freezeStreak(userId)` - Apply manual streak freeze
- `isStreakFrozen(userId)` - Check current freeze status
- `autoApplyFreeze(userId, daysMissed, currentStreak)` - Apply automatic freeze
- `shouldAutoApplyFreeze(userId, daysMissed, currentStreak)` - Check auto-freeze eligibility

**Freeze Limits:**
- Free users: 2 per month, 10 lifetime
- Premium users: 5 per month, unlimited lifetime
- 24-hour freeze duration

### StreakAnalyticsService

Analytics and insights generation for streak data.

**Key Methods:**
- `getStreakHistory(userId, query)` - Get activity history for specified time periods
- `getActivityHeatmap(userId, query)` - Get heatmap data for calendar visualization
- `getStreakInsights(userId)` - Generate insights and recommendations
- `getStreakLeaderboard(limit)` - Get streak leaderboard
- `generateCompleteHeatmap(userId, startDate, endDate)` - Generate complete date range heatmap
- `generateStreakInsights(userId, history)` - Analyze patterns and generate recommendations

## Domain Events

### Published Events

The domain publishes events for cross-domain communication:

- `achievement.added` - Achievement earned by user (includes userId, achievementId, achievement details)
- `user.streakUpdated` - Streak value changed (includes userId, newStreak, previousStreak)
- `user.streakFrozen` - Streak frozen by user (includes userId, streakValue, freezeSource)
- `user.autoFreezeApplied` - Auto-freeze applied to save streak (includes userId, streakValue, daysSaved)
- `user.streakLost` - Streak lost due to inactivity (includes userId, previousStreak, daysMissed)
- `user.streakReset` - Streak manually reset (includes userId, previousStreak, resetBy)

### Consumed Events

The domain consumes external events through dedicated subscribers:

#### Achievement Subscriber Events
- `user.streakUpdated` - Check streak achievements when streak changes
- `user.userCompletedMilestone` - Check milestone achievements when milestone completed
- `user.userCompletedPath` - Check completion achievements when path completed
- `social.pathReviewed` - Check social review achievements when path reviewed
- `userRelationship.friendAdded` - Check first friend achievement when friend added

#### Login Streak Subscriber Events
- `user.signIn` - Update login streak when user signs in
- `user.sessionValidated` - Validate session streak for activity tracking
- `user.signOut` - Log logout events (no streak impact)
- `user.reactivateAccount` - Log account reactivation
- `user.streakFrozen` - Log freeze events for analytics
- `user.autoFreezeApplied` - Log auto-freeze events for analytics
- `user.streakLost` - Log streak loss events for analytics
- `user.streakUpdated` - Log streak updates for analytics

#### Analytics Activity Subscriber Events
- `analytics.activity.newDayLogin` - Process new day login events from analytics
- `analytics.activity.recorded` - Process milestone activity recordings

## Usage Examples

### Achievement Management

```typescript
import { AchievementProgressService, UserAchievementService } from '@domains/gamification';

const progressService = Container.get(AchievementProgressService);
const userService = Container.get(UserAchievementService);

// Check user's progress toward all achievements
const progress = await progressService.checkAchievementProgress(userId);

// Manually claim an eligible achievement
const claimResult = await progressService.claimAchievement(userId, achievementId);

// Get user's achievement statistics
const stats = await userService.getUserStats(userId);

// Get recent achievements for notifications
const recent = await userService.getRecentAchievements(userId);
```

### Streak Management

```typescript
import { StreakManagementService, StreakFreezeService } from '@domains/gamification';

const streakService = Container.get(StreakManagementService);
const freezeService = Container.get(StreakFreezeService);

// Update login streak (with auto-freeze logic)
const streakInfo = await streakService.updateLoginStreak(userId, new Date());

// Apply manual streak freeze
const freezeResult = await freezeService.freezeStreak(userId);

// Get freeze availability information
const freezeInfo = await freezeService.getFreezeInfo(userId);

// Validate session streak
const sessionValid = await streakService.validateSessionStreak(userId);
```

### Analytics and Insights

```typescript
import { StreakAnalyticsService } from '@domains/gamification';

const analyticsService = Container.get(StreakAnalyticsService);

// Get activity heatmap for calendar
const heatmap = await analyticsService.getActivityHeatmap(userId, {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Get streak insights and recommendations
const insights = await analyticsService.getStreakInsights(userId);

// Get streak leaderboard
const leaderboard = await analyticsService.getStreakLeaderboard(50);

// Get streak history
const history = await analyticsService.getStreakHistory(userId, {
  period: 'monthly',
  months: 6
});
```

### Achievement Catalog

```typescript
import { AchievementCatalogService } from '@domains/gamification';

const catalogService = Container.get(AchievementCatalogService);

// Search achievements
const searchResults = await catalogService.searchAchievements('milestone', {
  category: 'learning',
  rarity: 'rare'
});

// Get achievement categories
const categories = await catalogService.getAchievementCategories();

// Get achievement details with stats
const details = await catalogService.getAchievementDetails(achievementId);
```

## Business Rules

### Achievement Rules

- One achievement per user - duplicate awards prevented by database constraints
- Manual achievements require user claiming action via API
- Automatic achievements awarded through event processing
- Point values vary by rarity: common (10), uncommon (25), rare (50), epic (100), legendary (200)
- Deactivated achievements hidden from catalog but earned ones remain in user records

### Achievement Criteria Types

- **Manual**: Boolean flag for manual claiming
- **Streak**: Target streak days requirement
- **Milestone**: Milestone completion count requirement
- **Completion**: Path completion count requirement
- **Social**: First friend flag or review count requirement

### Streak Management Rules

- Daily login required to maintain streak (user's local timezone)
- Auto-freeze protection applies for streaks ≥7 days when freezes available
- Missed day breaks streak unless frozen or auto-freeze applied
- Streak calculations based on user's login history
- Admin functions allow manual streak reset and recalculation

### Freeze System Rules

- **Free Users**: 2 freezes per month, 10 lifetime maximum
- **Premium Users**: 5 freezes per month, unlimited lifetime
- 24-hour freeze duration covers missed day
- Auto-freeze intelligently applied when beneficial to user
- Freeze status tracked with timestamps and expiration

### Access Control Rules

- **Public Endpoints**: Achievement catalog, search, categories
- **Mobile Only**: Progress tracking, claiming, streak management, user achievements
- **Admin Only**: Streak reset, recalculation, batch operations
- User isolation enforced - users access only own data

## External Interfaces

The domain defines comprehensive interfaces for cross-domain integration:

### User Management Integration

- `IGamificationUser` - User entity contract for gamification
- `IUserRepository` - User data access interface

### Analytics Integration

- `IActivityHeatmapEntry` - Heatmap data structure
- `IAnalyticsRepository` - Activity data access interface

### Progress Tracking Integration

- `IPathEnrollment` - Path enrollment interface
- `IEnrollmentMilestoneProgress` - Milestone progress interface
- `IProgressTrackingService` - Progress data access service

### Social Integration

- `IPathReview` - Review entity interface
- `IUserRelationship` - Friend relationship interface
- `ISocialRepository` - Social data access interface

### Notification Integration

- `INotificationService` - Achievement notification service
- `INotificationPayload` - Notification data contract

## Performance Optimizations

### Caching Strategy

Different cache levels based on data volatility and access patterns:

- **Achievement catalog**: 1 hour (stable data, high read volume)
- **Achievement details**: 30 minutes (occasional updates)
- **Meta information**: 1 hour (categories, rarities - rarely change)
- **Search results**: 30 minutes (dynamic but predictable)
- **User achievements**: User-specific cache (5 minutes)
- **User stats**: User-specific cache (personal data with frequent access)
- **Leaderboards**: No caching (real-time competitive data)

### Database Optimization

- Compound indexes on user-achievement relationships
- Paranoid deletion for achievements maintains referential integrity
- Efficient pagination with limit/offset queries
- Batch processing for achievement eligibility checks
- Connection pooling across domain services

### Query Optimization

- Eager loading for achievement details with statistics
- Selective field loading for API responses
- Efficient counting queries for statistics
- Optimized heatmap data generation with date range queries
- Batch achievement progress calculations

## Event Processing Architecture

### Subscriber Design

- **AchievementSubscriber**: Processes achievement-worthy events
- **LoginStreakSubscriber**: Handles streak-related events
- **AnalyticsActivitySubscriber**: Processes activity tracking events

### Event Flow

1. External domains publish events (user login, milestone completion, etc.)
2. Domain subscribers process events asynchronously
3. Achievement eligibility calculated and awards processed
4. Domain publishes achievement/streak events
5. Notifications and analytics domains consume published events

### Error Handling

- Event processing failures logged with full context
- Retry mechanisms for transient failures
- Dead letter queues for persistent failures
- Idempotent event processing prevents duplicate awards

## Security and Validation

### Input Validation

- Achievement ID validation as positive integer
- User authentication required for all personal data access
- Parameter sanitization for search queries
- Rate limiting on achievement claiming endpoints

### Data Protection

- User data isolation through query filtering
- Admin operations require elevated permissions
- Achievement criteria validation before award processing
- Audit trails for all achievement awards and streak changes

### Business Logic Integrity

- Duplicate achievement prevention through database constraints
- Streak calculation validation against login history
- Freeze limit enforcement based on user tier
- Achievement criteria consistency validation

## Configuration

### Domain Registration

```typescript
import { registerGamificationDomain } from '@domains/gamification';

registerGamificationDomain({
  userRepository: userRepo,
  eventDispatcher: eventBus,
  configService: config,
  notificationService: notifications,
  analyticsRepository: analytics,
  progressTrackingService: progress,
  socialRepository: social
});
```

### Environment Variables

```bash
# Streak Configuration
STREAK_FREEZE_LIMIT_FREE=2
STREAK_FREEZE_LIMIT_PREMIUM=5
STREAK_AUTO_FREEZE_MIN_DAYS=7

# Achievement Configuration  
ACHIEVEMENT_NOTIFICATION_ENABLED=true
ACHIEVEMENT_LEADERBOARD_CACHE_MINUTES=60

# Analytics Configuration
STREAK_ANALYTICS_RETENTION_DAYS=365
```