# 🔧 Guía de Troubleshooting DDD

## 📖 Índice

1. [Problemas de Inicialización](#problemas-de-inicialización)
2. [Errores de Registro de Dominios](#errores-de-registro-de-dominios)
3. [Problemas de Asociaciones](#problemas-de-asociaciones)
4. [Errores de Eventos](#errores-de-eventos)
5. [Problemas de Dependencias](#problemas-de-dependencias)
6. [Debugging Paso a Paso](#debugging-paso-a-paso)
7. [Herramientas de Diagnóstico](#herramientas-de-diagnóstico)
8. [FAQ - Preguntas Frecuentes](#faq---preguntas-frecuentes)

---

## Problemas de Inicialización

### ❌ "No domains were registered - application will start with no domain functionality"

**Síntoma**: Los dominios se importan pero no se registran.

**Logs típicos**:
```
📦 Domain imports completed: 15/15 domains imported
📦 Domain registration completed: 0 domains registered
⚠️ No domains were registered
```

**Causa**: Los archivos de dominio se importan pero las funciones de registro no se ejecutan.

**Solución**:
```typescript
// ✅ CORRECTO: Al final de cada dominio index.ts
export function registerMiDominio(): void {
  const domainManager = DomainManager.getInstance();
  const domain = new MiDominioDomain();
  domainManager.registerDomain(domain);
}

// 🔥 CRÍTICO: Esta línea debe estar al final
registerMiDominio(); // ← Sin esta línea, no se registra!
```

**Verificación**:
```bash
# Buscar dominios sin auto-registro
grep -r "export function register.*Domain" src/domains/ | while read file; do
  domain_file=$(echo $file | cut -d: -f1)
  if ! grep -q "register.*Domain();" "$domain_file"; then
    echo "❌ Falta auto-registro en: $domain_file"
  fi
done
```

---

### ❌ "Application initialization failed: Cannot read properties of undefined (reading 'hasMany')"

**Síntoma**: Error fatal durante la inicialización de asociaciones.

**Logs típicos**:
```
❌ Failed to setup progress dependencies: Cannot read properties of undefined (reading 'hasMany')
```

**Causa**: Un modelo es `undefined` cuando se intenta crear una asociación.

**Diagnosis**:
```typescript
// ✅ Agregar logs de debug en associations.ts
export function initializeCrossDomainAssociations(dependencies: Record<string, any>): void {
  const { User, Path, Milestone, Question, Answer } = dependencies;

  // 🔍 DEBUG: Verificar qué modelos están disponibles
  console.log("🔍 Dependencias recibidas:", {
    User: !!User,
    Path: !!Path,
    Milestone: !!Milestone,
    Question: !!Question,
    Answer: !!Answer,
  });

  // ✅ Verificar antes de usar
  if (!User) {
    console.warn("⚠️ User model no disponible");
    return;
  }
  
  // ✅ Wrap en try-catch
  try {
    User.hasMany(MiModelo, { foreignKey: "userId", as: "misModelos" });
  } catch (error) {
    console.error("❌ Error en asociación User->MiModelo:", error);
  }
}
```

**Solución completa**:
```typescript
export function initializeCrossDomainAssociations(dependencies: Record<string, any>): void {
  const { User, Path, Milestone, Question, Answer } = dependencies;

  // Verificaciones de seguridad
  const requiredModels = { User, Path, Milestone };
  const optionalModels = { Question, Answer };
  
  for (const [name, model] of Object.entries(requiredModels)) {
    if (!model) {
      console.warn(`⚠️ Required model ${name} not available - skipping associations`);
      return;
    }
  }

  // Asociaciones requeridas
  try {
    User.hasMany(PathEnrollment, { foreignKey: "userId", as: "pathEnrollments" });
    PathEnrollment.belongsTo(User, { foreignKey: "userId", as: "user" });
    console.log("✅ User associations initialized");
  } catch (error) {
    console.error("❌ User associations failed:", error);
  }

  // Asociaciones opcionales
  if (Question && Answer) {
    try {
      Question.hasMany(AssessmentResponse, { foreignKey: "questionId", as: "responses" });
      Answer.hasMany(AssessmentResponse, { foreignKey: "answerId", as: "selectedResponses" });
      console.log("✅ Question/Answer associations initialized");
    } catch (error) {
      console.error("❌ Question/Answer associations failed:", error);
    }
  } else {
    console.log("⚠️ Question/Answer models not available - skipping optional associations");
  }
}
```

---

## Errores de Registro de Dominios

### ❌ "Domain X already registered"

**Síntoma**: Warnings sobre dominios ya registrados.

**Causa**: El dominio se está registrando múltiples veces.

**Diagnosis**:
```bash
# Buscar múltiples llamadas a registro
grep -r "registerMiDominio()" src/domains/mi-dominio/
```

**Solución**:
```typescript
// ✅ Agregar protección contra registro múltiple
let isRegistered = false;

export function registerMiDominio(): void {
  if (isRegistered) {
    console.warn("⚠️ Mi dominio ya está registrado");
    return;
  }
  
  const domainManager = DomainManager.getInstance();
  const domain = new MiDominioDomain();
  domainManager.registerDomain(domain);
  
  isRegistered = true;
}
```

---

### ❌ "Service with 'X' identifier was not found in the container"

**Síntoma**: Error al intentar acceder a servicios que no existen.

**Logs típicos**:
```
ServiceNotFoundError: Service with "userRepository" identifier was not found
ServiceNotFoundError: Service with "domainEmailService" identifier was not found
```

**Causa**: 
1. Dependencia no configurada en `domain.manager.ts`
2. Servicio no registrado en el dominio proveedor
3. Nombre incorrecto del servicio

**Diagnosis paso a paso**:

1. **Verificar mapping de dependencias**:
```typescript
// En domain.manager.ts
const domainDependencyMap: Record<string, string[]> = {
  "mi-dominio": ["User", "Path", "Milestone"], // ¿Está mi dominio aquí?
};

const serviceDependencyMap: Record<string, string[]> = {
  "mi-dominio": ["domainEmailService", "domainNotificationService"], // ¿Y aquí?
};
```

2. **Verificar registro de servicios cross-domain**:
```typescript
// En domain.manager.ts -> registerCrossDomainServices()
const crossDomainServiceMap: Record<string, Record<string, string>> = {
  email: {
    EmailServiceManager: "domainEmailService", // ¿Se registra este servicio?
  },
};
```

3. **Verificar nombre del servicio**:
```typescript
// ❌ INCORRECTO: Nombre inconsistente
Container.get("userRepository")        // Busca "userRepository"
Container.set("domainUserRepository")  // Pero está registrado como "domainUserRepository"

// ✅ CORRECTO: Nombres consistentes
Container.get("domainUserRepository")  // Coincide con el registro
```

**Solución**:
```typescript
// Agregar verificación de servicios opcionales
@Service()
export class MiService {
  private emailService?: IEmailService;
  
  constructor(
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher
  ) {
    // Dependencia opcional
    try {
      this.emailService = Container.get("domainEmailService");
      console.log("✅ Email service disponible");
    } catch {
      console.warn("⚠️ Email service no disponible - funcionalidad limitada");
    }
  }

  async doSomething() {
    // Verificar antes de usar
    if (this.emailService) {
      await this.emailService.sendEmail(...);
    } else {
      console.log("⚠️ Saltando envío de email - servicio no disponible");
    }
  }
}
```

---

## Problemas de Asociaciones

### ❌ "You have used the alias 'X' in two separate associations"

**Síntoma**: Error fatal de Sequelize por alias duplicados.

**Logs típicos**:
```
SequelizeAssociationError: You have used the alias milestoneProgress in two separate associations
```

**Causa**: Múltiples asociaciones usan el mismo alias.

**Diagnosis**:
```bash
# Buscar alias duplicados
grep -r "as: \"milestoneProgress\"" src/domains/
```

**Solución**:
```typescript
// ❌ PROBLEMA: Alias duplicados
PathEnrollment.hasMany(EnrollmentMilestoneProgress, {
  as: "milestoneProgress" // ← Usado aquí
});

LearningPath.hasMany(EnrollmentMilestoneProgress, {
  as: "milestoneProgress" // ← Y también aquí!
});

// ✅ SOLUCIÓN: Alias únicos
PathEnrollment.hasMany(EnrollmentMilestoneProgress, {
  as: "enrollmentMilestoneProgress" // ← Único y descriptivo
});

LearningPath.hasMany(EnrollmentMilestoneProgress, {
  as: "learningMilestoneProgress" // ← Único y descriptivo
});
```

**Script para detectar alias duplicados**:
```bash
#!/bin/bash
# scripts/check-duplicate-aliases.sh

echo "🔍 Buscando alias duplicados..."

# Extraer todos los alias
grep -r "as: [\"']" src/domains/ | \
  sed -E "s/.*as: [\"']([^\"']+)[\"'].*/\1/" | \
  sort | uniq -d > duplicate_aliases.txt

if [ -s duplicate_aliases.txt ]; then
  echo "❌ Alias duplicados encontrados:"
  cat duplicate_aliases.txt
  exit 1
else
  echo "✅ No se encontraron alias duplicados"
fi
```

---

## Errores de Eventos

### ❌ Eventos no se publican

**Síntoma**: Los suscriptores no reaccionan a eventos.

**Diagnosis**:
```typescript
// ✅ Agregar logs de debug en servicios
@Service()
export class MiService {
  @EventPublisher()
  private eventDispatcher!: IEventDispatcher;

  async hacerAlgo() {
    console.log("🔍 Publicando evento...");
    
    await this.eventDispatcher.dispatchDomainEvent(
      "mi-dominio",
      "algo.hecho",
      { id: 123 }
    );
    
    console.log("✅ Evento publicado");
  }
}
```

**Verificar decorator**:
```typescript
// ❌ PROBLEMA: Sin @EventPublisher
@Service()
export class MiService {
  constructor(
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher
  ) {}
}

// ✅ SOLUCIÓN: Con @EventPublisher
@Service()
export class MiService {
  @EventPublisher()
  private eventDispatcher!: IEventDispatcher;
}
```

---

### ❌ Suscriptores no se registran

**Síntoma**: Error "Service not found" al registrar suscriptores.

**Causa**: Falta decorador `@Service()` en suscriptor.

**Solución**:
```typescript
// ❌ PROBLEMA: Sin @Service()
@EventSubscriber("MiSubscriber")
export class MiSubscriber {
  @OnEvent("mi-dominio.algo.hecho")
  async onAlgoHecho(event: IDomainEvent) { }
}

// ✅ SOLUCIÓN: Con @Service()
@Service()
@EventSubscriber("MiSubscriber")
export class MiSubscriber {
  @OnEvent("mi-dominio.algo.hecho")
  async onAlgoHecho(event: IDomainEvent) { }
}
```

---

### ❌ "Event pattern not matching"

**Síntoma**: Suscriptores no reaccionan por patrones incorrectos.

**Diagnosis**:
```typescript
// ✅ Agregar debug subscriber
@Service()
@EventSubscriber("DebugSubscriber")
export class DebugSubscriber {
  @OnEvent("*") // Escuchar TODOS los eventos
  async debugAllEvents(event: IDomainEvent): Promise<void> {
    console.log("🔍 EVENT DEBUG:", {
      eventName: event.eventName,
      domain: event.domainOrigin,
      expectedPattern: "mi-dominio.algo.hecho", // ¿Coincide?
    });
  }
}
```

**Patrones comunes**:
```typescript
// Patrones exactos
@OnEvent("user-management.user.registered") // Solo este evento exacto

// Patrones con wildcard
@OnEvent("user-management.*")               // Todos los eventos del dominio
@OnEvent("*.user.registered")               // user.registered de cualquier dominio
@OnEvent("*")                               // TODOS los eventos

// Múltiples patrones
@OnEvent(["user.registered", "user.updated"]) // Varios eventos específicos
```

---

## Problemas de Dependencias

### ❌ Circular Dependency

**Síntoma**: Error al intentar instanciar servicios.

**Diagnosis**:
```bash
# Buscar imports circulares
madge --circular src/