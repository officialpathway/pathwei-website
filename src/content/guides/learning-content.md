# Learning Content Domain

> Comprehensive learning path creation, milestone management, and educational content discovery system

## Overview

The Learning Content domain manages the complete lifecycle of educational content including learning paths, structured milestones, assessment systems, and social interactions. It provides robust tools for content creators and learners with comprehensive discovery, review, and commenting systems while maintaining strict ownership controls and enrollment-based permissions.

## Domain Boundaries

### Responsibilities

- Learning path creation and management with visibility controls
- Structured milestone system with four types (lesson, practice, assessment, project)
- Question and answer assessment system
- Path categorization and hierarchical organization
- Social interaction system (comments, replies, likes, reviews, favorites)
- Content discovery with search, filtering, trending, and recommendations
- Path analytics and creator insights
- Bulk operations and path duplication

### What It Does NOT Handle

- User enrollment and progress tracking (handled by Progress Tracking domain)
- Achievement and reward systems (handled by Gamification domain)
- Email notifications (handled by Notifications domain)
- User authentication (handled by User Management domain)

### Dependencies

- **User Management**: User authentication and profile data
- **Progress Tracking**: Path enrollment status and completion tracking
- **Gamification**: Achievement notifications and user stats
- **Notifications**: Activity alerts and social interaction notifications

## Architecture

```
src/domains/learning-content/
├── controllers/
│   ├── milestone-management.controller.ts      # Milestone CRUD operations
│   ├── path-category.controller.ts            # Category management (Admin only)
│   ├── path-comment-management.controller.ts  # Comments and social interactions
│   ├── path-discovery.controller.ts           # Search and content discovery
│   ├── path-management.controller.ts          # Path creation and ownership
│   └── path-reviews.controller.ts             # Reviews and favorites
├── services/
│   ├── milestone-management.service.ts         # Milestone business logic
│   ├── path-category.service.ts               # Category management
│   ├── path-comment-management.service.ts     # Comment system with permissions
│   ├── path-discovery.service.ts              # Search and recommendation engine
│   ├── path-management.service.ts             # Path lifecycle management
│   └── path-reviews..service.ts               # Reviews and favorites system
├── models/
│   ├── path.model.ts                          # Main path model
│   ├── path-category.model.ts                 # Category hierarchy
│   ├── milestone.model.ts                     # Milestone with types
│   ├── question.model.ts                      # Assessment questions
│   ├── answer.model.ts                        # Multiple choice answers
│   ├── path-review.model.ts                   # User reviews and ratings
│   ├── path-favorite.model.ts                 # User favorites
│   ├── path-comment.model.ts                  # Comments with nesting
│   ├── path-comment-like.model.ts             # Comment likes
│   ├── associations.ts                        # All model relationships
│   └── index.ts                              # Model exports
├── interfaces/
│   ├── external.interfaces.ts                 # Cross-domain contracts
│   └── internal.interfaces.ts                 # Internal domain types
├── subscribers/
│   └── path.subscriber.ts                     # Domain event handlers
├── learning-content.domain.ts                 # Domain configuration
└── index.ts                                  # Public API exports
```

## API Endpoints

### Path Management (`/path-management`)

- `GET /health` - Health check endpoint
- `POST /` - Create new learning path (Mobile Only)
- `POST /create-with-milestones` - Create path with milestones in transaction (Mobile Only)
- `GET /my-paths` - Get user's created paths with enrollment info (Mobile Only)
- `PUT /:pathId` - Update path properties (Mobile Only)
- `DELETE /:pathId` - Delete path (Mobile Only)
- `PUT /:pathId/publish` - Publish path to public (Mobile Only)
- `PUT /:pathId/unpublish` - Unpublish path to private (Mobile Only)
- `POST /:pathId/duplicate` - Duplicate path with all milestones (Mobile Only)
- `GET /:pathId/analytics` - Get path analytics for creator (Mobile Only)

### Path Discovery (`/path-discovery`)

- `GET /health` - Health check endpoint
- `GET /search` - Search paths with advanced filters (Public, cached)
- `GET /categories` - Get all active categories (Public)
- `GET /featured` - Get featured paths (Public, cached)
- `GET /trending` - Get trending paths from last 30 days (Public, cached)
- `GET /recommended` - Get personalized recommendations (Public, cached)
- `GET /:pathId` - Get detailed path information (Public)

### Milestone Management (`/milestone-management`)

- `GET /health` - Health check endpoint
- `POST /path/:pathId` - Create new milestone in path (Mobile Only)
- `GET /path/:pathId` - Get all milestones for path (Public)
- `GET /:milestoneId` - Get milestone details with questions (Public)
- `PUT /:milestoneId` - Update milestone properties (Mobile Only)
- `DELETE /:milestoneId` - Delete milestone (Mobile Only)
- `PUT /:milestoneId/reorder` - Reorder milestone within path (Mobile Only)
- `POST /:milestoneId/duplicate` - Duplicate milestone (Mobile Only)
- `POST /path/:pathId/bulk` - Bulk create multiple milestones (Mobile Only)

### Path Reviews (`/path-reviews`)

- `GET /health` - Health check endpoint
- `POST /paths/:pathId/favorite` - Toggle path favorite status (Mobile Only)
- `POST /paths/:pathId` - Add review to path (Mobile Only, enrollment required)
- `PUT /paths/:pathId` - Update existing review (Mobile Only)
- `DELETE /paths/:pathId` - Delete user's review (Mobile Only)
- `GET /paths/:pathId` - Get all path reviews with pagination (Public)
- `GET /paths/:pathId/my` - Get user's review for path (Mobile Only)
- `POST /:reviewId/vote` - Vote review as helpful/unhelpful (Mobile Only)
- `GET /paths/:pathId/summary` - Get interaction summary (favorite/review status) (Mobile Only)

### Path Comments (`/path-comments`)

- `GET /health` - Health check endpoint
- `GET /paths/:pathId` - Get path comments with pagination (Public)
- `POST /paths/:pathId` - Add comment to path (Mobile Only, enrollment required)
- `GET /:commentId` - Get single comment with replies (Public)
- `PUT /:commentId` - Edit comment (one-time edit, Mobile Only)
- `DELETE /:commentId` - Delete comment (Mobile Only)
- `POST /:commentId/like` - Toggle comment like (Mobile Only)
- `POST /:commentId/reply` - Reply to comment (Mobile Only)
- `GET /paths/:pathId/permissions` - Check user comment permissions (Mobile Only)

### Category Management (`/admin/categories`)

- `GET /health` - Health check endpoint (Admin Only)
- `GET /` - Get all categories with hierarchy (Admin Only)
- `POST /` - Create new category (Admin Only)
- `PUT /:id` - Update category properties (Admin Only)
- `DELETE /:id` - Delete category (Admin Only)

## Data Models

### Path

Main learning path model with comprehensive metadata and tracking.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - Path creator
- `categoryId` (number) - Associated category
- `title` (string) - Path title (max 255 chars)
- `description` (text) - Path description
- `milestoneCount` (number) - Number of milestones (auto-calculated)
- `enrollmentCount` (number) - Number of enrolled users
- `visibility` (enum) - "public", "private", "unlisted"
- `difficultyLevel` (enum) - "beginner", "intermediate", "advanced"
- `estimatedDays` (number) - Estimated completion time
- `avgRating` (decimal) - Average rating (3,2 precision)
- `ratingCount` (number) - Total number of ratings
- `isFeatured` (boolean) - Featured status
- `language` (string) - Content language (default: "en")
- `hasTest` (boolean) - Has assessment milestones
- `isAiGenerated` (boolean) - AI-generated content flag
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp
- `deletedAt` (Date) - Soft deletion timestamp

**Key Relationships:**
- Belongs to User (creator)
- Belongs to PathCategory
- Has many Milestones
- Has many PathReviews
- Has many PathFavorites
- Has many PathComments
- Has many PathEnrollments (cross-domain)

### Milestone

Structured learning milestone with type-based functionality.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - Milestone creator
- `pathId` (number) - Associated path
- `title` (string) - Milestone title
- `description` (text) - Milestone description
- `displayOrder` (number) - Order within path
- `durationDays` (number) - Duration (default: 7)
- `milestoneType` (enum) - "lesson", "practice", "assessment", "project"
- `resourcesJson` (text) - JSON resources data
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp
- `deletedAt` (Date) - Soft deletion timestamp

**Key Relationships:**
- Belongs to Path
- Belongs to User (creator)
- Has many Questions
- Has many EnrollmentMilestoneProgress (cross-domain)

### PathCategory

Hierarchical category system for path organization.

**Fields:**
- `id` (number) - Primary key
- `name` (string) - Category name (max 100 chars)
- `description` (text) - Category description
- `icon` (string) - Icon identifier
- `color` (string) - Color code (7 chars)
- `isActive` (boolean) - Active status
- `isTestable` (boolean) - Testable category flag
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp
- `deletedAt` (Date) - Soft deletion timestamp

**Key Relationships:**
- Has many Paths
- Self-referencing hierarchy (parent/children)

### Question

Assessment questions linked to assessment milestones.

**Fields:**
- `id` (number) - Primary key
- `milestoneId` (number) - Associated milestone
- `questionText` (text) - Question content
- `questionType` (string) - Question type
- `displayOrder` (number) - Order within milestone
- `points` (number) - Point value
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to Milestone
- Has many Answers

### Answer

Multiple choice answers for assessment questions.

**Fields:**
- `id` (number) - Primary key
- `questionId` (number) - Associated question
- `answerText` (text) - Answer content
- `isCorrect` (boolean) - Correct answer flag
- `explanation` (text) - Answer explanation
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to Question

### PathReview

User reviews and ratings for paths.

**Fields:**
- `id` (number) - Primary key
- `pathId` (number) - Associated path
- `userId` (number) - Reviewer
- `rating` (number) - Rating (1-5)
- `reviewText` (text) - Review content
- `isVerifiedCompletion` (boolean) - Verified completion flag
- `helpfulVotes` (number) - Helpful vote count
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to Path
- Belongs to User

### PathFavorite

User favorites for paths.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - User who favorited
- `pathId` (number) - Favorited path
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to User
- Belongs to Path

### PathComment

Hierarchical comment system with one-level nesting.

**Fields:**
- `id` (number) - Primary key
- `pathId` (number) - Associated path
- `userId` (number) - Commenter
- `parentCommentId` (number, optional) - Parent comment for replies
- `content` (text) - Comment content
- `isEdited` (boolean) - Edit status flag
- `editedAt` (Date, optional) - Last edit timestamp
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to Path
- Belongs to User
- Self-referencing (parent/replies)
- Has many PathCommentLikes

### PathCommentLike

Like system for comments.

**Fields:**
- `id` (number) - Primary key
- `userId` (number) - User who liked
- `commentId` (number) - Liked comment
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

**Key Relationships:**
- Belongs to User
- Belongs to PathComment

## Core Services

### PathManagementService

Comprehensive path lifecycle management with ownership validation.

**Key Methods:**
- `createPath(userId, pathData)` - Create new learning paths
- `createPathWithMilestones(userId, pathData, milestonesData)` - Atomic path+milestones creation
- `getUserPaths(userId)` - Get user's created paths with enrollment info
- `updatePath(userId, pathId, updateData)` - Update path properties with restrictions
- `deletePath(userId, pathId)` - Delete paths with enrollment validation
- `publishPath(userId, pathId)` - Publish paths to public visibility
- `unpublishPath(userId, pathId)` - Unpublish paths to private
- `duplicatePath(userId, pathId, newTitle)` - Complete path duplication
- `getPathAnalytics(userId, pathId)` - Creator analytics and insights

### PathDiscoveryService

Advanced search and recommendation engine with caching.

**Key Methods:**
- `searchPaths(query, userId)` - Multi-criteria path search
- `getCategories()` - Get all active categories for filtering
- `getFeaturedPaths()` - Get curated featured paths
- `getTrendingPaths()` - Get trending paths (30-day window)
- `getPathDetails(pathId)` - Detailed path information with stats
- `getRecommendedPaths(userId, limit)` - Personalized recommendations

### MilestoneManagementService

Milestone CRUD operations with path ownership validation.

**Key Methods:**
- `createMilestone(userId, pathId, milestoneData)` - Create new milestones
- `getPathMilestones(pathId)` - Get ordered milestone list
- `getMilestoneDetails(milestoneId)` - Get milestone with questions
- `updateMilestone(userId, milestoneId, updateData)` - Update milestone properties
- `deleteMilestone(userId, milestoneId)` - Delete milestones with validation
- `reorderMilestone(userId, milestoneId, newOrder)` - Reorder milestones
- `duplicateMilestone(userId, milestoneId)` - Duplicate milestones
- `bulkCreateMilestones(userId, pathId, milestonesData)` - Bulk creation

### PathReviewsService

Review and favorite system with enrollment validation.

**Key Methods:**
- `toggleFavorite(userId, pathId)` - Toggle favorite status
- `addReview(userId, pathId, reviewData)` - Add reviews (enrollment required)
- `getPathReviews(pathId, query)` - Paginated reviews with statistics
- `updateReview(userId, pathId, reviewData)` - Update existing reviews
- `deleteReview(userId, pathId)` - Delete user reviews
- `voteReviewHelpful(userId, reviewId, helpful)` - Vote on review helpfulness
- `getUserReview(userId, pathId)` - Get user's specific review
- `getInteractionSummary(userId, pathId)` - Get favorite/review status

### PathCommentManagementService

Comment system with enrollment-based permissions and nesting.

**Key Methods:**
- `getPathComments(pathId, userId, query)` - Paginated comments with likes
- `addComment(pathId, userId, data)` - Add comments and replies
- `getComment(commentId)` - Get single comment details
- `editComment(commentId, userId, data)` - Edit comments (one-time only)
- `deleteComment(commentId, userId)` - Delete comments with ownership validation
- `toggleLike(commentId, userId)` - Like/unlike comments
- `canUserInteract(pathId, userId)` - Check commenting permissions

### PathCategoryService

Category management for administrators.

**Key Methods:**
- `createPathCategory(categoryData)` - Create new categories
- `getPathCategories()` - Get all active categories with hierarchy
- `updatePathCategory(categoryId, updates)` - Update category properties
- `deletePathCategory(categoryId)` - Delete categories

## Domain Events

### Published Events

The domain publishes events for cross-domain communication:

- `learning-content.path.created` - New path created
- `learning-content.path.updated` - Path properties updated
- `learning-content.path.published` - Path published to public
- `learning-content.path.liked` - Path favorited by user
- `learning-content.path.reviewed` - New review added
- `learning-content.milestone.created` - New milestone created
- `learning-content.milestone.updated` - Milestone properties updated
- `learning-content.milestone.completed` - Milestone marked complete
- `learning-content.comment.created` - New comment added
- `learning-content.comment.liked` - Comment liked by user
- `learning-content.category.created` - New category created
- `learning-content.category.updated` - Category properties updated

### Consumed Events

The domain consumes external events through subscribers:

- User deletion events for content cleanup
- Progress tracking events for milestone completion
- Gamification events for achievement integration

## Usage Examples

### Creating Learning Paths

```typescript
import { PathManagementService } from '@domains/learning-content';

const pathService = Container.get(PathManagementService);

// Create simple path
const result = await pathService.createPath(userId, {
  categoryId: 1,
  title: 'JavaScript Fundamentals',
  description: 'Complete guide to JavaScript basics',
  difficultyLevel: 'beginner',
  estimatedDays: 21,
  visibility: 'private',
  language: 'en'
});

// Create path with milestones atomically
const pathWithMilestones = await pathService.createPathWithMilestones(userId, pathData, [
  {
    title: 'Variables and Data Types',
    description: 'Understanding JavaScript fundamentals',
    milestoneType: 'lesson',
    displayOrder: 1,
    duration: 7,
    resourcesJson: JSON.stringify({ links: [...], exercises: [...] })
  },
  {
    title: 'Functions Quiz',
    description: 'Test your function knowledge',
    milestoneType: 'assessment',
    displayOrder: 2,
    duration: 3
  }
]);
```

### Search and Discovery

```typescript
import { PathDiscoveryService } from '@domains/learning-content';

const discoveryService = Container.get(PathDiscoveryService);

// Advanced path search
const searchResults = await discoveryService.searchPaths({
  query: 'react hooks',
  categoryId: 1,
  difficultyLevel: 'intermediate',
  minRating: 4.0,
  sortBy: 'popularity',
  sortOrder: 'desc',
  page: 1,
  limit: 20
}, userId);

// Get trending content
const trendingPaths = await discoveryService.getTrendingPaths();

// Get personalized recommendations
const recommendations = await discoveryService.getRecommendedPaths(userId, 10);
```

### Social Interactions

```typescript
import { PathReviewsService, PathCommentManagementService } from '@domains/learning-content';

const reviewService = Container.get(PathReviewsService);
const commentService = Container.get(PathCommentManagementService);

// Add review (requires enrollment)
await reviewService.addReview(userId, pathId, {
  rating: 5,
  reviewText: 'Excellent learning path! Clear explanations and great exercises.',
  isVerifiedCompletion: true
});

// Toggle favorite
await reviewService.toggleFavorite(userId, pathId);

// Add comment (requires enrollment)
await commentService.addComment(pathId, userId, {
  content: 'Great explanation in milestone 3! Really helped me understand the concept.'
});

// Reply to comment
await commentService.addComment(pathId, userId, {
  content: 'Glad it helped! Check out the additional resources I linked.',
  parentCommentId: commentId
});
```

### Milestone Management

```typescript
import { MilestoneManagementService } from '@domains/learning-content';

const milestoneService = Container.get(MilestoneManagementService);

// Create assessment milestone with questions
const milestone = await milestoneService.createMilestone(userId, pathId, {
  title: 'React Hooks Assessment',
  description: 'Test your understanding of React Hooks',
  milestoneType: 'assessment',
  displayOrder: 3,
  durationDays: 2,
  resourcesJson: JSON.stringify({
    questions: [
      {
        text: 'What is the purpose of useEffect?',
        type: 'multiple_choice',
        answers: [
          { text: 'Handle side effects', isCorrect: true },
          { text: 'Create state variables', isCorrect: false }
        ]
      }
    ]
  })
});

// Bulk create milestones
const milestones = await milestoneService.bulkCreateMilestones(userId, pathId, [
  { title: 'Intro', milestoneType: 'lesson', displayOrder: 1 },
  { title: 'Practice', milestoneType: 'practice', displayOrder: 2 },
  { title: 'Project', milestoneType: 'project', displayOrder: 3 }
]);
```

## Business Rules

### Path Management Rules

- Only path creators can edit, delete, publish, or unpublish their paths
- Paths must have at least one milestone before publishing to public visibility
- Published paths with active enrollments have restricted editing capabilities
- Path duplication preserves milestone structure but creates new ownership
- Path analytics are only available to the creator

### Milestone Rules

- Milestones support four types: lesson, practice, assessment, project
- Display order must be unique within each path
- Assessment milestones can contain questions and answers
- Milestone resources are stored as JSON for flexibility
- Bulk operations maintain transactional integrity

### Social Interaction Rules

- Users must be enrolled in a path to comment or review
- Comments support one level of nesting (replies only)
- Comments can be edited once after creation
- Reviews require enrollment and can be updated/deleted by reviewer
- Like systems prevent duplicate likes from same user

### Visibility and Access Rules

- **Public**: Discoverable in search, accessible to all users
- **Private**: Only visible to creator, no discovery
- **Unlisted**: Accessible via direct link, no search visibility
- Enrollment status determines commenting and review permissions
- Category hierarchy supports nested organization

### Content Quality Rules

- All user content is subject to input sanitization
- Path titles limited to 255 characters
- Review ratings must be between 1-5
- Comment editing has time/frequency restrictions
- Spam detection and prevention mechanisms active

## External Interfaces

The domain defines comprehensive interfaces for cross-domain integration:

### User Management Integration

- `ILearningUser` - User entity contract for content ownership
- `IUserRepository` - User data access interface

### Progress Tracking Integration

- `IPathEnrollment` - Enrollment status interface
- `IProgressTrackingService` - Progress and enrollment management

### Gamification Integration

- `IAchievement` - Achievement entity contract
- `IGamificationService` - Achievement notification service

### Notification Integration

- `INotificationService` - Activity notification service
- `INotificationPayload` - Notification data contract

## Access Control and Security

### Endpoint Security

- **Public Endpoints**: Path discovery, content viewing, search
- **Mobile Only**: Content creation, editing, social interactions
- **Admin Only**: Category management operations
- Authentication required for all user-specific operations

### Permission Validation

- Path ownership validation for all edit operations
- Enrollment verification for commenting and reviews
- Creator-only access to analytics and management features
- Cross-domain permission checks via external services

### Data Protection

- Input sanitization for all user-generated content
- XSS prevention in descriptions and comments
- Rate limiting on content creation endpoints
- Structured error responses without sensitive data exposure

## Performance Optimizations

### Caching Strategy

Different cache durations based on data volatility:

- **Path discovery results**: 15 minutes
- **Featured paths**: 1 hour  
- **Trending paths**: 30 minutes
- **Category lists**: 2 hours
- **Search results**: 5 minutes

### Database Optimization

- Comprehensive indexing strategy for search performance
- Eager loading for complex relationship queries
- Pagination for all list operations
- Efficient counting queries for statistics

### Query Optimization

- Optimized search queries with proper indexing
- Minimal data transfer with selective field loading
- Bulk operations for milestone creation
- Efficient recommendation algorithms