# Authentication Domain

> Secure user authentication, registration, and account management

## Overview

The Authentication domain handles all user authentication concerns including registration, login, password management, email verification, and token management. Built with DDD principles for security, maintainability, and scalability while optimized for startup velocity.

## Domain Boundaries

### Responsibilities

- ✅ **User Registration**: Account creation with validation and verification
- ✅ **Authentication**: Secure login/logout with JWT tokens
- ✅ **Password Management**: Password reset, change, and validation
- ✅ **Email Verification**: Account verification and email updates
- ✅ **Token Management**: JWT token lifecycle and blacklisting
- ✅ **User Validation**: Email/username uniqueness and format validation
- ✅ **Security**: Account security alerts and monitoring

### External Dependencies

- **User Management**: User profile data and preferences
- **Notifications**: Email and push notification services
- **Email Service**: Transactional email delivery
- **Stripe Service**: Customer creation (optional)

## Architecture

```
src/domains/authentication/
├── controllers/              # HTTP request handlers
│   ├── authentication.controller.ts
│   ├── user-registration.controller.ts
│   ├── password-management.controller.ts
│   ├── email-verification.controller.ts
│   └── user-validation.controller.ts
├── services/                # Business logic
│   ├── authentication.service.ts
│   ├── user-registration.service.ts
│   ├── password-management.service.ts
│   ├── email-verification.service.ts
│   ├── token-management.service.ts
│   └── user-validation.service.ts
├── models/                  # Data models
│   ├── blacklisted-token.model.ts
│   └── associations.ts
├── subscribers/            # Event handlers
│   └── auth.subscriber.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── auth.validators.ts
├── utils/               # Utility functions
│   └── passwordUtils.ts
├── authentication.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### User Registration

- `POST /registration/register` - Register new user account
- `POST /registration/register-premium` - Register premium user account

### Authentication

- `POST /authentication/login` - User login
- `POST /authentication/logout` - User logout
- `POST /authentication/refresh` - Refresh access token
- `POST /authentication/verify-token` - Verify token validity
- `GET /authentication/session` - Get current session (mobile)
- `POST /authentication/invalidate-sessions` - Invalidate all sessions (mobile)

### Password Management

- `POST /password-management/forgot-password` - Request password reset
- `POST /password-management/reset-password` - Reset password with token
- `PUT /password-management/change-password` - Change password (authenticated)
- `POST /password-management/validate-password` - Validate password strength

### Email Verification

- `POST /email-verification/verify` - Verify email with token
- `POST /email-verification/resend` - Resend verification email
- `GET /email-verification/status` - Get verification status (mobile)
- `PUT /email-verification/update-email` - Update email address (mobile)
- `POST /email-verification/verify-new-email` - Verify new email
- `POST /email-verification/check-verification-token` - Check token validity

### User Validation

- `POST /validation/check-email` - Check if email exists
- `POST /validation/check-username` - Check if username exists
- `GET /validation/validate-email-format` - Validate email format
- `GET /validation/validate-username-format` - Validate username format
- `POST /validation/validate-bulk` - Bulk validation
- `POST /validation/validate-registration-data` - Validate registration data

## Models

### BlacklistedToken Model

```typescript
interface BlacklistedToken {
  id: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Static Methods:**
- `isTokenBlacklisted(token: string)` - Check if token is blacklisted
- `blacklistToken(token: string)` - Add token to blacklist
- `cleanupExpiredTokens(olderThanDays: number)` - Remove old tokens

## Services

### AuthenticationService

**Core authentication operations:**
- `login(email, password, clientInfo)` - Authenticate user
- `logout(token)` - Invalidate session
- `refreshToken(refreshToken)` - Generate new tokens
- `verifyToken(token)` - Validate JWT token
- `validateSession(token)` - Check session validity

### UserRegistrationService

**User account creation:**
- `register(email, password, username, firstName, age, role?, isPremium?)` - Create account
- Stripe customer creation (optional)
- Email verification setup
- Welcome notifications

### PasswordManagementService

**Password operations:**
- `forgotPassword(email, ipAddress?, userAgent?)` - Initiate reset
- `resetPassword(resetToken, newPassword, ipAddress?)` - Complete reset
- `changePassword(userId, currentPassword, newPassword, ipAddress?)` - Change password
- `validatePassword(password)` - Check password strength

### EmailVerificationService

**Email verification:**
- `verifyEmail(verificationToken)` - Verify email
- `resendVerificationEmail(email)` - Resend verification
- `checkVerificationStatus(userId)` - Check status
- `updateEmail(userId, newEmail)` - Update email address

### TokenManagementService

**JWT token management:**
- `extractTokenFromRequest(req)` - Get token from request
- `extractRefreshTokenFromRequest(req)` - Get refresh token
- `setAuthCookies(res, tokens)` - Set authentication cookies
- `clearAuthCookies(res)` - Clear authentication cookies
- `getTokenInfo(token)` - Get token metadata
- `shouldRefreshToken(token)` - Check if refresh needed

### UserValidationService

**Input validation:**
- `checkEmailExists(email)` - Check email availability
- `checkUsernameExists(username)` - Check username availability
- `validateEmailFormat(email)` - Validate email format
- `validateUsernameFormat(username)` - Validate username format
- `validateUserInput(data)` - Bulk validation

## Events

### Domain Events Published

- `user.signUp` - User registered
- `user.signIn` - User logged in
- `user.signOut` - User logged out
- `user.emailVerified` - Email verified
- `user.emailChanged` - Email address updated
- `user.passwordReset` - Password reset completed
- `user.passwordChanged` - Password changed
- `user.forgotPassword` - Password reset requested
- `user.resendVerification` - Verification email resent
- `user.reactivateAccount` - Account reactivated
- `user.sessionValidated` - Session validated

### Event Payloads

```typescript
// User Sign Up
{
  user: IAuthUser;
  verificationToken: string;
  userAgent?: string;
  ip?: string;
}

// User Sign In
{
  user: IAuthUser;
  signInTime?: Date;
  signInMethod?: string;
}

// Password Reset
{
  user: IAuthUser;
  ipAddress?: string;
}
```

## Usage Examples

### Register New User

```typescript
import { UserRegistrationService } from "@domains/authentication";

const service = Container.get(UserRegistrationService);
const result = await service.register(
  "user@example.com",
  "SecurePass123!",
  "username",
  "John",
  25
);
```

### Authenticate User

```typescript
import { AuthenticationService } from "@domains/authentication";

const service = Container.get(AuthenticationService);
const result = await service.login(
  "user@example.com",
  "SecurePass123!",
  { ipAddress: "127.0.0.1", userAgent: "Browser" }
);
```

### Verify Email

```typescript
import { EmailVerificationService } from "@domains/authentication";

const service = Container.get(EmailVerificationService);
const result = await service.verifyEmail(verificationToken);
```

### Reset Password

```typescript
import { PasswordManagementService } from "@domains/authentication";

const service = Container.get(PasswordManagementService);
await service.forgotPassword("user@example.com", "127.0.0.1");
const result = await service.resetPassword(resetToken, "NewPass123!");
```

## Configuration

### Domain Registration

```typescript
import { registerAuthenticationDomain } from "@domains/authentication";

registerAuthenticationDomain({
  userRepository: userRepo,
  eventDispatcher: eventBus,
  configService: config,
  notificationService: notifications,
  emailService: emailSvc,
  stripeService: stripe, // Optional
});
```

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Cookie Configuration
JWT_COOKIE_NAME=accessToken
JWT_REFRESH_COOKIE_NAME=refreshToken

# Security Configuration
REQUIRE_EMAIL_VERIFICATION=true
REQUIRE_UNIQUE_USERNAME=true
REQUIRE_UNIQUE_EMAIL=true

# Frontend Configuration
FRONTEND_URL=https://yourapp.com

# Development Configuration
NODE_ENV=production
```

## Security Features

### Password Security

- **Minimum Requirements**: 8+ characters, uppercase, lowercase, number, special character
- **bcrypt Hashing**: Salt rounds: 12
- **Password History**: Prevents reuse of current password
- **Strength Validation**: Real-time password strength checking

### JWT Security

- **Access Tokens**: Short-lived (1 hour default)
- **Refresh Tokens**: Longer-lived (7 days default)
- **Token Blacklisting**: Immediate invalidation support
- **Secure Cookies**: HttpOnly, Secure, SameSite
- **Token Rotation**: New refresh token on each refresh

### Account Security

- **Email Verification**: Required in production
- **Account Lockout**: After suspicious activity
- **Security Alerts**: Email notifications for important events
- **Session Management**: Multiple session tracking
- **IP Monitoring**: Login IP address logging

### Rate Limiting

- **Login Attempts**: Protection against brute force
- **Email Sending**: Verification/reset email limits
- **Token Validation**: API endpoint rate limits

## Validation Rules

### Email Validation

- **Format**: RFC-compliant email format
- **Length**: Maximum 254 characters
- **Uniqueness**: No duplicate emails
- **Normalization**: Lowercase, trimmed

### Username Validation

- **Length**: 3-30 characters
- **Characters**: Letters, numbers, underscores only
- **Uniqueness**: No duplicate usernames
- **Reserved Words**: System usernames blocked
- **Profanity Filter**: Basic inappropriate content check

### Password Validation

- **Minimum Length**: 8 characters
- **Complexity**: Must include uppercase, lowercase, number, special character
- **Common Passwords**: Protection against common/weak passwords
- **Password Reuse**: Cannot reuse current password

## Error Handling

### Authentication Errors

- **Invalid Credentials**: Generic message for security
- **Account Locked**: Clear message with contact info
- **Email Not Verified**: Prompt to verify email
- **Token Expired**: Automatic refresh attempt

### Validation Errors

- **Field-Specific**: Clear error messages per field
- **Real-Time**: Immediate feedback on input
- **Helpful Suggestions**: Username alternatives when taken
- **Security-Focused**: Don't reveal if email exists

### System Errors

- **Graceful Degradation**: Continue operation when possible
- **User-Friendly Messages**: Hide technical details
- **Detailed Logging**: Full error context for debugging
- **Retry Logic**: Automatic retry for transient failures

## Performance Considerations

### Caching Strategy

- **No Caching**: Authentication data for security
- **Short-Term Cache**: Username/email existence (1 minute)
- **Token Validation**: In-memory blacklist cache
- **Rate Limiting**: Redis-based rate limit counters

### Database Optimization

- **Indexes**: Email, username, token fields
- **Connection Pooling**: Shared database connections
- **Query Optimization**: Minimal data selection
- **Batch Operations**: Bulk token cleanup

### Security vs Performance

- **bcrypt Rounds**: Balance security and speed (12 rounds)
- **Token Size**: Compact JWTs with essential claims
- **Cleanup Jobs**: Periodic blacklist token removal
- **Monitoring**: Performance metrics for security operations

## Monitoring & Alerting

### Security Metrics

- **Failed Login Attempts**: Monitor brute force attacks
- **Account Creation Rate**: Detect automated registrations
- **Password Reset Frequency**: Unusual reset patterns
- **Token Validation Errors**: Detect token tampering

### Performance Metrics

- **Authentication Latency**: Login/registration response times
- **Token Generation Time**: JWT creation performance
- **Email Delivery Rate**: Verification email success
- **Database Query Performance**: Authentication query times

### Alerts

- **Multiple Failed Logins**: From same IP/user
- **Unusual Registration Patterns**: Spike in new accounts
- **Email Delivery Failures**: Verification/reset emails
- **Token Validation Errors**: Potential security issues

### Dashboards

- **Authentication Overview**: Daily login/registration counts
- **Security Events**: Failed attempts, account locks
- **System Health**: Service uptime, response times
- **User Engagement**: Registration conversion rates

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=authentication/services
npm test -- --testPathPattern=authentication/controllers
```

### Integration Tests

```bash
npm run test:integration -- authentication
```

### Security Tests

```bash
npm run test:security -- authentication
```

### Load Tests

```bash
npm run test:load -- authentication
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 90%+ coverage
- Models: 85%+ coverage

## Deployment

### Database Migrations

```bash
# Run authentication domain migrations
npm run migrate -- --domain=authentication
```

### Environment Setup

```bash
# Production environment variables
export JWT_SECRET=$(openssl rand -base64 32)
export JWT_REFRESH_SECRET=$(openssl rand -base64 32)
export REQUIRE_EMAIL_VERIFICATION=true
```

### Health Checks

- **Service Health**: `/authentication/health`
- **Database Connectivity**: User repository access
- **External Dependencies**: Email service availability
- **Token Validation**: JWT secret verification

## Troubleshooting

### Common Issues

#### Authentication Failures

```bash
# Check user account status
# Verify password hash
# Check email verification status
# Review security events
```

#### Token Issues

```bash
# Verify JWT secrets match
# Check token expiration
# Review blacklist entries
# Validate token format
```

#### Email Delivery Problems

```bash
# Check email service configuration
# Verify SMTP settings
# Review email templates
# Check rate limiting
```

#### Performance Issues

```bash
# Monitor database queries
# Check bcrypt performance
# Review rate limiting
# Analyze error rates
```

## Security Best Practices

### Production Checklist

- [ ] Strong JWT secrets configured
- [ ] HTTPS enforced for all endpoints
- [ ] Secure cookie settings enabled
- [ ] Email verification required
- [ ] Rate limiting configured
- [ ] Security headers implemented
- [ ] Error messages sanitized
- [ ] Monitoring alerts active

### Development Guidelines

- **Never Log Passwords**: Use `[REDACTED]` in logs
- **Secure Token Storage**: Environment variables only
- **Input Sanitization**: Validate all user input
- **Error Handling**: Don't reveal system internals
- **Testing**: Include security test cases

## Migration Guide

### From Monolithic Auth

1. **Extract Models**: Move User and BlacklistedToken
2. **Update Services**: Add dependency injection
3. **Register Domain**: Configure with dependencies
4. **Update Routes**: Point to new controllers
5. **Test Integration**: Verify all functionality

### Breaking Changes

- **Service Injection**: Controllers now use DI
- **Event System**: Authentication events published
- **Error Types**: Standardized error responses
- **Token Management**: Centralized token operations

## Roadmap

### Planned Features

- **OAuth Integration** - Social login support
- **Multi-Factor Auth** - TOTP/SMS verification
- **Session Management** - Advanced session control
- **Risk-Based Auth** - Behavioral authentication
- **Passwordless Auth** - Magic link login

### Technical Improvements

- **GraphQL Support** - Unified auth API
- **Redis Integration** - Distributed rate limiting
- **Audit Logging** - Comprehensive security logs
- **Mobile SDK** - Native mobile integration
- **API Keys** - Service-to-service authentication

## Support

For issues related to the authentication domain:

1. Check service health endpoints
2. Review authentication logs
3. Verify domain dependencies
4. Check external service status
5. Validate configuration settings

## Contributing

### Adding New Features

1. Update interfaces for new contracts
2. Implement business logic in services
3. Add validation rules
4. Create/update event handlers
5. Add comprehensive tests
6. Update documentation

### Security Considerations

- **Code Review**: All auth changes require review
- **Security Testing**: Include penetration testing
- **Compliance**: Follow OWASP guidelines
- **Documentation**: Update security documentation
