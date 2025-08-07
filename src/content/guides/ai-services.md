# AI Services Domain

> Intelligent content generation, coaching, and optimization powered by multiple AI providers

## Overview

The AI Services domain provides enterprise-grade AI capabilities including content generation, conversational coaching, usage governance, and multi-provider management. Built with DDD principles for maintainability and scalability while optimized for startup velocity and production reliability.

**Key Characteristics:**
- **Stateless Architecture**: No persistent models - all data stored in dependent domains
- **Multi-Provider Support**: OpenAI and DeepSeek integration with automatic fallbacks
- **Usage Governance**: Comprehensive limits, monitoring, and analytics
- **Event-Driven**: Publishes 11 domain events but consumes no external events

## Domain Boundaries

### Responsibilities

Based on the actual domain configuration, the AI Services domain provides **6 core capabilities**:

- ✅ **Content Generation**: AI-powered milestone, path, test, and routine creation
- ✅ **AI Coaching**: Conversational guidance with memory and context awareness
- ✅ **Usage Governance**: Limits enforcement, monitoring, and compliance
- ✅ **Provider Management**: Multi-provider support (OpenAI, DeepSeek) with fallbacks
- ✅ **Quality Assurance**: Validation, feedback collection, and continuous improvement
- ✅ **Analytics Reporting**: Performance tracking and business intelligence

### External Dependencies

Based on the actual domain configuration, the AI Services domain depends on **5 external domains**:

- **User Management**: User profiles, premium status, AI usage tracking and limits
- **Learning Content**: Path/milestone repositories for context and generation
- **Routine Management**: Schedule data for optimization and coaching
- **Notifications**: AI operation results, usage alerts, and feedback requests  
- **Analytics**: Performance metrics, usage patterns, and system health monitoring

## Architecture

```
src/domains/ai-services/
├── controllers/                    # HTTP request handlers (6 controllers)
│   ├── ai-coach.controller.ts     # Conversational AI coaching
│   ├── content-generation.controller.ts  # Content creation endpoints
│   ├── test-generation.controller.ts     # Assessment generation
│   ├── routine-optimization.controller.ts # Schedule optimization  
│   ├── usage-monitoring.controller.ts    # Usage limits & analytics
│   └── ai-feedback.controller.ts         # User feedback collection
├── services/                      # Business logic by capability
│   ├── core/                      # Core AI infrastructure
│   │   ├── base-ai.service.ts     # Common AI provider logic
│   │   ├── ai-provider.service.ts # Provider selection & fallback
│   │   └── ai-security.service.ts # Security & validation
│   ├── generation/                # Content generation services
│   │   ├── milestone-generation.service.ts
│   │   ├── path-generation.service.ts
│   │   ├── test-generation.service.ts
│   │   └── routine-generation.service.ts
│   ├── coaching/                  # AI coaching services
│   │   ├── ai-coach.service.ts
│   │   ├── conversation-memory.service.ts
│   │   └── prompt-generator.service.ts
│   ├── optimization/              # Optimization services
│   │   ├── suggestion-application.service.ts
│   │   └── routine-optimization.service.ts
│   ├── governance/                # Usage & monitoring
│   │   ├── usage-limits.service.ts
│   │   ├── ai-feedback.service.ts
│   │   └── ai-analytics.service.ts
│   └── index.ts                   # Service exports
├── interfaces/                    # Type contracts
│   ├── external.interfaces.ts     # Cross-domain contracts
│   └── internal.interfaces.ts     # Domain-specific types
├── validators/                    # Input validation
│   ├── ai-generation.validators.ts
│   └── ai.validators.ts
├── dtos/                         # Data transfer objects
│   ├── generation.dtos.ts
│   └── ai.dtos.ts
├── ai-services.domain.ts         # Domain registration
├── README.md                     # Domain documentation
└── index.ts                      # Public API exports
```

## Service Organization

Based on the actual domain configuration, the AI Services domain provides **13 services** organized into **5 capability groups**:

### Core Services (`services/core/`)
**Base infrastructure for all AI operations**
- `BaseAIService`: Common AI provider logic, error handling, timeouts
- `AIProviderService`: Provider selection, load balancing, failover
- `AISecurityService`: Input validation, output sanitization, rate limiting

### Generation Services (`services/generation/`)
**Content creation with consistent patterns**
- `MilestoneGenerationService`: Learning milestone creation
- `PathGenerationService`: Complete learning path generation
- `TestGenerationService`: Assessment and quiz generation
- `RoutineGenerationService`: Personalized schedule creation

### Coaching Services (`services/coaching/`)
**Conversational AI with context awareness**
- `AICoachService`: Main coaching logic with retry mechanisms
- `ConversationMemoryService`: Context and conversation history
- `PromptGeneratorService`: Dynamic prompt generation and optimization

### Optimization Services (`services/optimization/`)
**Schedule and workflow optimization**
- `SuggestionApplicationService`: Apply AI suggestions with conflict resolution
- `RoutineOptimizationService`: Schedule conflict detection and resolution

### Governance Services (`services/governance/`)
**Usage monitoring and quality assurance**
- `UsageLimitsService`: Free/premium limits, usage tracking
- `AIFeedbackService`: Quality feedback collection and analysis
- `AIAnalyticsService`: Performance metrics and business intelligence

## API Endpoints

### Content Generation

- `POST /ai/milestones/generate` - Generate learning milestones
- `POST /ai/paths/generate-complete` - Generate complete learning path
- `POST /ai/tests/generate` - Generate assessment questions
- `POST /ai/tests/path/:pathId/generate` - Generate tests for entire path
- `POST /ai/routines/generate` - Generate personalized routine

### AI Coaching

- `POST /ai/coach/message` - Send message to AI coach
- `POST /ai/coach/apply-suggestions` - Apply AI suggestions to routine
- `POST /ai/coach/clear-memory` - Clear conversation history

### Usage Governance

- `POST /ai/usage/check-limits` - Check current usage limits
- `POST /ai/usage/stats` - Get detailed usage statistics
- `POST /ai/usage/increment` - Increment usage counter
- `GET /ai/usage/can-use` - Check if user can perform operation
- `GET /ai/usage/system-stats` - System-wide usage analytics (admin)

### Feedback & Quality

- `POST /ai/feedback/submit` - Submit feedback on AI response
- `GET /ai/feedback/stats` - Get feedback statistics

### Health & Monitoring

- `GET /ai/health` - Get system health status
- `GET /ai/analytics/metrics` - Get performance metrics

## Usage Examples

### Generate Learning Content

```typescript
import { MilestoneGenerationService } from "@domains/ai-services";

const service = Container.get(MilestoneGenerationService);
const result = await service.generateMilestones(
  "Learn JavaScript",
  "Build a todo app with React",
  "30",
  { count: 5, language: 'es' }
);
```

### AI Coaching Session

```typescript
import { AICoachService } from "@domains/ai-services";

const service = Container.get(AICoachService);
const response = await service.getCoachResponse(
  userId,
  "I want to add daily exercise to my routine",
  "routine_optimization"
);
```

### Check Usage Limits

```typescript
import { UsageLimitsService } from "@domains/ai-services";

const service = Container.get(UsageLimitsService);
const limits = await service.checkUsageLimits(userId, isPremium);
```

### Apply AI Suggestions

```typescript
import { SuggestionApplicationService } from "@domains/ai-services";

const service = Container.get(SuggestionApplicationService);
const result = await service.applySuggestions(userId, suggestions);
```

## Configuration

### Domain Registration

```typescript
import { registerAIServicesDomain } from "@domains/ai-services";

registerAIServicesDomain({
  userRepository: userRepo,
  eventDispatcher: eventBus,
  configService: config,
  notificationService: notifications,
  learningContentRepository: learningRepo,
  routineRepository: routineRepo,
  assessmentRepository: assessmentRepo,
  analyticsRepository: analyticsRepo,
});
```

### Environment Variables

```bash
# AI Provider Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TEMPERATURE=0.7

# Usage Limits
AI_FREE_MONTHLY_LIMIT=5
AI_PREMIUM_MONTHLY_LIMIT=100
AI_FREE_LIFETIME_LIMIT=10

# System Configuration
AI_PROVIDER=openai
AI_REQUEST_TIMEOUT_MS=45000
AI_RETRY_ATTEMPTS=3
AI_FALLBACK_ENABLED=true

# Monitoring
AI_METRICS_ENABLED=true
AI_ANALYTICS_RETENTION_DAYS=90
```

## Business Rules

### Usage Limits

- **Free users**: 5 operations/month, 10 lifetime
- **Premium users**: 100 operations/month, unlimited lifetime
- **Grace period**: None - hard limits enforced
- **Refund policy**: Usage refunded on application conflicts
- **Rate limiting**: Per-endpoint limits to prevent abuse

### AI Provider Management

- **Primary provider**: Configurable (OpenAI/DeepSeek)
- **Fallback enabled**: Automatic failover on errors
- **Load balancing**: Round-robin for multiple providers
- **Circuit breaker**: Temporary disable failing providers
- **Cost optimization**: Use cheaper providers when possible

### Quality Assurance

- **Input validation**: All user inputs sanitized and validated
- **Output filtering**: AI responses checked for inappropriate content
- **Feedback collection**: Implicit and explicit quality signals
- **Continuous improvement**: Models updated based on feedback
- **Human oversight**: Flagged content reviewed by humans

### Content Generation Rules

- **Language support**: English and Spanish
- **Length limits**: Configurable per content type
- **Complexity levels**: Simple, moderate, complex
- **Resource inclusion**: Optional external resources
- **Versioning**: Track generation parameters for reproducibility

## Performance Considerations

### Caching Strategy

- **Provider responses**: No caching (dynamic content)
- **Usage limits**: 1-minute cache (frequently accessed)
- **System health**: 30-second cache (monitoring)
- **User preferences**: 5-minute cache (semi-static)

### Optimization Techniques

- **Request batching**: Combine multiple operations when possible
- **Streaming responses**: For long-form content generation
- **Connection pooling**: Reuse HTTP connections to AI providers
- **Circuit breakers**: Prevent cascade failures
- **Retry with backoff**: Exponential backoff for failed requests

### Scaling Considerations

- **Stateless services**: All services are horizontally scalable
- **Provider pools**: Multiple API keys for higher throughput
- **Queue-based processing**: Heavy operations processed asynchronously
- **Database read replicas**: Separate reads from writes
- **CDN integration**: Cache static assets and responses

## Events

### Domain Events Published

Based on the actual domain configuration, the AI Services domain publishes **11 domain events**:

- `ai.operation.started` - AI operation initiated
- `ai.operation.completed` - AI operation finished successfully
- `ai.operation.failed` - AI operation failed
- `ai.usage.limit_reached` - User reached usage limit
- `ai.feedback.submitted` - User submitted feedback
- `ai.provider.failure` - AI provider experienced failure
- `ai.content.generated` - Content successfully generated
- `ai.coaching.session_started` - Coaching session initiated
- `ai.coaching.session_completed` - Coaching session finished
- `ai.suggestion.applied` - AI suggestion successfully applied
- `ai.routine.optimized` - Routine optimization completed

### External Events Consumed

**Note**: The AI Services domain currently does not subscribe to external events. All interactions with other domains happen through direct service calls via dependency injection.

## Security

### Data Protection

- **Input sanitization**: All user inputs cleaned and validated
- **Output filtering**: AI responses scanned for inappropriate content
- **PII detection**: Personal information removed from AI prompts
- **Audit logging**: All AI operations logged with user context
- **Data retention**: Usage data retained per compliance requirements

### AI Safety

- **Prompt injection protection**: Inputs validated against malicious prompts
- **Content moderation**: Generated content filtered for harmful material
- **Rate limiting**: Per-user and per-IP rate limits enforced
- **Provider rotation**: Distribute load across multiple providers
- **Fallback mechanisms**: Graceful degradation when providers fail

### Access Control

- **Authentication required**: All endpoints require valid user session
- **Role-based access**: Admin endpoints restricted to admin users
- **Usage quotas**: Hard limits enforced based on user tier
- **API key security**: Provider keys encrypted and rotated regularly

## Monitoring & Alerting

### Key Metrics

- **Operation success rate**: > 95% success rate across all operations
- **Response time P95**: < 5 seconds for all AI operations
- **Usage quota adherence**: Hard limits never exceeded
- **Provider availability**: Multiple providers available at all times
- **Quality feedback**: Positive feedback rate > 80%

### Alerts

- **Provider failures**: Any provider down for > 1 minute
- **High error rates**: Error rate > 5% for any operation type
- **Usage spike**: Unusual usage patterns detected
- **Quality degradation**: Negative feedback spike detected
- **System overload**: Queue depth > 100 pending operations

### Dashboards

- **Real-time operations**: Live view of AI operations across providers
- **Usage analytics**: Daily/weekly/monthly usage trends by user tier
- **Quality metrics**: Feedback trends and satisfaction scores
- **System health**: Provider status, response times, error rates
- **Business KPIs**: Usage growth, conversion rates, cost per operation

## Testing

### Unit Tests

```bash
# Core services
npm test -- --testPathPattern=ai-services/services/core
# Generation services  
npm test -- --testPathPattern=ai-services/services/generation
# Coaching services
npm test -- --testPathPattern=ai-services/services/coaching
# Governance services
npm test -- --testPathPattern=ai-services/services/governance
```

### Integration Tests

```bash
# Full domain integration
npm run test:integration -- ai-services
# Provider integration
npm run test:providers -- ai-services
# Event integration
npm run test:events -- ai-services
```

### Load Testing

```bash
# Load test AI endpoints
npm run test:load -- ai-services
# Stress test providers
npm run test:stress -- ai-services
```

### Test Coverage Requirements

- Services: 95%+ coverage (critical business logic)
- Controllers: 90%+ coverage (API contracts)
- Subscribers: 90%+ coverage (event handling)
- Validators: 95%+ coverage (input validation)

## Troubleshooting

### Common Issues

#### AI Operations Timing Out

```bash
# Check provider status
curl -X GET /ai/health

# Review timeout configuration
grep AI_REQUEST_TIMEOUT_MS .env

# Check provider response times
tail -f /var/log/app/ai-operations.log | grep "responseTimeMs"
```

#### Usage Limits Not Working

```bash
# Verify user premium status
# Check usage counter reset logic
# Review monthly limit calculations
# Validate timezone handling for resets
```

#### Content Quality Issues

```bash
# Review feedback trends
# Check AI model versions
# Validate prompt templates
# Analyze negative feedback patterns
```

### Debugging Tools

```bash
# Enable debug logging
export LOG_LEVEL=debug

# AI operation tracing
export AI_TRACE_ENABLED=true

# Provider request logging
export AI_LOG_REQUESTS=true
```

## Migration & Deployment

### Database Migrations

```bash
# AI services has no models - no migrations needed
echo "AI Services domain is stateless - no database migrations required"
```

### Zero-Downtime Deployment

1. Deploy new services (backward compatible)
2. Update AI provider configurations
3. Test provider connectivity
4. Switch traffic to new endpoints
5. Monitor error rates and response times
6. Rollback if issues detected

### Configuration Updates

1. Update environment variables
2. Restart services to pick up new config
3. Validate provider connections
4. Test key endpoints
5. Monitor for errors

## Cost Optimization

### Provider Cost Management

- **Usage monitoring**: Track costs per provider and operation type
- **Smart routing**: Use cheaper providers for simpler operations
- **Caching strategies**: Cache expensive operations when appropriate
- **Batch processing**: Combine multiple operations to reduce API calls
- **Usage forecasting**: Predict costs based on usage patterns

### Resource Optimization

- **Connection pooling**: Reuse HTTP connections to providers
- **Request compression**: Compress large prompts and responses
- **Smart timeouts**: Adjust timeouts based on operation complexity
- **Load balancing**: Distribute load evenly across providers
- **Circuit breakers**: Prevent expensive cascade failures

## Development Guidelines

### Adding New AI Operations

1. **Create operation type** in `internal.interfaces.ts`
2. **Add validation rules** in validators
3. **Implement service method** in appropriate service group
4. **Add controller endpoint** with proper middleware
5. **Create DTOs** for request/response
6. **Add comprehensive tests**
7. **Update documentation**

### Adding New AI Providers

1. **Extend provider configuration** in domain config
2. **Update `AIProviderService`** with new provider logic
3. **Add provider-specific error handling**
4. **Update health checks** to include new provider
5. **Test failover scenarios**
6. **Update monitoring and alerts**

### Performance Optimization

1. **Profile operations** to identify bottlenecks
2. **Optimize prompts** for token efficiency
3. **Implement caching** where appropriate
4. **Add request batching** for bulk operations
5. **Load test** changes thoroughly

## Production Readiness Checklist

### Infrastructure

- [ ] Multiple AI provider accounts configured
- [ ] Rate limiting enabled on all endpoints  
- [ ] Circuit breakers configured for providers
- [ ] Monitoring and alerting set up
- [ ] Log aggregation configured
- [ ] Backup API keys available

### Security

- [ ] Input validation on all endpoints
- [ ] Output filtering implemented
- [ ] PII detection and removal
- [ ] API keys encrypted and rotated
- [ ] Audit logging enabled
- [ ] Rate limits tested

### Performance

- [ ] Load testing completed
- [ ] Response time SLAs defined
- [ ] Caching strategy implemented
- [ ] Database queries optimized
- [ ] Connection pooling configured
- [ ] Graceful degradation tested

### Quality Assurance

- [ ] Unit test coverage > 95%
- [ ] Integration tests passing
- [ ] End-to-end tests automated
- [ ] Performance tests automated
- [ ] Security tests included
- [ ] Feedback collection implemented

## Support

For issues related to the AI services domain:

1. **Check system status**: `/ai/health` endpoint
2. **Review logs**: `/var/log/app/ai-operations.log`
3. **Verify configuration**: Environment variables and provider keys
4. **Test providers**: Direct API connectivity to OpenAI/DeepSeek
5. **Check usage limits**: User tier and current usage
6. **Monitor metrics**: Response times and error rates

## Roadmap

### Planned Features

- **Vector embeddings**: Semantic search and similarity matching
- **Fine-tuned models**: Domain-specific model training
- **Multi-modal AI**: Image and audio processing capabilities
- **Real-time streaming**: Live conversation and content generation
- **Collaborative AI**: Multi-user AI sessions and shared contexts
- **Advanced analytics**: Predictive usage modeling and optimization

### Technical Improvements

- **GraphQL API**: Unified query interface for complex operations
- **WebSocket support**: Real-time AI interactions
- **Edge deployment**: Regional AI processing for lower latency
- **Auto-scaling**: Dynamic scaling based on demand
- **ML-powered optimization**: AI-driven provider selection and routing
- **Advanced security**: Zero-trust architecture and advanced threat detection

### Business Enhancements

- **Usage analytics**: Detailed business intelligence and reporting
- **A/B testing**: Experiment framework for AI improvements
- **Custom models**: Customer-specific AI model training
- **API marketplace**: Third-party AI provider integration
- **White-label solutions**: Branded AI services for enterprise clients
