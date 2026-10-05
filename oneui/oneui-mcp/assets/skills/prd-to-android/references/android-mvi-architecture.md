# Android Scalable Architecture Guidelines (MVI + Clean Architecture)

> **SSOT for AI code generation** on Android PRD→Compose (OneUI MCP).
> Load via `get_skill("prd-to-android")` → `get_skill_reference("prd-to-android", "references/android-mvi-architecture.md")`
> **before** authoring IR and **before** scaffolding feature layers around codegen output.

## How this maps to OneUI MCP codegen

| Layer | Who owns it |
|-------|-------------|
| **Presentation / screen UI** (JDS composables, Surface, tokens) | Prefer `codegen_from_ir(platform:"android")` / `figma_to_code` — catalog-grounded screen |
| **ViewModel · Intent · Action · UiState · Effect** | Agent authors per this doc — **not** emitted by IR codegen today |
| **Domain (UseCase, repo interfaces, models)** | Agent — when PRD §3 includes behaviour beyond static UI |
| **Data (repo impl, DTO, sources, mappers)** | Agent — stubs OK if §3a defers real API; still keep interfaces |

**Rules when wiring codegen output:**

1. Treat generated `@Composable fun XxxScreen()` as **presentation/screen** (or move it under `feature/.../presentation/screen/`).
2. Screen stays **stateless** where possible — collect `UiState` from ViewModel; never call Repository from the composable.
3. Do **not** put login/API/validation business logic inside the generated composable body.
4. Feature package follows the folder structure below; DI via Hilt.
5. UI tokens/components still obey `android-tokens` + JDS catalog (zero literal dp/hex).

If PRD §3 is **UI-only** (static shell, stub clicks), still create Intent/UiState/ViewModel stubs so the screen is MVI-ready; put real UseCases when §3 names auth/data.

---

## Architecture

- Presentation
  - Screen
  - ViewModel
  - UiState
  - Intent
  - Action
  - Effect (one-time events)
- Domain
  - UseCases
  - Repository interfaces
  - Domain models
- Data
  - Repository implementations
  - RemoteDataSource
  - LocalDataSource
  - DTOs
  - Entities
  - Mappers
- Core
  - Network
  - Database
  - DI
  - Logging
  - Analytics
  - Utils

## MVI Flow

User
→ Intent
→ ViewModel
→ Action
→ UseCase
→ Repository Interface
→ Repository Implementation
→ Remote/Local DataSource
→ API / Room
→ Repository
→ UseCase
→ ViewModel
→ UiState
→ Compose UI

## Rules

### UI
- Stateless composables whenever possible.
- State only comes from UiState.
- Never call repositories from UI.
- Never launch business logic from composables.

### ViewModel
Responsibilities:
- Convert Intent → Action
- Call UseCases
- Produce immutable UiState
- Emit one-time Effects
- Handle coroutine scope

Never:
- Access Retrofit
- Access Room
- Parse JSON
- Write SQL

### UseCase
- One business operation only.
- Suspend function.
- No Android framework dependency.

### Repository
Expose interfaces only from Domain.

Example:

```kotlin
interface MovieRepository {
    suspend fun getMovies(): Result<List<Movie>>
}
```

Implementation lives in data layer.

### Data Sources
RemoteDataSource
- Retrofit/Ktor only

LocalDataSource
- Room only

### Mapping

DTO
↓

Entity
↓

Domain Model
↓

UI Model

Never expose DTOs to UI.

### Error Handling

Use sealed Result.

```kotlin
sealed interface Result<out T>
```

No exceptions in UI.

### Coroutines

- ViewModelScope
- Dispatchers injected
- No GlobalScope

### Flow

Repository returns Flow when data changes.

### Compose

Use:
- StateFlow
- collectAsStateWithLifecycle()

Avoid mutable state inside ViewModel except backing state.

### Dependency Injection

Prefer Hilt.

Bindings:
- Repository interface
- Repository implementation
- DataSources
- Network
- Database

### Testing

Presentation
- ViewModel tests

Domain
- UseCase tests

Data
- Repository tests

UI
- Compose tests

### Folder Structure

```
feature/
    presentation/
        screen/
        components/
        ViewModel.kt
        Intent.kt
        Action.kt
        UiState.kt
        Effect.kt

    domain/
        usecase/
        repository/
        model/

    data/
        repository/
        datasource/
            remote/
            local/
        dto/
        entity/
        mapper/
```

## AI Rules

AI must:

- Follow Clean Architecture.
- Follow MVI.
- Generate immutable UiState.
- Use StateFlow.
- Use Hilt.
- Use Repository Interfaces.
- Use UseCases.
- Keep composables stateless.
- Write KDoc.
- Write method comments.
- Keep functions small.
- Apply SOLID.
- Never skip mapping layers.
- Never expose DTOs.
- Never access DB from ViewModel.
- Never access Retrofit from ViewModel.
- Prefer extension mappers.
- Prefer composition over inheritance.
- Prefer sealed interfaces for UI state/events.
- Obey OneUI/JDS token + catalog rules (`android-tokens`, `list_components(platform:"android")`) for all Compose UI.
