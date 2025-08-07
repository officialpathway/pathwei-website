# Billing Domain

> Comprehensive subscription and payment management with Stripe integration

## Overview

The Billing domain manages the complete subscription lifecycle, payment processing, and billing operations. It provides secure integration with Stripe for payment handling, subscription management, usage tracking, and automated billing processes. The domain handles everything from trial management to payment failures and subscription analytics.

## Domain Boundaries

### Responsibilities

- ✅ **Subscription Management**: Complete subscription lifecycle from creation to cancellation
- ✅ **Payment Processing**: Secure payment handling through Stripe integration
- ✅ **Billing Operations**: Invoice management, payment history, and billing cycles
- ✅ **Webhook Processing**: Real-time Stripe event handling with signature verification
- ✅ **Usage Analytics**: User activity tracking and subscription usage statistics  
- ✅ **Plan Management**: Subscription plan configuration and feature access control
- ✅ **Premium Access Control**: Feature gating and premium user management

### External Dependencies

- **User Management**: User profiles, premium status, and activity data
- **Notifications**: Payment alerts, billing notifications, and trial reminders
- **Stripe Service**: Payment processing, subscription management, and webhook events
- **Configuration Service**: Stripe API keys and billing configuration settings

## Architecture

```
src/domains/billing/
├── controllers/              # HTTP request handlers
│   ├── subscription.controller.ts
│   ├── billing.controller.ts
│   ├── plans.controller.ts
│   ├── usage.controller.ts
│   └── webhook.controller.ts
├── services/                # Business logic
│   ├── subscription-management.service.ts
│   ├── billing.service.ts
│   ├── subscription-plan.service.ts
│   ├── usage-stats.service.ts
│   └── stripe-webhook.service.ts
├── models/                  # Data models
│   ├── subscription.model.ts
│   └── associations.ts
├── webhooks/               # Webhook handlers
│   └── stripe-webhook.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── subscription.validators.ts
├── dtos/                # Data transfer objects
│   └── subscription.dtos.ts
├── billing.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### Subscription Management

- `GET /subscriptions/current` - Get user's current subscription
- `POST /subscriptions/create` - Create new subscription
- `DELETE /subscriptions/cancel` - Cancel subscription
- `POST /subscriptions/reactivate` - Reactivate canceled subscription

### Billing & Payments

- `GET /subscriptions/billing/history` - Get billing history
- `POST /subscriptions/billing/payment-method` - Update payment method

### Plans & Usage

- `GET /subscriptions/plans` - Get available subscription plans
- `GET /subscriptions/usage/stats` - Get user's usage statistics

### Webhooks

- `POST /subscriptions/webhooks/stripe` - Stripe webhook handler

## Models

### Subscription

```typescript
interface Subscription {
  id: number;
  userId: number;
  stripeSubscriptionId: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### Domain Events Published

- `billing.subscription.created` - New subscription created with user and plan details
- `billing.subscription.updated` - Subscription status changed (active, canceled, past_due, etc.)
- `billing.subscription.canceled` - Subscription canceled by user or payment failure
- `billing.subscription.reactivated` - Canceled subscription reactivated
- `billing.payment.succeeded` - Payment processed successfully with invoice details
- `billing.payment.failed` - Payment processing failed with retry information
- `billing.trial.ending` - Trial period ending soon (notification trigger)
- `billing.invoice.upcoming` - Upcoming invoice notification for payment preparation

### External Events Consumed

- `user.profile.updated` - Update billing information when user profile changes
- `user.deleted` - Clean up billing data when user account is deleted
- `notifications.preferences.updated` - Adjust billing notification settings

### Stripe Webhook Events Processed

- `customer.subscription.created` - New subscription from Stripe
- `customer.subscription.updated` - Subscription status changes
- `customer.subscription.deleted` - Subscription cancellation
- `invoice.payment_succeeded` - Successful payment confirmation
- `invoice.payment_failed` - Payment failure handling
- `customer.subscription.trial_will_end` - Trial expiration warning

## Business Rules

### Subscription Rules

- **Single Active Subscription**: Users can have only one active subscription at a time
- **Trial Period**: Default 14-day trial period for new subscriptions (configurable)
- **Grace Period**: 7-day grace period for failed payments before suspension
- **Payment Retries**: Automatic retry of failed payments with exponential backoff (max 3 attempts)
- **Status Transitions**: Strict state machine for subscription status changes
- **Soft Deletion**: Subscriptions are soft-deleted to maintain billing history

### Payment Rules

- **Stripe Processing**: All payments processed through Stripe for PCI compliance
- **Payment Methods**: Supports major credit cards and digital wallets
- **Currency Support**: USD primary currency with multi-currency capability
- **Prorated Billing**: Automatic proration for plan changes and mid-cycle upgrades
- **Refund Policy**: Automated refund processing for cancellations within trial period

### Premium Access Rules

- **Feature Gating**: Premium features automatically locked/unlocked based on subscription status
- **Usage Limits**: Free tier usage limits enforced through subscription status
- **Immediate Access**: Premium features available immediately upon successful payment
- **Grace Period Access**: Premium features remain active during payment grace period

## Usage Examples

### Create New Subscription

```typescript
import { SubscriptionManagementService } from "@domains/billing";

const subscriptionService = Container.get(SubscriptionManagementService);

// Create subscription with trial
const result = await subscriptionService.createSubscription(userId, {
  planId: "premium-monthly",
  paymentMethodId: "pm_1234567890",
  trialDays: 14
});

if (result.success) {
  console.log("Subscription created:", result.data);
  // Automatically triggers billing.subscription.created event
  // User gains immediate access to premium features
}
```

### Manage Existing Subscription

```typescript
import { SubscriptionManagementService } from "@domains/billing";

const subscriptionService = Container.get(SubscriptionManagementService);

// Cancel subscription
const cancelResult = await subscriptionService.cancelSubscription(userId);

// Reactivate subscription
const reactivateResult = await subscriptionService.reactivateSubscription(userId);

// Get current subscription status
const subscription = await subscriptionService.getCurrentSubscription(userId);
```

### Access Billing Information

```typescript
import { BillingService } from "@domains/billing";

const billingService = Container.get(BillingService);

// Get complete billing history
const history = await billingService.getBillingHistory(userId);

// Get specific invoice
const invoice = await billingService.getInvoice(userId, invoiceId);

// Update payment method
const paymentUpdate = await billingService.updatePaymentMethod(
  userId, 
  "pm_newpaymentmethod123"
);
```

### Track Usage Statistics

```typescript
import { UsageStatsService } from "@domains/billing";

const usageService = Container.get(UsageStatsService);

// Get comprehensive usage stats
const stats = await usageService.getUsageStats(userId);
console.log({
  enrolledPaths: stats.enrolledPaths,
  completedPaths: stats.completedPaths,
  currentStreak: stats.currentStreak,
  aiUsageToday: stats.aiUsageToday,
  isPremium: stats.isPremium
});

// Check if user has exceeded limits
const hasExceededLimits = await usageService.checkUsageLimits(userId);
```

### Handle Stripe Webhooks

```typescript
import { StripeWebhookService } from "@domains/billing";

const webhookService = Container.get(StripeWebhookService);

// Process incoming webhook (typically in webhook controller)
const result = await webhookService.handleStripeWebhook(stripeEvent);

if (result.success) {
  console.log("Webhook processed:", result.message);
} else {
  console.error("Webhook failed:", result.message);
}

// The service automatically:
// - Verifies webhook signature
// - Updates local subscription status
// - Dispatches appropriate domain events
// - Handles payment success/failure
// - Manages subscription state changes
```

### Premium Feature Access Control

```typescript
import { SubscriptionManagementService } from "@domains/billing";

// Middleware or service method to check premium access
async function requiresPremium(userId: number): Promise<boolean> {
  const subscriptionService = Container.get(SubscriptionManagementService);
  const subscription = await subscriptionService.getCurrentSubscription(userId);
  
  return subscription && 
         (subscription.subscriptionStatus === 'active' || 
          subscription.subscriptionStatus === 'trialing');
}

// Usage in controllers or services
if (!(await requiresPremium(userId))) {
  throw new Error("Premium subscription required for this feature");
}
```

## Configuration

### Domain Registration

```typescript
import { registerBillingDomain } from "@domains/billing";

registerBillingDomain({
  userRepository: userRepo,
  stripeService: stripe,
  eventDispatcher: eventBus,
  configService: config,
});
```

### Environment Variables

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
STRIPE_PRICE_ID=price_1234567890abcdef

# Billing Configuration
BILLING_TRIAL_DAYS=14
BILLING_GRACE_PERIOD_DAYS=7
BILLING_AUTO_RETRY_PAYMENTS=true
BILLING_MAX_RETRY_ATTEMPTS=3

# Application Configuration
APP_FRONTEND_URL=https://app.yourapp.com
BILLING_SUPPORT_EMAIL=billing@yourapp.com
```

## Performance Considerations

### Caching Strategy

- **Subscription Status**: 15 minutes (frequent premium access checks)
- **Usage Statistics**: 5 minutes (real-time usage tracking needs)
- **Plan Information**: 1 hour (plan details change infrequently)
- **Billing History**: 30 minutes (balance performance with data freshness)

### Database Optimization

- **Primary Indexes**: user_id, stripe_subscription_id, subscription_status
- **Query Optimization**: Optimized for subscription status lookups and user billing queries
- **Soft Delete Handling**: Efficient queries that properly handle paranoid model behavior
- **Connection Pooling**: Stripe API calls optimized with connection reuse

### Webhook Processing

- **Async Processing**: All webhook events processed asynchronously
- **Idempotency**: Duplicate webhook handling with idempotency keys
- **Retry Logic**: Failed webhook processing with exponential backoff
- **Dead Letter Queue**: Persistent failures moved to manual review queue

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=billing/services
npm test -- --testPathPattern=billing/controllers
npm test -- --testPathPattern=billing/validators
```

### Integration Tests

```bash
npm run test:integration -- billing
npm run test:webhooks -- billing
npm run test:stripe -- billing
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Webhook handlers: 95%+ coverage
- Models: 85%+ coverage

### Stripe Testing

```bash
# Use Stripe test cards for payment testing
# Test successful payment
curl -X POST /subscriptions/create \
  -d "planId=premium&paymentMethodId=pm_card_visa"

# Test declined payment
curl -X POST /subscriptions/create \
  -d "planId=premium&paymentMethodId=pm_card_chargeDeclined"

# Test webhook events with Stripe CLI
stripe listen --forward-to localhost:3000/subscriptions/webhooks/stripe
stripe trigger customer.subscription.created
```

## Monitoring & Alerting

### Key Metrics

- **Monthly Recurring Revenue (MRR)**: Total predictable monthly revenue
- **Customer Churn Rate**: Percentage of customers canceling subscriptions
- **Payment Success Rate**: Percentage of successful payment transactions
- **Trial Conversion Rate**: Percentage of trial users converting to paid
- **Customer Lifetime Value (CLV)**: Average revenue per customer over their lifetime

### Alerts

- **Failed Payment Spike**: >5% payment failure rate in 1 hour
- **High Churn Rate**: >10% monthly churn rate
- **Webhook Processing Failures**: >1% webhook processing errors
- **Subscription Cancellation Spike**: >20% increase in cancellations
- **Stripe API Errors**: API error rate >2%

### Dashboards

- **Revenue Analytics**: MRR, ARR, revenue growth trends
- **Subscription Health**: Active subscriptions, churn analysis, cohort retention
- **Payment Monitoring**: Success rates, failure reasons, retry statistics
- **Customer Metrics**: Trial conversions, upgrade/downgrade patterns

## Security

### Payment Security

- **PCI DSS Compliance**: All payment processing handled by Stripe (PCI Level 1)
- **No Card Storage**: Credit card details never stored locally
- **Webhook Verification**: All webhooks verified using Stripe signatures
- **API Key Security**: Stripe keys rotated regularly and stored securely
- **TLS Encryption**: All API communications encrypted in transit

### Access Control

- **User Data Isolation**: Users can only access their own billing information
- **Admin Authentication**: Admin endpoints require proper role-based access
- **Webhook Security**: Webhook endpoints protected with signature verification
- **Rate Limiting**: API endpoints protected against abuse

## Support

For issues related to the billing domain:

1. Check Stripe dashboard for payment and subscription details
2. Review webhook delivery logs for processing failures
3. Verify user subscription status and payment methods
4. Check domain event logs for proper event propagation
5. Validate Stripe API configuration and credentials
6. Test webhook endpoint accessibility and signature verification
7. Review usage statistics and premium feature access

For emergency issues:

- Use Stripe dashboard for immediate payment and subscription management
- Check system health at `/admin/health/billing`
- Review failed webhook queue for processing backlogs
- Verify Stripe service status and API availability
- Contact on-call engineer for critical billing service disruptions
