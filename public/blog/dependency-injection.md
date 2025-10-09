---
title: "Dependency Injection Without the Boilerplate"
date: "2024-03-05"
category: "TypeScript"
excerpt: "Exploring how TypeScript decorators enable elegant dependency injection patterns in Dependory, and why decorator-based DI is more powerful than you might think."
tags: ["TypeScript", "Decorators", "Design Patterns"]
---

# Dependency Injection Without the Boilerplate

Dependency Injection (DI) is a powerful pattern for managing object dependencies, but it often comes with significant boilerplate. TypeScript decorators offer an elegant solution.

## The Traditional Approach

Without DI, you might write:

```typescript
class UserService {
  private db: Database;
  private logger: Logger;
  
  constructor() {
    this.db = new Database();
    this.logger = new Logger();
  }
}
```

This creates tight coupling and makes testing difficult. Traditional DI frameworks require extensive configuration:

```typescript
// Configuration hell
container.register('Database', Database);
container.register('Logger', Logger);
container.register('UserService', UserService, ['Database', 'Logger']);
```

## The Decorator Approach

With Dependory, it's much simpler:

```typescript
@Singleton()
class Database {
  // ...
}

@Singleton()
class Logger {
  // ...
}

@Singleton()
class UserService {
  constructor(db: Database, logger: Logger) {
    // Automatically injected!
  }
}
```

## How It Works

### 1. Decorator Metadata

TypeScript's `emitDecoratorMetadata` compiler option emits runtime type information:

```typescript
// This metadata is automatically available at runtime
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService);
// [Database, Logger]
```

### 2. Registry Pattern

Dependory maintains a registry of instances:

```typescript
class Registry {
  private instances = new Map();
  
  resolve<T>(type: Constructor<T>): T {
    if (!this.instances.has(type)) {
      this.instances.set(type, this.create(type));
    }
    return this.instances.get(type);
  }
}
```

### 3. Automatic Injection

When a class is instantiated, Dependory:
1. Gets parameter types from metadata
2. Resolves each dependency from the registry
3. Constructs the instance with resolved dependencies

## Advanced Features

### Transient vs Singleton

Control instance lifetime:

```typescript
@Singleton()
class AppConfig {
  // One instance for the entire app
}

@Transient()
class RequestHandler {
  // New instance for each injection
}
```

### Custom Registries

Scope dependencies per module:

```typescript
const apiRegistry = new Registry();

@Singleton({ registry: apiRegistry })
class ApiService {
  // Only available in API module
}
```

### Property Injection

Inject into properties directly:

```typescript
@Singleton()
class MyService {
  @Inject()
  private logger: Logger;
  
  // No constructor needed!
}
```

## Real-World Benefits

### 1. Testability

Easy to swap implementations:

```typescript
@Singleton()
class MockDatabase extends Database {
  // Test implementation
}

// In tests, the mock is automatically injected
```

### 2. Modularity

Clear separation of concerns:

```typescript
@Singleton()
class AuthService {
  constructor(
    private db: Database,
    private crypto: CryptoService,
    private logger: Logger
  ) {
    // Each dependency is independently testable
  }
}
```

### 3. Reduced Boilerplate

No manual wiring needed:

```typescript
// Just instantiate the root
const app = new Application();
// All dependencies are resolved automatically
```

## Performance Considerations

Decorator-based DI has minimal overhead:

- **Metadata**: Emitted once at compile time
- **Reflection**: Only happens during initial construction
- **Runtime**: Negligible impact after initialization

## Common Pitfalls

### Circular Dependencies

Decorators can't solve circular dependencies:

```typescript
@Singleton()
class A {
  constructor(b: B) {} // Error if B depends on A
}
```

**Solution**: Use property injection or redesign dependencies.

### Type Information Loss

Interfaces don't exist at runtime:

```typescript
interface ILogger { }

@Singleton()
class MyService {
  constructor(logger: ILogger) {
    // Can't inject - interface not available at runtime
  }
}
```

**Solution**: Use abstract classes or concrete types.

## Conclusion

Decorator-based dependency injection combines the power of traditional DI frameworks with the elegance of TypeScript's type system. Dependory shows that good design doesn't require complexity.

Try [Dependory](https://github.com/H1ghBre4k3r/dependory) in your next TypeScript project and experience DI without the ceremony!
