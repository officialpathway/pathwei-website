# System Domain

> Domain for managing system configuration and operational settings

## Overview

The System domain handles system-wide configuration variables that control application behavior without requiring code deployments. This domain provides a centralized way to manage feature flags, maintenance mode settings, configuration parameters, and other operational settings through a dynamic system variables mechanism.

## Domain Boundaries

### Responsibilities

- ✅ **System Variables Management**: CRUD operations for system configuration variables
- ✅ **Dynamic Configuration**: Runtime configuration changes without deployments
- ✅ **Type Safety**: Enforced data types (string, number, boolean, json, array)
- ✅ **Category Organization**: Variables organized by categories (app, maintenance, feature, config, security, notification)
- ✅ **Admin Access Control**: All modifications require admin authentication
- ✅ **Event Publishing**: Domain events when variables change

### External Dependencies

- **User Management Domain**: Admin user validation and modification tracking

## Architecture

```
src/domains/system/
├── controllers/              # HTTP request handlers
│   └── system-variables.controller.ts
├── services/                # Business logic
│   └── system-variables.service.ts
├── models/                  # Data models
│   ├── system-variable.model.ts
│   ├── associations.ts
│   └── index.ts
├── interfaces/            # Type contracts
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── validators/           # Input validation
│   └── system-variables.validators.ts
├── dtos/                # Data transfer objects
│   └── system-variables.dtos.ts
├── system.domain.ts   # Domain registration
└── index.ts           # Public API
```

## API Endpoints

### Public System Variables Access

- `GET /system/variables/health` - System health check
- `GET /system/variables/active` - Get all active variables for client consumption
- `GET /system/variables/key/:key` - Get specific variable value by key

### Admin System Variables Management

- `GET /system/variables/admin` - Get all variables with metadata (admin)
- `POST /system/variables/admin` - Create new system variable (admin)
- `PUT /system/variables/admin/:key` - Update system variable (admin)
- `DELETE /system/variables/admin/:key` - Delete system variable (admin)
- `PUT /system/variables/admin/bulk` - Bulk update multiple variables (admin)
- `POST /system/variables/admin/initialize` - Initialize default system variables (admin)

## Models

### SystemVariable

```typescript
interface SystemVariable {
  id: number;
  variableKey: string;
  variableValue: string;
  description?: string;
  category: 'app' | 'maintenance' | 'feature' | 'config' | 'security' | 'notification';
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  isActive: boolean;
  isReadOnly: boolean;
  lastModifiedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Events

### Domain Events Published

- `system.variable.created` - New system variable created
- `system.variable.updated` - System variable updated
- `system.variable.deleted` - System variable deleted

### External Events Consumed

- None (System domain is self-contained for variable management)

## Business Rules

### System Variable Rules

- **Key Uniqueness**: Variable keys must be unique across all categories
- **Key Format**: Must match pattern `^[a-zA-Z0-9_.-]+$` (alphanumeric, underscore, dot, dash only)
- **Type Validation**: Values must match declared data type on create/update
- **Read-Only Protection**: Read-only variables cannot be modified or deleted
- **Active Variables Only**: Only active variables are returned to public endpoints
- **Admin Access Required**: All write operations require admin authentication

### Data Type Rules

- **String**: Plain text values
- **Number**: Numeric values (integers and floats)
- **Boolean**: Must be "true" or "false" (case-insensitive)
- **JSON**: Must be valid JSON objects
- **Array**: Must be valid JSON arrays

### Category Rules

- **Valid Categories**: Must be one of 6 defined categories (app, maintenance, feature, config, security, notification)
- **Description Limit**: Maximum 500 characters
- **Modification Tracking**: All changes track the admin user who made them

## Usage Examples

### Getting Configuration Values

```typescript
import { SystemVariablesService } from "@domains/system";

const systemService = Container.get(SystemVariablesService);
const variables = await systemService.getActiveVariables();

// Values are automatically parsed by data type
const maxFileSize = variables["config.max_file_upload_size"]; // number
const maintenanceMode = variables["maintenance.enabled"]; // boolean
const languages = variables["config.supported_languages"]; // array
```

### Creating a New Variable (Admin Only)

```typescript
import { SystemVariablesService } from "@domains/system";

const systemService = Container.get(SystemVariablesService);

const newVariable = await systemService.createVariable(
  {
    variableKey: "features.new_feature",
    variableValue: "false",
    description: "Enable new experimental feature",
    category: "feature",
    dataType: "boolean",
    isActive: true,
    isReadOnly: false,
  },
  adminUserId
);
```

### Updating a Variable (Admin Only)

```typescript
const result = await systemService.updateVariable(
  "maintenance.enabled",
  { variableValue: "true" },
  adminUserId
);
```

## Configuration

### Domain Registration

```typescript
import { SYSTEM_DOMAIN_CONFIG } from "@domains/system";

// Domain configuration is automatically registered
console.log(SYSTEM_DOMAIN_CONFIG.name); // "system"
console.log(SYSTEM_DOMAIN_CONFIG.version); // "1.0.0"
console.log(SYSTEM_DOMAIN_CONFIG.description); // "Domain for managing system configuration and operational settings"
```

### Environment Variables

```bash
# System Domain Configuration
SYSTEM_VARIABLES_CACHE_TTL_SECONDS=3600
SYSTEM_ADMIN_BULK_MAX_OPERATIONS=100

# Default Variable Initialization
SYSTEM_INITIALIZE_DEFAULTS_ON_STARTUP=true
SYSTEM_DEFAULT_CATEGORY=config
SYSTEM_DEFAULT_DATA_TYPE=string

# Security Configuration
SYSTEM_REQUIRE_ADMIN_FOR_READ=false
SYSTEM_REQUIRE_ADMIN_FOR_WRITE=true
SYSTEM_LOG_ALL_VARIABLE_ACCESS=true
```

## Performance Considerations

### Caching Strategy

- **Active Variables**: 1 hour TTL (frequently accessed configuration data)
- **Variable Metadata**: 30 minutes TTL (admin panel usage)
- **Health Check**: 30 seconds TTL (monitoring and status checks)

### Database Optimization

- **Indexes**: variable_key (unique), category, is_active
- **Query optimization**: Active variable queries are optimized for client usage
- **Bulk operations**: Efficient batch processing for admin bulk updates

### Event Processing

- **Async processing**: Variable change events are dispatched asynchronously
- **Event batching**: Bulk operations publish single events with change summaries
- **Performance monitoring**: Track variable access patterns and response times

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=system/services
npm test -- --testPathPattern=system/controllers
npm test -- --testPathPattern=system/validators
```

### Integration Tests

```bash
npm run test:integration -- system
npm run test:api -- system
```

### Test Coverage Requirements

- Services: 95%+ coverage
- Controllers: 90%+ coverage
- Validators: 95%+ coverage
- Models: 85%+ coverage

## Monitoring & Alerting

### Key Metrics

- **Variable Access Rate**: Monitor frequency of variable retrieval requests
- **Admin Modifications**: Track frequency of variable changes by admins
- **Cache Hit Rate**: Monitor caching effectiveness for active variables
- **Response Times**: Track API response times for variable access

### Alerts

- **Configuration Changes**: Alert on critical system variable modifications
- **Maintenance Mode**: Alert when maintenance mode is enabled/disabled
- **Failed Variable Validation**: Alert on validation errors during updates
- **Admin Access Patterns**: Monitor unusual admin activity

### Dashboards

- **System Configuration Dashboard**: Current variable values and categories
- **Admin Activity Dashboard**: Variable modification history and admin actions
- **Performance Dashboard**: API response times and cache performance

## Security

### Data Protection

- **Admin Authentication**: All write operations require admin authentication
- **Read-Only Protection**: Critical variables marked as read-only cannot be modified
- **Audit Logging**: All variable modifications are logged with admin user ID
- **Input Validation**: Strict validation of variable keys, values, and types

### Access Control

- **Public Read Access**: Active variables can be read without authentication
- **Admin Write Access**: All modifications require admin privileges
- **Bulk Operation Limits**: Admin bulk operations have reasonable limits
- **Variable Key Restrictions**: Only alphanumeric characters and specific symbols allowed

## Scaling Considerations

### Horizontal Scaling

- **Stateless service**: System variables service supports horizontal scaling
- **Cache distribution**: Variables cached across distributed cache instances
- **Event queues**: Variable change events processed through distributed queues
- **Database optimization**: Efficient queries for high-frequency variable access

### Microservices Migration

- **Service boundaries**: Clean separation of system configuration management
- **Event-driven architecture**: Loose coupling through domain events
- **API gateway ready**: RESTful APIs designed for external access
- **Database separation**: SystemVariable model can be isolated to dedicated database

## Migration & Deployment

### Database Migrations

```bash
# Run system domain migrations
npm run migrate -- --domain=system

# Specific migration files
create-system-variables.js
add-category-index-to-system-variables.js
add-readonly-field-to-system-variables.js
```

### Zero-Downtime Deployment

1. Deploy new system variables service (backward compatible)
2. Update variable schema if needed
3. Initialize default variables
4. Switch API traffic to new endpoints
5. Remove deprecated system configuration code

### Data Migration Scripts

```bash
# Initialize default system variables
npm run migrate:data -- system:initialize-defaults

# Migrate legacy configuration to system variables
npm run migrate:data -- system:migrate-legacy-config
```

## Troubleshooting

### Common Issues

#### Variables Not Loading

```bash
# Check if variables exist and are active
curl -X GET "/system/variables/active"

# Check specific variable
curl -X GET "/system/variables/key/maintenance.enabled"

# Verify database connection
tail -f /var/log/app/combined.log | grep "system"
```

#### Permission Denied on Admin Operations

```bash
# Verify admin authentication
curl -X POST "/system/variables/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"variableKey": "test", "variableValue": "true", "category": "config", "dataType": "boolean"}'

# Check admin decorators
grep -r "@AdminDashboardOnly" src/domains/system/
```

### Performance Issues

```bash
# Check variable access patterns
EXPLAIN ANALYZE SELECT * FROM system_variables 
WHERE is_active = true 
ORDER BY category ASC, variable_key ASC;

# Monitor cache performance
redis-cli info stats | grep cache

# Check event processing
tail -f /var/log/app/combined.log | grep "system.variable"
```

## Default System Variables

The system initializes with these default variables:

### App Category
- `app.version.frontend.current` - Current frontend app version
- `app.version.frontend.minimum` - Minimum required frontend version  
- `app.version.backend.current` - Current backend API version
- `app.force_update_required` - Whether users must update the app

### Maintenance Category
- `maintenance.enabled` - Enable/disable maintenance mode
- `maintenance.message` - Message shown during maintenance
- `maintenance.estimated_end` - Estimated maintenance end time

### Feature Category
- `features.new_user_registration` - Allow new user registrations
- `features.push_notifications` - Enable push notifications
- `features.in_app_purchases` - Enable in-app purchases

### Config Category
- `config.max_file_upload_size` - Maximum file upload size in bytes
- `config.session_timeout` - Session timeout in seconds
- `config.supported_languages` - List of supported language codes

### Security Category
- `security.require_2fa` - Require two-factor authentication
- `security.max_login_attempts` - Maximum login attempts before lockout

### Notification Category
- `notifications.global_announcement` - Global announcement message
- `notifications.show_global_announcement` - Show global announcement flag

## Contributing

### Adding New Features

1. **Define interfaces** in `interfaces/internal.interfaces.ts`
2. **Update domain config** in `system.domain.ts`
3. **Implement service logic** in `system-variables.service.ts`
4. **Add API endpoints** in `system-variables.controller.ts`
5. **Add tests** for all new functionality
6. **Update documentation** and examples

### Modifying Business Rules

1. **Update validation logic** in service methods
2. **Modify type definitions** in interfaces
3. **Update event payloads** if needed
4. **Add backward compatibility** for existing variables
5. **Test thoroughly** with edge cases

## Roadmap

### Planned Features

- **Variable Categories Management**: Dynamic category creation and management
- **Variable Templates**: Predefined templates for common configuration patterns
- **Environment-Specific Variables**: Different values per deployment environment
- **Variable Dependencies**: Define relationships between variables

### Technical Improvements

- **GraphQL API**: Advanced querying capabilities for system variables
- **Real-time Updates**: WebSocket notifications for variable changes
- **Import/Export**: Bulk import/export of system variables
- **Advanced Validation**: Custom validation rules for specific variable types

## Support

For issues related to the system domain:

1. Check logs in `/var/log/app/combined.log`
2. Review system variable table in database
3. Verify admin authentication is working
4. Check variable validation and type constraints
5. Validate domain event publishing
6. Test with isolated variable scenarios

For emergency issues:

- Use direct database access for critical variable updates
- Check system health at `/system/variables/health`
- Review system variable error rates in monitoring dashboard
- Contact on-call engineer for critical system configuration failures