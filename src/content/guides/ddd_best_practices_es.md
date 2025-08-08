# 🎯 Guía de Mejores Prácticas DDD

## 📖 Índice

1. [Principios Fundamentales](#principios-fundamentales)
2. [Estructura y Organización](#estructura-y-organización)
3. [Naming Conventions](#naming-conventions)
4. [Manejo de Dependencias](#manejo-de-dependencias)
5. [Gestión de Errores](#gestión-de-errores)
6. [Performance y Optimización](#performance-y-optimización)
7. [Testing](#testing)
8. [Seguridad](#seguridad)
9. [Documentación](#documentación)
10. [Anti-patrones a Evitar](#anti-patrones-a-evitar)

---

## Principios Fundamentales

### 1. **Single Responsibility Principle**

Cada dominio debe tener **una sola razón para cambiar**.

```typescript
// ✅ CORRECTO: Dominio enfocado
src/domains/user-management/
├── services/
│   ├── user-registration.service.ts    // Solo registro
│   ├── user-profile.service.ts         // Solo perfiles
│   └── user-authentication.service.ts  // Solo autenticación

// ❌ INCORRECTO: Dominio demasiado amplio
src/domains/everything/
├── services/
│   ├── user-payment-notification.service.ts  // Múltiples responsabilidades
```

### 2. **Domain Boundaries**

Los dominios deben comunicarse **SOLO** a través de eventos.

```typescript
// ✅ CORRECTO: Comunicación por eventos
@Service()
export class UserService {
  async deleteUser(userId: number) {
    await this.userRepository.delete(userId);
    
    // Notificar a otros dominios vía eventos
    await this.eventDispatcher.dispatchDomainEvent(
      "user-management",
      "user.deleted",
      { userId, deletedAt: new Date() }
    );
  }
}

// ❌ INCORRECTO: Dependencia directa
@Service()
export class UserService {
  constructor(
    private notificationService: NotificationService, // ❌ Dependencia directa
    private billingService: BillingService           // ❌ Dependencia directa
  ) {}
}
```

### 3. **Ubiquitous Language**

Usar el mismo lenguaje en código que en las reglas de negocio.

```typescript
// ✅ CORRECTO: Lenguaje del negocio
export class SubscriptionService {
  async activatePremiumMembership(userId: number) { /* */ }
  async pauseSubscription(subscriptionId: string) { /* */ }
  async calculateProration(oldPlan: string, newPlan: string) { /* */ }
}

// ❌ INCORRECTO: Lenguaje técnico
export class DataProcessor {
  async processType1(id: number) { /* */ }
  async updateFlag(entityId: string) { /* */ }
  async calculateDifference(a: string, b: string) { /* */ }
}
```

---

## Estructura y Organización

### Estructura Estándar de Dominio

```
src/domains/mi-dominio/
├── controllers/              # ✅ OBLIGATORIO
│   ├── public/              # Endpoints públicos
│   ├── admin/               # Endpoints administrativos
│   └── internal/            # Endpoints internos/webhooks
├── services/                # ✅ OBLIGATORIO
│   ├── core/               # Servicios principales
│   ├── validation/         # Servicios de validación
│   └── integration/        # Servicios de integración
├── models/                 # ✅ OBLIGATORIO
│   ├── entities/           # Modelos principales
│   ├── value-objects/      # Objetos de valor
│   ├── associations.ts     # ✅ OBLIGATORIO
│   └── index.ts           # ✅ OBLIGATORIO
├── subscribers/            # ✅ OBLIGATORIO
│   ├── internal/          # Eventos internos del dominio
│   └── external/          # Eventos de otros dominios
├── interfaces/            # ✅ OBLIGATORIO
│   ├── external.interfaces.ts  # ✅ OBLIGATORIO
│   └── internal.interfaces.ts  # ✅ OBLIGATORIO
├── validators/            # Opcional pero recomendado
├── dtos/                 # Opcional pero recomendado
├── utils/                # Opcional
├── constants/            # Opcional
├── mi-dominio.domain.ts  # ✅ OBLIGATORIO
└── index.ts             # ✅ OBLIGATORIO
```

### Organización por Tamaño

#### Dominio Pequeño (< 5 modelos)
```
src/domains/feedback/
├── controllers/
│   └── feedback.controller.ts
├── services/
│   └── feedback.service.ts
├── models/
│   ├── feedback.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/
│   └── feedback.subscriber.ts
├── interfaces/
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── feedback.domain.ts
└── index.ts
```

#### Dominio Mediano (5-15 modelos)
```
src/domains/learning-content/
├── controllers/
│   ├── path.controller.ts
│   ├── milestone.controller.ts
│   └── admin-content.controller.ts
├── services/
│   ├── path.service.ts
│   ├── milestone.service.ts
│   └── content-validation.service.ts
├── models/
│   ├── path.model.ts
│   ├── milestone.model.ts
│   ├── question.model.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/
│   ├── path.subscriber.ts
│   └── milestone.subscriber.ts
├── interfaces/
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── learning-content.domain.ts
└── index.ts
```

#### Dominio Grande (> 15 modelos)
```
src/domains/user-management/
├── controllers/
│   ├── public/
│   │   ├── user-profile.controller.ts
│   │   └── user-preferences.controller.ts
│   ├── admin/
│   │   ├── user-admin.controller.ts
│   │   └── user-moderation.controller.ts
│   └── internal/
│       └── user-internal.controller.ts
├── services/
│   ├── core/
│   │   ├── user-profile.service.ts
│   │   └── user-registration.service.ts
│   ├── validation/
│   │   ├── email-validation.service.ts
│   │   └── username-validation.service.ts
│   └── integration/
│       └── social-login.service.ts
├── models/
│   ├── entities/
│   │   ├── user.model.ts
│   │   ├── user-profile.model.ts
│   │   └── user-device.model.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   └── username.vo.ts
│   ├── associations.ts
│   └── index.ts
├── subscribers/
│   ├── internal/
│   │   └── user-lifecycle.subscriber.ts
│   └── external/
│       ├── authentication.subscriber.ts
│       └── billing.subscriber.ts
├── interfaces/
│   ├── external.interfaces.ts
│   └── internal.interfaces.ts
├── user-management.domain.ts
└── index.ts
```

---

## Naming Conventions

### Nombres de Archivos y Carpetas

```typescript
// ✅ CORRECTO: kebab-case
user-management/
learning-content/
ai-services/
admin-activity-logging/

// ❌ INCORRECTO: otros formatos
userManagement/
learningContent/
aiServices/
admin_activity_logging/
```

### Nombres de Clases

```typescript
// ✅ CORRECTO: PascalCase
export class UserRegistrationService { }
export class EmailValidationController { }
export class UserProfileModel { }

// ❌ INCORRECTO: otros formatos
export class userRegistrationService { }
export class email_validation_controller { }
export class User_Profile_Model { }
```

### Nombres de Métodos y Variables

```typescript
// ✅ CORRECTO: camelCase
async registerNewUser(userData: CreateUserDTO) { }
const isEmailValid = await this.validateEmail(email);
const userPreferences = await this.getUserPreferences(userId);

// ❌ INCORRECTO: otros formatos
async register_new_user(user_data: CreateUserDTO) { }
const is_email_valid = await this.validate_email(email);
const UserPreferences = await this.GetUserPreferences(userId);
```

### Nombres de Eventos

```typescript
// ✅ CORRECTO: kebab-case
"user-management.user.registered"
"learning-content.path.completed"
"billing.subscription.activated"

// ❌ INCORRECTO: otros formatos
"userManagement.user.registered"
"learningContent.pathCompleted"
"billing.subscriptionActivated"
```

### Nombres de Constantes

```typescript
// ✅ CORRECTO: SCREAMING_SNAKE_CASE
export const MAX_LOGIN_ATTEMPTS = 5;
export const DEFAULT_SESSION_TIMEOUT = 3600;
export const SUPPORTED_FILE_TYPES = ['.jpg', '.png', '.pdf'];

// ❌ INCORRECTO: otros formatos
export const maxLoginAttempts = 5;
export const defaultSessionTimeout = 3600;
export const supportedFileTypes = ['.jpg', '.png', '.pdf'];
```

---

## Manejo de Dependencias

### Inyección de Dependencias

```typescript
// ✅ CORRECTO: Inyección por constructor
@Service()
export class UserService {
  constructor(
    @Inject("domainUserRepository") private userRepo: IUserRepository,
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher,
    @Inject("domainEmailService") private emailService: IEmailService
  ) {}
}

// ❌ INCORRECTO: Dependencias directas
@Service()
export class UserService {
  private userRepo = Container.get("userRepository"); // ❌ Dependencia directa
  private emailService = new EmailService();          // ❌ Acoplamiento fuerte
}
```

### Interfaces para Dependencias Externas

```typescript
// ✅ CORRECTO: Definir interfaces para dependencias externas
// src/domains/user-management/interfaces/external.interfaces.ts

export interface IEmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}

export interface INotificationService {
  sendPushNotification(userId: number, message: string): Promise<void>;
  createInAppNotification(userId: number, data: any): Promise<void>;
}

// Usar las interfaces en servicios
@Service()
export class UserService {
  constructor(
    @Inject("domainEmailService") private emailService: IEmailService,
    @Inject("domainNotificationService") private notificationService: INotificationService
  ) {}
}
```

### Dependencias Opcionales

```typescript
// ✅ CORRECTO: Manejar dependencias opcionales
@Service()
export class AnalyticsService {
  private cacheService?: ICacheService;
  
  constructor(
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher
  ) {
    // Dependencia opcional
    try {
      this.cacheService = Container.get("domainCacheService");
    } catch {
      console.warn("⚠️ Cache service not available - using fallback");
    }
  }

  async trackEvent(event: any) {
    // Usar cache si está disponible
    if (this.cacheService) {
      await this.cacheService.store(event.id, event);
    }
    
    // Siempre publicar evento
    await this.eventDispatcher.dispatchDomainEvent(
      "analytics",
      "event.tracked",
      event
    );
  }
}
```

---

## Gestión de Errores

### Errores de Dominio

```typescript
// ✅ CORRECTO: Errores específicos del dominio
export class UserDomainError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 400) {
    super(message);
    this.name = "UserDomainError";
  }
}

export class EmailAlreadyExistsError extends UserDomainError {
  constructor(email: string) {
    super(`Email ${email} already exists`, "EMAIL_ALREADY_EXISTS", 409);
  }
}

export class InvalidPasswordError extends UserDomainError {
  constructor() {
    super("Password does not meet requirements", "INVALID_PASSWORD", 400);
  }
}

// Usar en servicios
@Service()
export class UserService {
  async registerUser(userData: CreateUserDTO) {
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(userData.email);
    }

    if (!this.isValidPassword(userData.password)) {
      throw new InvalidPasswordError();
    }

    return await this.userRepo.create(userData);
  }
}
```

### Manejo en Controladores

```typescript
// ✅ CORRECTO: Manejo estructurado de errores
@JsonController("/users")
export class UserController {
  
  @Post("/register")
  async register(@Body() userData: CreateUserDTO) {
    try {
      const user = await this.userService.registerUser(userData);
      
      return {
        success: true,
        message: "Usuario registrado exitosamente",
        data: { userId: user.id }
      };
    } catch (error) {
      if (error instanceof UserDomainError) {
        return {
          success: false,
          message: error.message,
          code: error.code,
          statusCode: error.statusCode
        };
      }

      // Log unexpected errors
      this.logger.error("Unexpected error in user registration:", error);
      
      return {
        success: false,
        message: "Error interno del servidor",
        code: "INTERNAL_ERROR",
        statusCode: 500
      };
    }
  }
}
```

### Manejo en Suscriptores de Eventos

```typescript
// ✅ CORRECTO: Manejo robusto en suscriptores
@Service()
@EventSubscriber("UserNotificationSubscriber")
export class UserNotificationSubscriber {
  
  @OnEvent("user-management.user.registered")
  async onUserRegistered(event: IDomainEvent): Promise<void> {
    try {
      await this.sendWelcomeNotifications(event.payload);
    } catch (error) {
      // Log pero NO relanzar error (para no afectar otros suscriptores)
      this.logger.error("Failed to send welcome notifications", {
        eventId: event.eventId,
        userId: event.payload.userId,
        error: error.message,
        stack: error.stack
      });

      // Opcional: Publicar evento de error para monitoreo
      await this.eventDispatcher.dispatchDomainEvent(
        "notifications",
        "notification.failed",
        {
          originalEvent: event.eventName,
          userId: event.payload.userId,
          error: error.message,
          failedAt: new Date()
        }
      );
    }
  }
}
```

---

## Performance y Optimización

### Lazy Loading de Dependencias

```typescript
// ✅ CORRECTO: Lazy loading para servicios pesados
@Service()
export class AIService {
  private _heavyMLService?: IMLService;

  private async getMLService(): Promise<IMLService> {
    if (!this._heavyMLService) {
      this._heavyMLService = await this.initializeMLService();
    }
    return this._heavyMLService;
  }

  async generateContent(prompt: string) {
    const mlService = await this.getMLService();
    return await mlService.generate(prompt);
  }
}
```

### Procesamiento por Lotes

```typescript
// ✅ CORRECTO: Procesar eventos por lotes
@Service()
@EventSubscriber("BatchAnalyticsSubscriber")
export class BatchAnalyticsSubscriber {
  private eventBatch: IDomainEvent[] = [];
  private batchTimer?: NodeJS.Timeout;
  private readonly BATCH_SIZE = 50;
  private readonly BATCH_TIMEOUT = 5000; // 5 segundos

  @OnEvent("*") // Escuchar todos los eventos
  async onAnyEvent(event: IDomainEvent): Promise<void> {
    this.eventBatch.push(event);

    if (this.eventBatch.length >= this.BATCH_SIZE) {
      await this.processBatch();
    } else {
      this.scheduleBatchProcessing();
    }
  }

  private async processBatch(): Promise<void> {
    if (this.eventBatch.length === 0) return;

    const batch = [...this.eventBatch];
    this.eventBatch = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = undefined;
    }

    try {
      await this.analyticsService.processBatch(batch);
    } catch (error) {
      this.logger.error("Failed to process analytics batch:", error);
    }
  }

  private scheduleBatchProcessing(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(async () => {
      await this.processBatch();
    }, this.BATCH_TIMEOUT);
  }
}
```

### Caching Estratégico

```typescript
// ✅ CORRECTO: Cache con invalidación inteligente
@Service()
export class UserService {
  constructor(
    @Inject("domainUserRepository") private userRepo: IUserRepository,
    @Inject("domainCacheService") private cache: ICacheService
  ) {}

  async getUserProfile(userId: number): Promise<UserProfileDTO> {
    const cacheKey = `user:profile:${userId}`;
    
    // Intentar obtener del cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Si no está en cache, obtener de BD
    const user = await this.userRepo.findById(userId);
    const profile = this.mapToDTO(user);

    // Guardar en cache (TTL: 1 hora)
    await this.cache.set(cacheKey, JSON.stringify(profile), 3600);

    return profile;
  }

  async updateUserProfile(userId: number, updates: UpdateUserDTO): Promise<void> {
    await this.userRepo.update(userId, updates);

    // Invalidar cache
    const cacheKey = `user:profile:${userId}`;
    await this.cache.delete(cacheKey);

    // Publicar evento
    await this.eventDispatcher.dispatchDomainEvent(
      "user-management",
      "user.profile_updated",
      { userId, updates }
    );
  }
}
```

---

## Testing

### Testing de Servicios

```typescript
// ✅ CORRECTO: Tests completos para servicios
describe("UserService", () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockEventDispatcher: jest.Mocked<IEventDispatcher>;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    mockEventDispatcher = {
      dispatchDomainEvent: jest.fn(),
    } as any;

    userService = new UserService(mockUserRepo, mockEventDispatcher);
  });

  describe("registerUser", () => {
    it("should create user and publish event", async () => {
      // Arrange
      const userData = { email: "test@test.com", password: "ValidPass123!" };
      const createdUser = { id: 1, email: userData.email };
      
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(createdUser);

      // Act
      const result = await userService.registerUser(userData);

      // Assert
      expect(result).toEqual(createdUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(userData);
      expect(mockEventDispatcher.dispatchDomainEvent).toHaveBeenCalledWith(
        "user-management",
        "user.registered",
        expect.objectContaining({
          userId: createdUser.id,
          email: userData.email,
        })
      );
    });

    it("should throw error if email already exists", async () => {
      // Arrange
      const userData = { email: "existing@test.com", password: "ValidPass123!" };
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1 } as any);

      // Act & Assert
      await expect(userService.registerUser(userData))
        .rejects
        .toThrow(EmailAlreadyExistsError);
    });
  });
});
```

### Testing de Controladores

```typescript
// ✅ CORRECTO: Tests de integración para controladores
describe("UserController", () => {
  let app: express.Application;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    // Setup test app
    app = await createTestApp();
    userService = Container.get(UserService) as jest.Mocked<UserService>;
  });

  describe("POST /users/register", () => {
    it("should register user successfully", async () => {
      // Arrange
      const userData = { email: "test@test.com", password: "ValidPass123!" };
      const createdUser = { id: 1, email: userData.email };
      
      userService.registerUser.mockResolvedValue(createdUser);

      // Act
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Usuario registrado exitosamente",
        data: { userId: createdUser.id }
      });
    });

    it("should handle validation errors", async () => {
      // Arrange
      const invalidData = { email: "invalid-email", password: "123" };

      // Act
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Testing de Eventos

```typescript
// ✅ CORRECTO: Tests para sistema de eventos
describe("User Registration Flow", () => {
  let eventDispatcher: EventDispatcher;
  let mockNotificationService: jest.Mocked<INotificationService>;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
    mockNotificationService = {
      sendWelcomeNotification: jest.fn(),
    } as any;

    // Registrar suscriptor
    const subscriber = new UserNotificationSubscriber(mockNotificationService);
    eventDispatcher.subscribe(subscriber);
  });

  it("should send welcome notification when user registers", async () => {
    // Arrange
    const userRegisteredEvent = {
      eventId: "test-event-1",
      eventName: "user-management.user.registered",
      domainOrigin: "user-management",
      payload: { userId: 123, email: "test@test.com" },
      occurredAt: new Date(),
    };

    // Act
    await eventDispatcher.dispatch(userRegisteredEvent);

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert
    expect(mockNotificationService.sendWelcomeNotification)
      .toHaveBeenCalledWith(123, "test@test.com");
  });
});
```

---

## Seguridad

### Validación de Entrada

```typescript
// ✅ CORRECTO: Validación robusta
@Service()
export class UserService {
  async updateUserProfile(userId: number, updates: UpdateUserDTO): Promise<void> {
    // Validar permisos
    await this.validateUserPermissions(userId);
    
    // Validar datos de entrada
    await this.validateUpdateData(updates);
    
    // Sanitizar datos
    const sanitizedUpdates = this.sanitizeUserData(updates);
    
    // Actualizar
    await this.userRepo.update(userId, sanitizedUpdates);
  }

  private async validateUserPermissions(userId: number): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    if (user.status === "banned") {
      throw new UserBannedError(userId);
    }
  }

  private async validateUpdateData(updates: UpdateUserDTO): Promise<void> {
    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new InvalidEmailError(updates.email);
    }
    if (updates.username && !this.isValidUsername(updates.username)) {
      throw new InvalidUsernameError(updates.username);
    }
  }

  private sanitizeUserData(updates: UpdateUserDTO): UpdateUserDTO {
    return {
      ...updates,
      // Sanitizar HTML/XSS
      bio: updates.bio ? this.sanitizeHtml(updates.bio) : undefined,
      // Limpiar espacios en blanco
      username: updates.username?.trim(),
    };
  }
}
```

### Autorización por Roles

```typescript
// ✅ CORRECTO: Sistema de roles granular
@Service()
export class PermissionService {
  async canUserAccessResource(
    userId: number, 
    resource: string, 
    action: string
  ): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) return false;

    // Check user-specific permissions
    const userPermissions = await this.getUserPermissions(userId);
    if (userPermissions.includes(`${resource}:${action}`)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = await this.getRolePermissions(user.roles);
    return rolePermissions.some(permission => 
      permission.resource === resource && permission.actions.includes(action)
    );
  }
}

// Decorador para controladores
export function RequirePermission(resource: string, action: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req = args.find(arg => arg.user); // Encuentra el request
      const userId = req?.user?.id;

      if (!userId) {
        throw new UnauthorizedError("User not authenticated");
      }

      const permissionService = Container.get(PermissionService);
      const hasPermission = await permissionService.canUserAccessResource(
        userId, resource, action
      );

      if (!hasPermission) {
        throw new ForbiddenError(`Insufficient permissions for ${resource}:${action}`);
      }

      return originalMethod.apply(this, args);
    };
  };
}

// Uso en controladores
@JsonController("/admin/users")
export class AdminUserController {
  
  @Get("/")
  @RequirePermission("users", "read")
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Delete("/:id")
  @RequirePermission("users", "delete")
  async deleteUser(@Param("id") userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
```

---

## Documentación

### JSDoc para Servicios

```typescript
/**
 * Servicio principal para gestión de usuarios
 * 
 * @example
 * ```typescript
 * const userService = Container.get(UserService);
 * const user = await userService.registerUser({
 *   email: "usuario@ejemplo.com",
 *   password: "MiPassword123!"
 * });
 * ```
 */
@Service()
export class UserService {
  
  /**
   * Registra un nuevo usuario en el sistema
   * 
   * @param userData - Datos del usuario a registrar
   * @param userData.email - Email único del usuario
   * @param userData.password - Contraseña (mínimo 8 caracteres)
   * @param userData.username - Nombre de usuario opcional
   * 
   * @returns Promise con los datos del usuario creado
   * 
   * @throws {EmailAlreadyExistsError} Cuando el email ya está registrado
   * @throws {InvalidPasswordError} Cuando la contraseña no cumple requisitos
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await userService.registerUser({
   *     email: "nuevo@usuario.com",
   *     password: "Password123!",
   *     username: "nuevo_usuario"
   *   });
   *   console.log("Usuario creado:", user.id);
   * } catch (error) {
   *   if (error instanceof EmailAlreadyExistsError) {
   *     console.log("Email ya existe");
   *   }
   * }
   * ```
   */
  async registerUser(userData: CreateUserDTO): Promise<UserDTO> {
    // Implementación...
  }
}
```

### README por Dominio

```markdown
# User Management Domain

## Resumen

El dominio de User Management se encarga de toda la gestión del ciclo de vida de usuarios, incluyendo registro, autenticación, perfiles y preferencias.

## Responsabilidades

- ✅ Registro y verificación de usuarios
- ✅ Gestión de perfiles de usuario
- ✅ Preferencias y configuraciones
- ✅ Dispositivos y sesiones
- ✅ Moderación y administración

## API Endpoints

### Públicos
- `POST /users/register` - Registrar nuevo usuario
- `GET /users/profile` - Obtener perfil del usuario actual
- `PUT /users/profile` - Actualizar perfil

### Administrativos
- `GET /admin/users` - Listar todos los usuarios
- `GET /admin/users/:id` - Obtener usuario específico
- `PUT /admin/users/:id/status` - Cambiar estado del usuario
- `DELETE /admin/users/:id` - Eliminar usuario

## Eventos

### Publicados
- `user-management.user.registered` - Usuario registrado
- `user-management.user.profile_updated` - Perfil actualizado
- `user-management.user.status_changed` - Estado cambiado

### Consumidos
- `authentication.user.logged_in` - Actualizar última actividad
- `billing.subscription.activated` - Actualizar tipo de cuenta

## Modelos

- **User** - Información básica del usuario
- **UserProfile** - Perfil extendido del usuario  
- **UserDevice** - Dispositivos registrados
- **UserPreference** - Preferencias del usuario

## Configuración

```bash
# Variables de entorno requeridas
REQUIRE_EMAIL_VERIFICATION=true
REQUIRE_UNIQUE_USERNAME=true
MIN_PASSWORD_LENGTH=8
```
```

---

## Anti-patrones a Evitar

### ❌ God Domain

```typescript
// ❌ MAL: Dominio que hace demasiado
src/domains/everything/
├── user-management.service.ts
├── billing.service.ts
├── notifications.service.ts
├── analytics.service.ts
└── ai-services.service.ts

// ✅ BIEN: Dominios separados
src/domains/user-management/
src/domains/billing/
src/domains/notifications/
src/domains/analytics/
src/domains/ai-services/
```

### ❌ Anemic Domain Model

```typescript
// ❌ MAL: Modelos sin lógica de negocio
export class User {
  id: number;
  email: string;
  password: string;
  // Solo getters y setters, sin lógica
}

export class UserService {
  // Toda la lógica está en el servicio
  validateEmail(user: User) { /* */ }
  validatePassword(user: User) { /* */ }
  canUserDoAction(user: User, action: string) { /* */ }
}

// ✅ BIEN: Modelos con lógica de dominio
export class User {
  private constructor(
    public readonly id: number,
    public readonly email: Email, // Value Object
    private password: Password,   // Value Object
    public readonly roles: Role[]
  ) {}

  // Lógica de negocio en el modelo
  canPerformAction(action: string): boolean {
    return this.roles.some(role => role.hasPermission(action));
  }

  changePassword(newPassword: string): void {
    if (!this.isValidPassword(newPassword)) {
      throw new InvalidPasswordError();
    }
    this.password = new Password(newPassword);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password);
  }
}
```

### ❌ Dependency Hell

```typescript
// ❌ MAL: Dependencias circulares
// UserService depende de NotificationService
// NotificationService depende de UserService
export class UserService {
  constructor(private notificationService: NotificationService) {}
}

export class NotificationService {
  constructor(private userService: UserService) {} // ❌ Circular!
}

// ✅ BIEN: Comunicación vía eventos
export class UserService {
  async updateUser(userId: number, data: any) {
    await this.userRepo.update(userId, data);
    
    // Comunicar vía eventos, no dependencias directas
    await this.eventDispatcher.dispatchDomainEvent(
      "user-management",
      "user.updated",
      { userId, data }
    );
  }
}

@EventSubscriber("NotificationSubscriber")
export class NotificationSubscriber {
  @OnEvent("user-management.user.updated")
  async onUserUpdated(event: IDomainEvent) {
    // Reaccionar al evento sin dependencia directa
    await this.sendUpdateNotification(event.payload.userId);
  }
}
```

### ❌ Leaky Abstractions

```typescript
// ❌ MAL: Exponer detalles de implementación
export class UserService {
  // Expone detalles de Sequelize
  async getUser(id: number): Promise<UserSequelizeModel> {
    return await UserModel.findByPk(id, {
      include: [{ model: UserProfile, as: 'profile' }]
    });
  }
}

// ✅ BIEN: Abstraer detalles de implementación
export class UserService {
  // Retorna DTO limpio
  async getUser(id: number): Promise<UserDTO> {
    const user = await this.userRepo.findById(id);
    return this.mapToDTO(user);
  }

  private mapToDTO(user: UserModel): UserDTO {
    return {
      id: user.id,
      email: user.email,
      profile: {
        name: user.profile?.name,
        avatar: user.profile?.avatar,
      },
      createdAt: user.createdAt,
    };
  }
}
```

### ❌ Event Overuse

```typescript
// ❌ MAL: Evento para todo
export class UserService {
  async updateUserAge(userId: number, age: number) {
    await this.userRepo.updateAge(userId, age);
    
    // ❌ Evento innecesario para cambio interno
    await this.eventDispatcher.dispatchDomainEvent(
      "user-management",
      "user.age.updated",
      { userId, age }
    );
  }
}

// ✅ BIEN: Eventos solo para cambios importantes
export class UserService {
  async updateUserProfile(userId: number, profileData: any) {
    await this.userRepo.updateProfile(userId, profileData);
    
    // ✅ Evento importante que otros dominios necesitan saber
    await this.eventDispatcher.dispatchDomainEvent(
      "user-management", 
      "user.profile_updated",
      { userId, changes: profileData }
    );
  }
}
```

---

## Herramientas y Utilidades

### Script de Generación de Dominios

```bash
#!/bin/bash
# scripts/create-domain.sh

DOMAIN_NAME=$1

if [ -z "$DOMAIN_NAME" ]; then
  echo "Uso: ./create-domain.sh nombre-del-dominio"
  exit 1
fi

# Crear estructura de carpetas
mkdir -p "src/domains/$DOMAIN_NAME"/{controllers,services,models,subscribers,interfaces,validators,dtos}

# Crear archivos básicos
cat > "src/domains/$DOMAIN_NAME/models/associations.ts" << EOF
// src/domains/$DOMAIN_NAME/models/associations.ts

export function initialize${DOMAIN_NAME^}Associations(): void {
  console.log("✅ $DOMAIN_NAME domain internal associations initialized");
}

export function initializeCrossDomainAssociations(dependencies: Record<string, any>): void {
  const { User } = dependencies;
  
  if (!User) {
    console.warn("⚠️ User model not available for $DOMAIN_NAME domain");
    return;
  }

  console.log("✅ $DOMAIN_NAME domain cross-domain associations initialized");
}

export function validate${DOMAIN_NAME^}Associations(): boolean {
  return true;
}
EOF

# Crear archivo de dominio
cat > "src/domains/$DOMAIN_NAME/$DOMAIN_NAME.domain.ts" << EOF
// src/domains/$DOMAIN_NAME/$DOMAIN_NAME.domain.ts
import { Container } from "typedi";

export const ${DOMAIN_NAME^^}_DOMAIN_CONFIG = {
  name: "$DOMAIN_NAME",
  version: "1.0.0",
  description: "Domain for $DOMAIN_NAME management",
  dependencies: ["user-management"],
  events: [
    "$DOMAIN_NAME.entity.created",
    "$DOMAIN_NAME.entity.updated",
    "$DOMAIN_NAME.entity.deleted"
  ]
} as const;

export function validate${DOMAIN_NAME^}Domain(): boolean {
  try {
    const userRepo = Container.get("domainUserRepository");
    const eventDispatcher = Container.get("domainEventDispatcher");
    return !!(userRepo && eventDispatcher);
  } catch (error) {
    console.error("$DOMAIN_NAME domain validation failed:", error);
    return false;
  }
}
EOF

echo "✅ Dominio $DOMAIN_NAME creado exitosamente"
echo "📝 No olvides:"
echo "   1. Agregar al domain.registry.ts"
echo "   2. Actualizar domain.manager.ts dependencies"
echo "   3. Implementar modelos, servicios y controladores"
```

### Template de Servicio

```typescript
// templates/service.template.ts
import { Service, Inject } from "typedi";
import { IEventDispatcher } from "@shared/interfaces/events.interfaces";

@Service()
export default class {ENTITY_NAME}Service {
  constructor(
    @Inject("domain{ENTITY_NAME}Repository") private {entity}Repo: I{ENTITY_NAME}Repository,
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher
  ) {}

  async create{ENTITY_NAME}(data: Create{ENTITY_NAME}DTO): Promise<{ENTITY_NAME}DTO> {
    try {
      // Validaciones de negocio
      await this.validateCreateData(data);

      // Crear entidad
      const {entity} = await this.{entity}Repo.create(data);

      // Publicar evento
      await this.eventDispatcher.dispatchDomainEvent(
        "{DOMAIN_NAME}",
        "{entity}.created",
        {
          {entity}Id: {entity}.id,
          userId: data.userId,
          createdAt: new Date(),
        }
      );

      return this.mapToDTO({entity});
    } catch (error) {
      this.logger.error("Error creating {entity}:", error);
      throw error;
    }
  }

  async get{ENTITY_NAME}ById(id: number): Promise<{ENTITY_NAME}DTO | null> {
    const {entity} = await this.{entity}Repo.findById(id);
    return {entity} ? this.mapToDTO({entity}) : null;
  }

  async update{ENTITY_NAME}(id: number, updates: Update{ENTITY_NAME}DTO): Promise<{ENTITY_NAME}DTO> {
    // Validaciones
    await this.validateUpdateData(id, updates);

    // Actualizar
    const {entity} = await this.{entity}Repo.update(id, updates);

    // Evento
    await this.eventDispatcher.dispatchDomainEvent(
      "{DOMAIN_NAME}",
      "{entity}.updated",
      { {entity}Id: id, changes: updates }
    );

    return this.mapToDTO({entity});
  }

  async delete{ENTITY_NAME}(id: number): Promise<void> {
    await this.{entity}Repo.delete(id);

    await this.eventDispatcher.dispatchDomainEvent(
      "{DOMAIN_NAME}",
      "{entity}.deleted",
      { {entity}Id: id, deletedAt: new Date() }
    );
  }

  private async validateCreateData(data: Create{ENTITY_NAME}DTO): Promise<void> {
    // Implementar validaciones específicas
  }

  private async validateUpdateData(id: number, updates: Update{ENTITY_NAME}DTO): Promise<void> {
    // Implementar validaciones específicas
  }

  private mapToDTO({entity}: {ENTITY_NAME}Model): {ENTITY_NAME}DTO {
    return {
      id: {entity}.id,
      // Mapear propiedades necesarias
      createdAt: {entity}.createdAt,
      updatedAt: {entity}.updatedAt,
    };
  }
}
```

### Checklist de Code Review

```markdown
## ✅ Checklist de Code Review para Dominios

### Estructura y Organización
- [ ] El dominio tiene una responsabilidad clara y bien definida
- [ ] Los archivos están organizados según la estructura estándar
- [ ] Los nombres de archivos siguen las convenciones (kebab-case)
- [ ] Existe archivo de associations.ts
- [ ] Existe archivo de configuración del dominio

### Modelos y Asociaciones
- [ ] Los modelos usan TypeScript interfaces apropiadas
- [ ] Las asociaciones están bien definidas y no hay alias duplicados
- [ ] Se manejan correctamente las asociaciones cross-domain
- [ ] Los modelos incluyen validaciones necesarias

### Servicios
- [ ] Los servicios usan inyección de dependencias correctamente
- [ ] Se publican eventos para acciones importantes
- [ ] Hay manejo apropiado de errores
- [ ] Se validan los datos de entrada
- [ ] Los métodos tienen una sola responsabilidad

### Eventos
- [ ] Los nombres de eventos siguen la convención
- [ ] Los payloads de eventos contienen información útil
- [ ] Los suscriptores manejan errores sin afectar otros suscriptores
- [ ] Se evitan dependencias circulares

### Controladores
- [ ] Los endpoints siguen convenciones REST
- [ ] Hay validación de entrada apropiada
- [ ] Los errores se manejan correctamente
- [ ] Las respuestas tienen formato consistente

### Testing
- [ ] Existen tests unitarios para servicios
- [ ] Existen tests de integración para controladores
- [ ] Se testean los flujos de eventos
- [ ] Los tests cubren casos de error

### Documentación
- [ ] El código está bien documentado con JSDoc
- [ ] Existe README para el dominio
- [ ] Se documentan las interfaces públicas
- [ ] Se explican las reglas de negocio complejas

### Seguridad
- [ ] Se validan y sanitizan las entradas
- [ ] Se implementa autorización apropiada
- [ ] No se exponen datos sensibles
- [ ] Se registran acciones importantes para auditoría
```

---

## Recursos Adicionales

### Libros Recomendados
- **"Domain-Driven Design" by Eric Evans** - El libro original sobre DDD
- **"Implementing Domain-Driven Design" by Vaughn Vernon** - Implementación práctica
- **"Clean Architecture" by Robert Martin** - Principios de arquitectura limpia

### Herramientas Útiles
- **TypeDI** - Inyección de dependencias
- **routing-controllers** - Controladores decorados
- **class-validator** - Validación de DTOs
- **Jest** - Testing framework
- **Sequelize** - ORM para base de datos

### Patrones Complementarios
- **CQRS** (Command Query Responsibility Segregation)
- **Event Sourcing** - Almacenar eventos como fuente de verdad
- **Saga Pattern** - Coordinación de transacciones distribuidas
- **Repository Pattern** - Abstracción de acceso a datos

---

**¡Con estas mejores prácticas tendrás dominios robustos, mantenibles y escalables! 🚀**

---

## Sobre el Error de AI Services

**Sí, el error está exactamente en el dominio `ai-services`:**

```typescript
// ❌ PROBLEMA: Línea 241 en validateDomain()
const userRepository = Container.get("userRepository"); // ❌ Busca "userRepository"

// ✅ SOLUCIÓN: Debería ser
const userRepository = Container.get("domainUserRepository"); // ✅ Nombre correcto
```

**Fix inmediato para ai-services/index.ts:**

```typescript
validateDomain(): boolean {
  try {
    // FIX: Usar nombres correctos de servicios del dominio
    const userRepository = Container.get("domainUserRepository"); // ✅ Cambiar aquí
    const eventDispatcher = Container.get("domainEventDispatcher");

    const hasOpenAI = !!process.env.CHATGPT_API_KEY;
    const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;

    return !!(userRepository && eventDispatcher && (hasOpenAI || hasDeepSeek));
  } catch (error) {
    console.error("❌ AI Services domain validation error:", error);
    return false;
  }
}
```

Esto debería eliminar el error y que ambos dominios pasen la validación.