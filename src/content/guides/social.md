# Social Domain

> Domain for social interactions, posts, friendships, and engagement

## Overview

The Social domain handles social interactions including user posts, automated system posts, friendship management, social feed curation, and post engagement features. This domain provides comprehensive social networking capabilities with privacy controls, content visibility management, and cross-domain integration for gamification and learning content.

## Domain Boundaries

### Responsibilities

- ✅ **User Post Management**: Creation, updating, and deletion of user-generated text posts
- ✅ **Auto Post Generation**: System-generated posts for achievements, milestones, and path completions
- ✅ **Post Engagement**: Like/unlike functionality and comment system with nested replies
- ✅ **Friendship System**: Friend requests, acceptance, and relationship management
- ✅ **Social Feed**: Personalized feed curation based on friendships and content visibility
- ✅ **Privacy Controls**: Content visibility (public, friends, private) and access management
- ✅ **Social Notifications**: Notifications for likes, comments, friend requests, and social activities

### External Dependencies

- **User Management Domain**: User profiles and authentication
- **Notifications Domain**: Social activity notifications and alerts
- **Gamification Domain**: Achievement and milestone data for auto-posts
- **Learning Content Domain**: Path and milestone data for auto-posts

## Architecture

```
src/domains/social/
├── controllers/              # HTTP request handlers
│   ├── user-post.controller.ts
│   ├── auto-post.controller.ts
│   ├── social-feed.controller.ts
│   ├── friends.controller.ts
│   └── friend-requests.controller.ts
├── services/                # Business logic
│   ├── user-post.service.ts
│   ├── auto-post.service.ts
│   ├── social-feed.service.ts
│   ├── friends.service.ts
│   └── friend-requests.service.ts
├── models/                  # Data models
│   ├── post.model.ts
│   ├── post-like.model.ts
│   ├── post-comment.model.ts
│   ├── user-relationship.model.ts
│   ├── associations.ts
│   └── index.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── social.validators.ts
├── dtos/                # Data transfer objects
│   └── social.dtos.ts
├── social.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### User Posts Management

- `GET /user-posts/health` - Health check endpoint
- `POST /user-posts/` - Create new user post
- `PUT /user-posts/:postId` - Update user post
- `DELETE /user-posts/:postId` - Delete user post
- `POST /user-posts/:postId/like` - Toggle post like/unlike
- `POST /user-posts/:postId/comments` - Add comment to post
- `GET /user-posts/:postId/comments` - Get post comments with pagination
- `GET /user-posts/my-posts` - Get current user's posts
- `GET /user-posts/from-user/:userId` - Get posts from specific user

### Social Feed

- `GET /social-feed` - Get personalized social feed
- `GET /social-feed/posts/:postId` - Get specific post details
- `GET /social-feed/trending` - Get trending posts
- `GET /social-feed/stats` - Get feed analytics and statistics

### Friends Management

- `GET /friends` - Get user's friends list
- `GET /friends/requests/pending` - Get pending friend requests
- `GET /friends/requests/sent` - Get sent friend requests
- `POST /friends/:userId/request` - Send friend request
- `PUT /friends/:userId/accept` - Accept friend request
- `DELETE /friends/:userId/decline` - Decline or cancel friend request
- `DELETE /friends/:userId` - Remove friend
- `GET /friends/:userId/status` - Check friendship status
- `POST /friends/status/batch` - Batch check friendship status
- `GET /friends/stats` - Get friendship statistics
- `GET /friends/search` - Search friends

### Auto Posts (System Generated)

- `GET /auto-posts/health` - Auto post service health check
- `GET /auto-posts/status` - Auto post service status

## Models

### Post

```typescript
interface Post {
  id: number;
  userId: number;
  content: string;
  postType: 'text' | 'achievement' | 'milestone_completion' | 'path_completion' | 'path_started' | 'media';
  relatedEntityType?: string;
  relatedEntityId?: number;
  visibility: 'public' | 'friends' | 'private';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### PostLike

```typescript
interface PostLike {
  id: number;
  userId: number;
  postId?: number; // null when liking comments
  commentId?: number; // null when liking posts
  createdAt: Date;
  updatedAt: Date;
}
```

### PostComment

```typescript
interface PostComment {
  id: number;
  postId: number;
  userId: number;
  parentCommentId?: number;
  content: string;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### UserRelationship

```typescript
interface UserRelationship {
  id: number;
  requesterUserId: number;
  addresseeUserId: number;
  relationshipStatus: 'pending' | 'accepted' | 'blocked' | 'declined';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

## Events

### Domain Events Published

- `social.post.created` - New post created (user or auto-generated)
- `social.post.updated` - Post content or visibility updated
- `social.post.deleted` - Post removed by user
- `social.post.liked` - Post received a like
- `social.post.unliked` - Post like removed
- `social.comment.created` - New comment added to post
- `social.comment.liked` - Comment received a like
- `social.friend.requested` - Friend request sent
- `social.friend.accepted` - Friend request accepted
- `social.friend.removed` - Friendship ended

### External Events Consumed

- `gamification.achievement.earned` - Creates achievement auto-post
- `learning-content.milestone.completed` - Creates milestone completion auto-post
- `learning-content.path.completed` - Creates path completion auto-post
- `learning-content.path.started` - Creates path started auto-post
- `gamification.streak.milestone` - Creates streak celebration auto-post

## Business Rules

### Post Rules

- **User Post Content**: Must be 1-2000 characters for posts, 1-500 characters for comments
- **Post Types**: User posts are always 'text' type, auto-posts have specific types
- **Post Ownership**: Only post owner can edit/delete user posts
- **Auto-Post Protection**: Auto-generated posts cannot be edited or deleted by users
- **Post Visibility**: Three levels - public, friends, private with appropriate access control

### Friendship Rules

- **Bidirectional System**: Friendships are mutual relationships between users
- **Request Workflow**: pending → accepted → active friendship
- **Development Mode**: Auto-accepts friend requests for testing
- **Production Mode**: Manual acceptance required for all friend requests
- **Unlimited Friends**: No limit on the number of friends a user can have

### Visibility Rules

- **Public Posts**: Visible to everyone in feeds and user profiles
- **Friends Posts**: Only visible to accepted friends
- **Private Posts**: Only visible to the post author
- **Comment Visibility**: Inherits post visibility rules
- **Feed Filtering**: Content filtered based on friendship status and visibility

## Usage Examples

### Creating a User Post

```typescript
import { UserPostService } from "@domains/social";

const userPostService = Container.get(UserPostService);
const result = await userPostService.createUserPost({
  userId: 123,
  content: "Just completed my first React course!",
  visibility: "public"
});

if (result.success) {
  console.log("Post created:", result.data.post);
}
```

### Sending Friend Request

```typescript
import { FriendRequestsService } from "@domains/social";

const friendRequestsService = Container.get(FriendRequestsService);
const result = await friendRequestsService.sendRequest(userId, targetUserId);

if (result.success) {
  console.log("Friend request sent");
}
```

### Getting Social Feed

```typescript
import { SocialFeedService } from "@domains/social";

const socialFeedService = Container.get(SocialFeedService);
const feed = await socialFeedService.getFeed(userId, {
  page: 1,
  limit: 20,
  type: "all"
});

console.log("Feed posts:", feed.posts);
```

### Auto-Post Generation

```typescript
import { AutoPostService } from "@domains/social";

// This happens automatically via event subscribers
const autoPostService = Container.get(AutoPostService);
await autoPostService.createAchievementPost(userId, achievementId);
```

## Configuration

### Domain Registration

```typescript
import { registerSocialDomain } from "@domains/social";

registerSocialDomain({
  userRepository: userRepository,
  eventDispatcher: eventBus,
  configService: config,
  notificationService: notificationService,
  userAchievementRepository: userAchievementRepository, // optional
  achievementRepository: achievementRepository, // optional
  pathRepository: pathRepository, // optional
  milestoneRepository: milestoneRepository, // optional
});
```

### Environment Variables

```bash
# Social Domain Configuration
SOCIAL_MAX_POST_LENGTH=2000
SOCIAL_MAX_COMMENT_LENGTH=500
SOCIAL_DEFAULT_VISIBILITY=public
SOCIAL_POST_CACHE_TTL_SECONDS=900

# Friendship Configuration
SOCIAL_AUTO_ACCEPT_FRIENDS=false
SOCIAL_MAX_FRIEND_REQUESTS_PER_DAY=50
SOCIAL_FRIEND_RELATIONSHIP_CACHE_TTL=1800

# Feed Configuration
SOCIAL_FEED_DEFAULT_PAGE_SIZE=20
SOCIAL_FEED_MAX_PAGE_SIZE=100
SOCIAL_FEED_CACHE_TTL_SECONDS=300

# Development Configuration
NODE_ENV=development  # Auto-accepts friend requests in dev mode
SOCIAL_ENABLE_AUTO_POSTS=true
```

## Performance Considerations

### Caching Strategy

- **User Posts**: 15 minutes TTL (frequently accessed user content)
- **Friend Relationships**: 30 minutes TTL (relationship status doesn't change often)
- **Social Feed**: 5 minutes TTL (balance between performance and freshness)
- **Post Engagement**: 10 minutes TTL (likes and comments counts)

### Database Optimization

- **Indexes**: user_id, post_type, visibility, created_at on posts table
- **Composite indexes**: (user_id, post_id) for post_likes, (post_id, parent_comment_id) for comments
- **Query optimization**: Efficient friend lookup algorithms and feed generation
- **Batch operations**: Multiple posts and friendship status checks

### Event Processing

- **Async processing**: Auto-post generation runs asynchronously
- **Event batching**: Social activity events are batched for performance
- **Retry logic**: Failed social notifications have exponential backoff retry
- **Performance monitoring**: Track post creation rates and feed generation times

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=social/services
npm test -- --testPathPattern=social/controllers
npm test -- --testPathPattern=social/validators
```

### Integration Tests

```bash
npm run test:integration -- social
npm run test:events -- social
npm run test:api -- social
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Post Activity**: Track post creation, likes, and comment rates
- **Friendship Activity**: Monitor friend request rates and acceptance ratios
- **Feed Performance**: Track feed generation times and engagement rates
- **Auto-Post Generation**: Monitor success rates of auto-generated posts

### Alerts

- **High Rejection Rate**: Alert when friend request rejection rate exceeds threshold
- **Spam Detection**: Alert on unusual posting patterns or content
- **Feed Performance**: Alert when feed generation exceeds acceptable response times
- **Auto-Post Failures**: Alert when auto-post generation fails

### Dashboards

- **Social Activity Dashboard**: Daily active users, posts created, engagement metrics
- **Friendship Dashboard**: Friend requests sent/accepted, relationship growth
- **Content Performance Dashboard**: Popular posts, engagement rates, trending content

## Security

### Data Protection

- **Content Sanitization**: All user content is sanitized to prevent XSS attacks
- **Privacy Controls**: Strict visibility enforcement based on friendship status
- **Input Validation**: Comprehensive validation of all user inputs
- **Rate Limiting**: Protection against spam posting and friend request abuse

### Privacy Features

- **Visibility Controls**: Three-tier visibility system (public, friends, private)
- **Friendship Verification**: Access to friends-only content requires verified friendship
- **Content Ownership**: Users can only modify their own posts and comments
- **Blocked Users**: Support for blocking users and hiding their content

## Scaling Considerations

### Horizontal Scaling

- **Stateless services**: All social services support horizontal scaling
- **Event queues**: Social events processed through distributed queues
- **Cache distribution**: Social data cached across distributed cache instances
- **Feed optimization**: Efficient feed generation algorithms for large friend networks

### Microservices Migration

- **Service boundaries**: Clear separation between posts, friendships, and feed services
- **Event-driven architecture**: Loose coupling through domain events
- **API gateway ready**: RESTful APIs designed for external access
- **Database separation**: Models can be separated into service-specific databases

## Migration & Deployment

### Database Migrations

```bash
# Run social domain migrations
npm run migrate -- --domain=social

# Specific migration files
create-posts.js
create-post-likes.js
create-post-comments.js
create-user-relationships.js
add-visibility-to-posts.js
add-nested-comments-support.js
```

### Zero-Downtime Deployment

1. Deploy new social services (backward compatible)
2. Update event handlers for social events
3. Migrate existing social data if needed
4. Switch API traffic to new endpoints
5. Remove deprecated social features

## Troubleshooting

### Common Issues

#### Posts Not Appearing in Feed

```bash
# Check friendship status
curl -X GET "/friends/123/status" \
  -H "Authorization: Bearer $TOKEN"

# Verify post visibility
curl -X GET "/user-posts/from-user/123" \
  -H "Authorization: Bearer $TOKEN"

# Check feed generation
tail -f /var/log/app/combined.log | grep "social-feed"
```

#### Friend Requests Not Working

```bash
# Check user exists
curl -X GET "/friends/search?query=username" \
  -H "Authorization: Bearer $TOKEN"

# Verify relationship status
curl -X GET "/friends/123/status" \
  -H "Authorization: Bearer $TOKEN"

# Check relationship table
SELECT * FROM user_relationships 
WHERE (requester_user_id = $1 AND addressee_user_id = $2) 
   OR (requester_user_id = $2 AND addressee_user_id = $1);
```

### Performance Issues

```bash
# Check post query performance
EXPLAIN ANALYZE SELECT * FROM posts 
WHERE user_id = $1 AND visibility = 'public' 
ORDER BY created_at DESC LIMIT 20;

# Monitor friendship queries
EXPLAIN ANALYZE SELECT * FROM user_relationships 
WHERE (requester_user_id = $1 OR addressee_user_id = $1) 
AND relationship_status = 'accepted';

# Check event processing
tail -f /var/log/app/combined.log | grep "social.post"
```

## Contributing

### Adding New Features

1. **Define interfaces** in `interfaces/internal.interfaces.ts`
2. **Update domain config** in `social.domain.ts`
3. **Implement service logic** in appropriate service file
4. **Add API endpoints** in relevant controller
5. **Update event handling** if needed
6. **Add tests** for all new functionality
7. **Update documentation** and examples

### Modifying Business Rules

1. **Update validation logic** in service methods and validators
2. **Modify privacy controls** in visibility checking methods
3. **Update event payloads** if needed
4. **Add backward compatibility** for existing social data
5. **Test thoroughly** with various user scenarios

## Roadmap

### Planned Features

- **Advanced Post Types**: Support for media posts, polls, and shared content
- **Group Functionality**: Create and manage user groups with group posts
- **Enhanced Privacy**: More granular privacy controls and user blocking
- **Content Moderation**: Automated content filtering and reporting system

### Technical Improvements

- **Real-time Features**: WebSocket support for live notifications and updates
- **Advanced Feed Algorithm**: ML-based feed curation and content recommendation
- **Performance Optimization**: Further caching improvements and query optimization
- **Analytics Enhancement**: Detailed social analytics and engagement metrics

## Support

For issues related to the social domain:

1. Check logs in `/var/log/app/combined.log`
2. Review social database tables and relationships
3. Verify friendship status and post visibility settings
4. Check social event processing and notifications
5. Validate domain dependencies are properly registered
6. Test with isolated social scenarios

For emergency issues:

- Use admin endpoints to investigate user relationships
- Check system health at `/user-posts/health` and `/auto-posts/health`
- Review social domain error rates in monitoring dashboard
- Contact on-call engineer for critical social functionality failures