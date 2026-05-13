---
name: "Rabbit-Habit Project Guidelines"
description: "AI assistant guidelines for Rabbit-Habit, a React Native/Expo PWA habit tracker with TypeScript, Zustand state management, and GitHub Pages deployment."
applyTo: ["**/*.tsx", "**/*.ts"]
---

# Rabbit-Habit Project Guidelines

**Rabbit-Habit** is a habit tracking Progressive Web Application built with React Native, Expo, and TypeScript. It uses Zustand for state management with AsyncStorage persistence, Restyle for theming, and deploys to GitHub Pages.

## Quick Start Commands

- **Dev**: `npm start` (Expo dev server) or `npm run web` (web preview)
- **Build**: `npm run build:web` (production web build)
- **Test**: No test suite currently configured
- **Type Check**: TypeScript with `strict: true` enabled (`tsconfig.json`)

## Architecture & Module Organization

### Feature-Based Structure
The codebase uses **feature-based folder organization**. Each feature lives in `src/features/` with its own:
- `screens/` — Screen containers
- `components/` — Feature-specific UI components  
- `hooks/` — Feature-scoped selector hooks

**Active features**:
- `src/features/tasks/` — Task management (create, edit, list, toggle)
- `src/features/categories/` — Category management
- `src/features/home/` — Home screen with navigation

**Shared code** in `src/shared/`:
- `components/` — Reusable components (FormInput, ErrorBoundary, skeletons)
- `hooks/` — Cross-feature hooks (useHydration)
- `utils/` — Theme, colors, text variants, helpers

**Supporting modules**:
- `src/store/index.ts`— Global Zustand store (single global state)
- `src/navigation/index.ts` — React Navigation setup
- `src/types/index.d.ts` — Global type definitions

**⚠️ Legacy code** (not actively maintained):
- `src/screen/` — Deprecated duplicate of features folder; prefer `src/features/`
- Old `src/components/` — Superseded by shared and feature components

### Path Aliases
Use `@/*` for clean imports (configured in `tsconfig.json` and `babel.config.js`):
```typescript
import FormInput from "@/shared/components/FormInput";
import useGlobalStore from "@/store";
import { useTasks } from "@/features/tasks/hooks";
```

## Naming Conventions

| Element | Convention | Examples |
|---------|-----------|----------|
| **Folders** (screens) | kebab-case | `create-task/`, `edit-task/`, `create-category/` |
| **Component files** | PascalCase `.tsx` | `TaskListItem.tsx`, `FormInput.tsx`, `CategoryPickerField.tsx` |
| **Hook files** | camelCase `.ts` | `useTasks.ts`, `useCategories.ts`, `useHydration.ts` |
| **Store/utils** | camelCase `.ts` | `index.ts`, `colors.ts`, `text-variants.ts` |
| **Screen index** | Nested `index.tsx` inside PascalCase folder | `src/features/tasks/screens/CreateTask/index.tsx` |
| **Type interfaces** | PascalCase with `I` prefix | `ITask`, `ICategory`, `IColor` |
| **Component exports** | PascalCase | `export default function TaskListItem() { ... }` |
| **Hook exports** | Prefix with `use` | `export const useTasks = () => { ... }` |
| **Action names** | camelCase semantic verbs | `addTask()`, `deleteCategory()`, `toggleTaskStatus()` |
| **Loading flags** | `is{Action}` or `_hasHydrated` | `isCreatingTask`, `_hasHydrated` |
| **Generated IDs** | Entity prefix + nanoid | `task_${nanoid()}`, `category_${nanoid()}` |

## State Management (Zustand + AsyncStorage)

### Store Shape
The global store (`src/store/index.ts`) manages:
- **Data**: `categories`, `tasks`, `selectedCategory`
- **Loading**: `isCreatingTask`, `isDeletingTask`, `_hasHydrated`
- **Actions**: Task mutations (add, delete, update), category mutations, and state setters

### Key Patterns

**1. Persistence with Versioning**
```typescript
const useGlobalStore = create(
  persist(
    (set) => ({ /* state and actions */ }),
    {
      name: "...store",
      version: 1,
      migrate: (state, version) => { /* v1→v2 migrations go here */ }
    }
  )
);
```

**2. Rehydration State**
```typescript
// Track when AsyncStorage has been loaded
const useHydration = () => useGlobalStore(state => state._hasHydrated);

// Usage: show skeleton while rehydrating
const Home = () => {
  const hasHydrated = useHydration();
  if (!hasHydrated) return <HomeScreenSkeleton />;
  // ...render app
};
```

**3. Feature-Scoped Selector Hooks**
Wrap the global store to expose only relevant data and actions:
```typescript
export const useTasks = (categoryId?: string) => {
  const { tasks, addTask, deleteTask, isCreatingTask } = useGlobalStore();
  const filtered = categoryId 
    ? tasks.filter(t => t.categoryId === categoryId)
    : tasks;
  return { tasks: filtered, addTask, deleteTask, isCreatingTask };
};
```

**4. Cascading Deletes**
When a category is deleted, all tasks in that category are also removed.

**5. Optimistic Updates**
Store actions directly mutate state (e.g., `toggleTaskStatus()` immediately reflects in UI); loading flags control UI feedback.

## Styling with Restyle

### Theme Setup
Defined in `src/shared/utils/theme/index.ts`:
```typescript
const theme = createTheme({
  colors: { /* semantic names like dark800, white, etc */ },
  textVariants: { textBase, textXl, text2Xl, /* ... */ },
  spacing: { 1: 4, 2: 8, 3: 12, /* ... 4px units */ },
  borderRadii: { rounded: 4, roundedXl: 8 }
});
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
```

### Usage Pattern
Style components with props:
```typescript
<Box bg="dark800" p="4" borderRadius="rounded2Xl" flexDirection="row">
  <Text variant="textXl" color="white">Label</Text>
</Box>
```

**Key colors and variants**: See `src/shared/utils/theme/colors.ts` and `text-variants.ts`.

## Component Patterns

### Container vs Presentational
- **Container components** (screens) manage state and pass data down
- **Presentational components** receive props and render UI
- Feature hooks (`useTasks`) manage the data layer

### Form Components
- Use `FormInput` from `@/shared/components/FormInput` for consistency
- Maintain form state locally with `useState()` during creation/editing
- Commit to store only on successful submission
- See [CreateTask screen](src/features/tasks/screens/CreateTask/index.tsx) for example

### Skeleton/Loading States
During rehydration or async operations, show skeleton components:
- `HomeScreenSkeleton`, `TaskSkeleton`, `CategorySkeleton`, `ShimmerBox`
- Always check `useHydration()` before rendering main content

### Error Handling
`ErrorBoundary` component catches rendering errors and corrupt persisted state:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Development Workflow

### When Adding a New Feature

1. **Create feature scaffold** in `src/features/{featureName}/`:
   ```
   src/features/{featureName}/
   ├── screens/{ScreenName}/index.tsx
   ├── components/FeatureComponent.tsx
   └── hooks/useFeatureName.ts
   ```

2. **Define types** in `src/types/index.d.ts` (IFeature, etc.)

3. **Extend store** (`src/store/index.ts`) if needed with new state/actions

4. **Create selector hook** (`hooks/useFeatureName.ts`) wrapping the store

5. **Use shared components** (FormInput, Box, Text) for styling consistency

6. **Add screens to navigation** (`src/navigation/index.tsx`)

### When Modifying State

1. Update the `IGlobalStore` interface
2. Add/remove actions in the store factory
3. Update version number if schema changes
4. Add migration logic for existing persisted data
5. Update selector hooks to reflect new interface

### Adding a Component

- **Feature-specific**? → `src/features/{feature}/components/`
- **Reusable across features**? → `src/shared/components/`
- Use Restyle Box/Text for styling; avoid inline styles
- Export as named export or default based on project style

## Build & Deployment

### Web Build Process
```bash
npm run build:web
# → Expo export:web + node scripts/postprocess-pages-build.js
# → Outputs to /web-build/
```

### GitHub Pages Deployment
- Configured in `.github/workflows/deploy-pages.yml`
- Triggers on push to `main`
- Publishes `/web-build/` to GitHub Pages
- **Site URL**: https://m-ccool.github.io/Rabbit-Habit/

### Mobile Builds
EAS configured in `eas.json` for preview and production builds.

## Known Limitations & Opportunities

### Current State
- ✅ All data stored locally (no backend)
- ✅ Strong TypeScript typing (strict mode)
- ✅ Cross-platform support (iOS, Android, Web)
- ✅ Responsive with Restyle theming

### Gaps to Avoid
- ❌ No ESLint/Prettier config (consider adding for consistency)
- ❌ No automated tests (testing framework opportunity)
- ❌ No analytics or telemetry
- ❌ No backend/API (if needed, add API layer abstraction)

### Legacy Code to Clean Up
- Remove `src/screen/` (superseded by `src/features/`)
- Clean up unused files in old `src/components/`
- Consolidate duplicate theme/utils (currently in `src/utils/` and `src/shared/utils/`)

## Key Files to Reference

| File | Purpose |
|------|---------|
| [src/store/index.ts](/workspaces/Rabbit-Habit/src/store/index.ts) | Zustand store with persistence, versioning, actions |
| [src/shared/utils/theme/index.ts](/workspaces/Rabbit-Habit/src/shared/utils/theme/index.ts) | Restyle theme primitives and setup |
| [src/features/tasks/hooks/useTasks.ts](/workspaces/Rabbit-Habit/src/features/tasks/hooks/useTasks.ts) | Example feature-scoped selector hook |
| [src/features/tasks/screens/CreateTask/index.tsx](/workspaces/Rabbit-Habit/src/features/tasks/screens/CreateTask/index.tsx) | Form screen with local state + store integration |
| [src/shared/components/FormInput.tsx](/workspaces/Rabbit-Habit/src/shared/components/FormInput.tsx) | Reusable form input with theme integration |
| [src/shared/hooks/useHydration.ts](/workspaces/Rabbit-Habit/src/shared/hooks/useHydration.ts) | Rehydration tracking pattern |
| [src/navigation/index.tsx](/workspaces/Rabbit-Habit/src/navigation/index.tsx) | React Navigation setup and type-safe params |

## Common Mistakes to Avoid

1. **Importing from old paths**: Use `src/features/` not `src/screen/`; use `@/shared` not local paths
2. **Bypassing selector hooks**: Always use feature hooks (useTasks, useCategories) instead of direct store access
3. **Ignoring rehydration**: Always check `useHydration()` before rendering main content
4. **Inline styles**: Use Restyle Box/Text props; theme colors are defined, use them
5. **IDs without prefix**: Always prefix generated IDs with entity type (`task_`, `category_`)
6. **Type mismatches**: Update the `IGlobalStore` interface when store changes
7. **Forgetting migrations**: If store schema changes, bump version and add migrate callback

## Questions or Edge Cases?

1. **Need to add a new data entity?** → Define interface in `types/index.d.ts`, extend store, create selector hook
2. **Multiple stores vs single store?** → Keep single global store; use selector hooks for feature isolation
3. **Async operations (network)?** → Add loading flags to store; use optimistic updates with error fallbacks
4. **Navigation changes?** → Update `src/navigation/types.ts` with type-safe param definitions
5. **Styling a new component?** → Use Restyle Box/Text with theme colors (colors.ts) and textVariants

---

**Last Updated**: May 2026  
**Codebase Healthy**: TypeScript strict mode, feature-based org, clear patterns — ready for expansion
