# 🛠️ Guía de Desarrollo de Dominios

## 📖 Índice

1. [Creando un Nuevo Dominio](#creando-un-nuevo-dominio)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Implementación Paso a Paso](#implementación-paso-a-paso)
4. [Sistema de Registro](#sistema-de-registro)
5. [Asociaciones entre Modelos](#asociaciones-entre-modelos)
6. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Creando un Nuevo Dominio

### Paso 1: Crear la Estructura de Carpetas

```bash
# Desde la raíz del proyecto
mkdir -p src/domains/mi-dominio/{controllers,services,models,subscribers,interfaces,validators,dtos}
```

### Paso 2: Archivos Básicos Requeridos

Cada dominio **DEBE** tener estos archivos:

```
src/domains/mi-dominio/
├── models/
│   ├── associations.ts     # ✅ OBLIGATORIO
│   └── index.ts           # ✅ OBLIGATORIO
├── mi-dominio.domain.ts   # ✅ OBLIGATORIO - Configuración
└── index.ts              # ✅ OBLIGATORIO - Registro DDD
```

---

## Estructura de Archivos

### 1. Archivo de Configuración del Dominio

**Archivo**: `src/domains/mi-dominio/mi-dominio.domain.ts`

```typescript
// src/domains/mi-dominio/mi-dominio.domain.ts
import { Container } from "typedi";

export const MI_DOMINIO_CONFIG = {
  name: "mi-dominio",
  version: "1.0.0", 
  description: "Descripción del dominio",
  
  // Dependencias de otros dominios
  dependencies: ["user-management", "notifications"],
  
  // Modelos que contiene
  models: ["MiModelo", "OtroModelo"],
  
  // Servicios que expone
  services: ["MiService", "OtroService"],
  
  // Eventos que publica
  events: [
    "mi-dominio.entidad.creada",
    "mi-dominio.entidad.actualizada",
    "mi-dominio.entidad.eliminada"
  ]
} as const;

// Función de validación
export function validateMiDominio(): boolean {
  try {
    const userRepo = Container.get("domainUserRepository");
    const eventDispatcher = Container.get("domainEventDispatcher");
    return !!(userRepo && eventDispatcher);
  } catch (error) {
    console.error("Validación del dominio falló:", error);
    return false;
  }
}
```

### 2. Archivo de Registro DDD

**Archivo**: `src/domains/mi-dominio/index.ts`

```typescript
// src/domains/mi-dominio/index.ts
import { Container } from "typedi";
import { DomainManager, IDomainRegistration } from "@/shared/di/domain.manager";

// ===== EXPORTACIONES =====
export { default as MiService } from "./services/mi.service";
export { default as MiController } from "./controllers/mi.controller";
export { default as MiModelo } from "./models/mi-modelo.model";
export { default as MiSubscriber } from "./subscribers/mi.subscriber";

// Importar funciones de asociaciones
import {
  initializeMiDominioAssociations,
  initializeCrossDomainAssociations,
  validateMiDominioAssociations,
} from "./models/associations";

// ===== CLASE DE REGISTRO DDD =====
class MiDominioDomain implements IDomainRegistration {
  domainName = "mi-dominio";
  version = "1.0.0";
  dependencies = ["user-management"]; // Dominios de los que depende
  
  events = [
    "mi-dominio.entidad.creada",
    "mi-dominio.entidad.actualizada"
  ] as const;

  // Modelos del dominio
  models = {
    MiModelo: require("./models/mi-modelo.model").default,
  };

  // Controladores del dominio
  controllers = {
    MiController: require("./controllers/mi.controller").default,
  };

  // Suscriptores de eventos
  subscribers = {
    MiSubscriber: require("./subscribers/mi.subscriber").default,
  };

  // Servicios del dominio
  services = {
    MiService: require("./services/mi.service").default,
  };

  // Fase 1: Inicializar modelos internos
  initializeModels(): void {
    initializeMiDominioAssociations();
  }

  // Fase 4: Configurar dependencias con otros dominios
  setupCrossDomainDependencies(dependencies: Record<string, any>): void {
    // Registrar dependencias en el contenedor
    if (dependencies.User) {
      Container.set("domainUserRepository", dependencies.User);
    }
    if (dependencies.eventDispatcher) {
      Container.set("domainEventDispatcher", dependencies.eventDispatcher);
    }

    // Inicializar asociaciones cruzadas
    initializeCrossDomainAssociations(dependencies);
  }

  // Fase 2: Inicializar servicios (automático con @Service())
  initializeServices(): void {
    // Los servicios se registran automáticamente con TypeDI
  }

  // Fase 5: Registrar controladores (automático con routing-controllers)
  registerControllers(): void {
    // Los controladores se registran automáticamente
  }

  // Fase 6: Registrar suscriptores de eventos
  registerSubscribers(): void {
    try {
      Container.get(this.subscribers.MiSubscriber);
    } catch (error) {
      console.warn("Error registrando suscriptores:", error);
    }
  }

  // Validación del dominio
  validateDomain(): boolean {
    return validateMiDominioAssociations?.() || true;
  }
}

// ===== FUNCIÓN DE REGISTRO =====
export function registerMiDominio(): void {
  const domainManager = DomainManager.getInstance();
  const domain = new MiDominioDomain();
  domainManager.registerDomain(domain);
}

// 🔥 IMPORTANTE: Auto-registro al importar
registerMiDominio();
```

### 3. Archivo de Asociaciones

**Archivo**: `src/domains/mi-dominio/models/associations.ts`

```typescript
// src/domains/mi-dominio/models/associations.ts
import MiModelo from "./mi-modelo.model";

/**
 * Asociaciones internas del dominio
 */
export function initializeMiDominioAssociations(): void {
  // Aquí van las relaciones entre modelos del mismo dominio
  // Ejemplo: MiModelo.hasMany(OtroModelo)
  
  console.log("✅ Mi Dominio: asociaciones internas inicializadas");
}

/**
 * Asociaciones con otros dominios
 */
export function initializeCrossDomainAssociations(
  dependencies: Record<string, any>
): void {
  const { User, Notification } = dependencies;

  // Verificar que las dependencias estén disponibles
  if (!User) {
    console.warn("⚠️ Modelo User no disponible para mi-dominio");
    return;
  }

  try {
    // Usuario puede tener muchos de MiModelo
    User.hasMany(MiModelo, {
      foreignKey: "userId",
      as: "misModelos",
    });

    // MiModelo pertenece a Usuario
    MiModelo.belongsTo(User, {
      foreignKey: "userId", 
      as: "usuario",
    });

    console.log("✅ Mi Dominio: asociaciones cruzadas inicializadas");
  } catch (error) {
    console.error("❌ Error en asociaciones cruzadas:", error);
  }
}

/**
 * Validar asociaciones
 */
export function validateMiDominioAssociations(): boolean {
  try {
    // Verificar que las asociaciones existan
    const hasUserAssociation = !!MiModelo.associations.usuario;
    
    if (hasUserAssociation) {
      console.log("✅ Mi Dominio: asociaciones validadas");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("❌ Validación de asociaciones falló:", error);
    return false;
  }
}
```

---

## Implementación Paso a Paso

### Paso 1: Crear el Modelo

**Archivo**: `src/domains/mi-dominio/models/mi-modelo.model.ts`

```typescript
// src/domains/mi-dominio/models/mi-modelo.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "@/shared/config/database";

class MiModelo extends Model {
  public id!: number;
  public userId!: number;
  public nombre!: string;
  public descripcion?: string;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MiModelo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "MiModelo",
    tableName: "mi_modelo",
    timestamps: true,
    underscored: true,
  }
);

export default MiModelo;
```

### Paso 2: Crear el Servicio

**Archivo**: `src/domains/mi-dominio/services/mi.service.ts`

```typescript
// src/domains/mi-dominio/services/mi.service.ts
import { Service, Inject } from "typedi";
import MiModelo from "../models/mi-modelo.model";
import { IEventDispatcher } from "@shared/interfaces/events.interfaces";

@Service()
export default class MiService {
  constructor(
    @Inject("domainEventDispatcher") private eventDispatcher: IEventDispatcher
  ) {}

  async crear(datos: { userId: number; nombre: string; descripcion?: string }) {
    try {
      // Validaciones de negocio
      await this.validarDatos(datos);

      // Crear el modelo
      const nuevoModelo = await MiModelo.create({
        userId: datos.userId,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        activo: true,
      });

      // Publicar evento
      await this.eventDispatcher.dispatchDomainEvent(
        "mi-dominio",
        "entidad.creada",
        {
          id: nuevoModelo.id,
          userId: datos.userId,
          nombre: datos.nombre,
          creadoEn: new Date(),
        }
      );

      return { success: true, data: nuevoModelo };
    } catch (error) {
      console.error("Error creando entidad:", error);
      throw new Error("No se pudo crear la entidad");
    }
  }

  async obtenerPorUsuario(userId: number) {
    const modelos = await MiModelo.findAll({
      where: { userId, activo: true },
      order: [["createdAt", "DESC"]],
    });

    return { success: true, data: modelos };
  }

  private async validarDatos(datos: any) {
    if (!datos.nombre || datos.nombre.trim().length < 3) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }
    
    if (datos.userId <= 0) {
      throw new Error("ID de usuario inválido");
    }
  }
}
```

### Paso 3: Crear el Controlador

**Archivo**: `src/domains/mi-dominio/controllers/mi.controller.ts`

```typescript
// src/domains/mi-dominio/controllers/mi.controller.ts
import { JsonController, Post, Get, Body, Param } from "routing-controllers";
import { Service } from "typedi";
import MiService from "../services/mi.service";

@Service()
@JsonController("/mi-dominio")
export default class MiController {
  constructor(private miService: MiService) {}

  @Post("/")
  async crear(@Body() datos: { userId: number; nombre: string; descripcion?: string }) {
    try {
      const resultado = await this.miService.crear(datos);
      return {
        success: true,
        message: "Entidad creada exitosamente",
        data: resultado.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  @Get("/usuario/:userId")
  async obtenerPorUsuario(@Param("userId") userId: number) {
    try {
      const resultado = await this.miService.obtenerPorUsuario(userId);
      return {
        success: true,
        data: resultado.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error obteniendo datos",
        data: [],
      };
    }
  }
}
```

### Paso 4: Crear el Suscriptor de Eventos

**Archivo**: `src/domains/mi-dominio/subscribers/mi.subscriber.ts`

```typescript
// src/domains/mi-dominio/subscribers/mi.subscriber.ts
import { Service } from "typedi";
import { EventSubscriber, OnEvent } from "@shared/decorators/event.decorators";
import { IDomainEvent } from "@shared/interfaces/events.interfaces";
import MiService from "../services/mi.service";

@Service()
@EventSubscriber("MiSubscriber")
export default class MiSubscriber {
  constructor(private miService: MiService) {}

  @OnEvent("user-management.user.registered")
  async onUsuarioRegistrado(event: IDomainEvent): Promise<void> {
    const { userId, email } = event.payload;
    
    console.log(`🎉 Nuevo usuario registrado: ${email}`);
    
    // Crear datos iniciales para el nuevo usuario
    await this.miService.crear({
      userId,
      nombre: "Configuración Inicial",
      descripcion: "Datos por defecto para nuevo usuario",
    });
  }

  @OnEvent("mi-dominio.entidad.creada")
  async onEntidadCreada(event: IDomainEvent): Promise<void> {
    const { id, userId, nombre } = event.payload;
    
    console.log(`✅ Nueva entidad creada: ${nombre} para usuario ${userId}`);
    
    // Aquí podrías disparar otras acciones
    // Como enviar notificaciones, actualizar estadísticas, etc.
  }
}
```

---

## Sistema de Registro

### Agregando tu Dominio al Registry

**Archivo**: `src/shared/di/domain.registry.ts`

```typescript
// Agregar importación en la lista de importaciones
private async importMiDominio(): Promise<void> {
  try {
    await import("../../domains/mi-dominio");
  } catch (error) {
    this.logger.warn("Mi Dominio no disponible:", error);
  }
}

// Agregar a la lista de registros
async registerAllDomains(): Promise<void> {
  // ... otros dominios ...
  this.importMiDominio(),
  // ... más dominios ...
}
```

### Configurando Dependencias

**Archivo**: `src/shared/di/domain.manager.ts`

```typescript
// En el método createDomainDependencies, agregar:
const domainDependencyMap: Record<string, string[]> = {
  // ... otros dominios ...
  "mi-dominio": ["User", "Notification"], // Modelos que necesita
  // ... más dominios ...
};
```

---

## Asociaciones entre Modelos

### Tipos de Asociaciones

```typescript
// 1. Uno a Muchos (hasMany / belongsTo)
User.hasMany(MiModelo, { foreignKey: "userId", as: "misModelos" });
MiModelo.belongsTo(User, { foreignKey: "userId", as: "usuario" });

// 2. Muchos a Muchos (belongsToMany)
User.belongsToMany(Rol, { 
  through: "user_roles", 
  foreignKey: "userId",
  otherKey: "rolId",
  as: "roles" 
});

// 3. Uno a Uno (hasOne / belongsTo)
User.hasOne(Perfil, { foreignKey: "userId", as: "perfil" });
Perfil.belongsTo(User, { foreignKey: "userId", as: "usuario" });
```

### Reglas Importantes

1. **Alias únicos**: Cada asociación debe tener un alias único
2. **Verificación de nulos**: Siempre verificar que los modelos existan
3. **Manejo de errores**: Usar try-catch en las asociaciones
4. **Logs claros**: Mostrar qué asociaciones se inicializaron

---

## Ejemplos Prácticos

### Ejemplo: Dominio de Comentarios

```typescript
// Estructura del dominio
src/domains/comentarios/
├── models/
│   ├── comentario.model.ts
│   ├── respuesta.model.ts
│   └── associations.ts
├── services/
│   ├── comentario.service.ts
│   └── moderacion.service.ts
├── controllers/
│   ├── comentario.controller.ts
│   └── admin-comentarios.controller.ts
├── subscribers/
│   └── comentario.subscriber.ts
├── comentarios.domain.ts
└── index.ts

// Eventos que publica
"comentarios.comentario.creado"
"comentarios.comentario.aprobado"
"comentarios.comentario.rechazado"
"comentarios.respuesta.creada"

// Eventos que consume
"user-management.user.registered" → Configurar preferencias
"learning-content.path.completed" → Solicitar comentario
```

### Ejemplo: Flujo Completo

```typescript
// 1. Usuario completa una ruta de aprendizaje
learning-content → "path.completed" → comentarios

// 2. Dominio de comentarios reacciona
@OnEvent("learning-content.path.completed")
async onPathCompleted(event) {
  // Crear invitación a comentar
  await this.crearInvitacionComentario(event.payload.userId, event.payload.pathId);
}

// 3. Usuario crea comentario
POST /comentarios → ComentarioController.crear()

// 4. Se publica evento
"comentarios.comentario.creado" → notifications, analytics

// 5. Otros dominios reaccionan
notifications → Envía notificación al autor de la ruta
analytics → Actualiza métricas de engagement
```

---

## Checklist de Implementación

### ✅ Antes de Implementar

- [ ] Definir claramente las responsabilidades del dominio
- [ ] Identificar dependencias con otros dominios  
- [ ] Diseñar los eventos que va a publicar/consumir
- [ ] Planificar la estructura de base de datos
- [ ] Documentar las reglas de negocio

### ✅ Durante la Implementación

- [ ] Crear estructura de carpetas
- [ ] Implementar modelos con validaciones
- [ ] Escribir servicios con lógica de negocio
- [ ] Crear controladores para endpoints
- [ ] Implementar suscriptores de eventos
- [ ] Configurar asociaciones internas y externas
- [ ] Agregar al sistema de registro

### ✅ Después de Implementar

- [ ] Probar todas las funcionalidades
- [ ] Verificar que los eventos se publican correctamente
- [ ] Confirmar que las asociaciones funcionan
- [ ] Documentar el API
- [ ] Agregar tests unitarios e integración

---

## Consejos y Mejores Prácticas

### 🎯 Naming Conventions

```typescript
// Nombres de archivos
mi-dominio.domain.ts          // ✅ Correcto: kebab-case
miDominio.domain.ts           // ❌ Incorrecto: camelCase

// Nombres de clases
class MiDominioService        // ✅ Correcto: PascalCase
class miDominioService        // ❌ Incorrecto: camelCase

// Nombres de eventos
"mi-dominio.entidad.creada"   // ✅ Correcto: kebab-case
"miDominio.entidad.creada"    // ❌ Incorrecto: camelCase

// Nombres de variables
const miVariable = "valor"    // ✅ Correcto: camelCase
const mi_variable = "valor"   // ❌ Incorrecto: snake_case
```

### 🚫 Errores Comunes a Evitar

1. **Dependencias Circulares**
   ```typescript
   // ❌ MALO: DominioA depende de DominioB y viceversa
   DominioA → DominioB → DominioA
   
   // ✅ BUENO: Comunicación a través de eventos
   DominioA → [evento] → DominioB
   ```

2. **Acceso Directo a Otros Dominios**
   ```typescript
   // ❌ MALO: Importar directamente
   import UserService from "../user-management/services/user.service";
   
   // ✅ BUENO: Usar eventos o interfaces
   await this.eventDispatcher.dispatchDomainEvent("user-management", "user.updated", data);
   ```

3. **Asociaciones con Alias Duplicados**
   ```typescript
   // ❌ MALO: Mismo alias en diferentes asociaciones
   User.hasMany(ModeloA, { as: "datos" });
   User.hasMany(ModeloB, { as: "datos" }); // Error!
   
   // ✅ BUENO: Alias únicos
   User.hasMany(ModeloA, { as: "datosA" });
   User.hasMany(ModeloB, { as: "datosB" });
   ```

4. **Olvidar el Auto-registro**
   ```typescript
   // ❌ MALO: Sin auto-registro
   export function registerMiDominio() { /* ... */ }
   
   // ✅ BUENO: Con auto-registro al final
   export function registerMiDominio() { /* ... */ }
   registerMiDominio(); // Esta línea es crucial!
   ```

### 💡 Tips de Debugging

```typescript
// 1. Logs para verificar registro
console.log("🔍 Mi Dominio registrándose...");

// 2. Logs para verificar dependencias
console.log("📦 Dependencias recibidas:", {
  User: !!User,
  Notification: !!Notification
});

// 3. Logs para verificar asociaciones
console.log("🔗 Asociaciones:", Object.keys(MiModelo.associations));

// 4. Logs para verificar eventos
console.log("📡 Evento publicado:", eventName, payload);
```

---

## Próximos Pasos

Una vez que hayas creado tu primer dominio, continúa con:

1. **[Guía del Sistema de Eventos](./ddd_events_guide_es.md)** - Comunicación avanzada entre dominios
2. **[Guía de Testing](./ddd_testing_guide_es.md)** - Cómo testear dominios
3. **[Guía de Deployment](./ddd_deployment_guide_es.md)** - Despliegue y migración

---

**¡Felicidades! Ahora sabes cómo crear dominios completos en el sistema DDD de Pathway! 🚀**